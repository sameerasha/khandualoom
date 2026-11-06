package com.khandualoom.microservice.inventory.infrastructure.concurrency;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

/**
 * Enterprise Distributed Inventory Admission Control.
 * Combines distributed Redis Token Bucket with server-side time and local JVM semaphore defense-in-depth.
 * Protects PostgreSQL row locks from connection pool starvation under 10,000 req/s flash sales.
 * If Redis is unavailable, it gracefully fails closed to a bounded local JVM semaphore without bypassing database safeguards.
 */
@Component
@Slf4j
public class SkuAdmissionControl {

    private final int maxConcurrentPerSku;
    private final int localJvmPermits;
    private final MeterRegistry meterRegistry;
    private final StringRedisTemplate redisTemplate;
    private final ConcurrentHashMap<Long, Semaphore> localSemaphores = new ConcurrentHashMap<>();

    private static final String REDIS_LUA_SCRIPT = """
            local key = KEYS[1]
            local capacity = tonumber(ARGV[1])
            local refill_rate = tonumber(ARGV[2])
            local requested = tonumber(ARGV[3])
            local ttl = tonumber(ARGV[4])

            -- Use Redis server time
            local time_res = redis.call('TIME')
            local now_ms = (tonumber(time_res[1]) * 1000) + math.floor(tonumber(time_res[2]) / 1000)

            local data = redis.call('HMGET', key, 'tokens', 'last_refill')
            local current_tokens = tonumber(data[1])
            local last_refill = tonumber(data[2])

            if current_tokens == nil or last_refill == nil then
                current_tokens = capacity
                last_refill = now_ms
            else
                local elapsed_ms = math.max(0, now_ms - last_refill)
                local tokens_to_add = (elapsed_ms / 1000.0) * refill_rate
                current_tokens = math.min(capacity, current_tokens + tokens_to_add)
                last_refill = now_ms
            end

            if current_tokens >= requested then
                current_tokens = current_tokens - requested
                redis.call('HMSET', key, 'tokens', current_tokens, 'last_refill', last_refill)
                redis.call('EXPIRE', key, ttl)
                return 1
            else
                redis.call('HMSET', key, 'tokens', current_tokens, 'last_refill', last_refill)
                redis.call('EXPIRE', key, ttl)
                return 0
            end
            """;

    private final RedisScript<Long> tokenBucketScript = new DefaultRedisScript<>(REDIS_LUA_SCRIPT, Long.class);

    @Autowired
    public SkuAdmissionControl(
            @Value("${khandualoom.inventory.max-concurrent-per-sku:50}") int maxConcurrentPerSku,
            MeterRegistry meterRegistry,
            @Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.maxConcurrentPerSku = maxConcurrentPerSku;
        this.localJvmPermits = maxConcurrentPerSku;
        this.meterRegistry = meterRegistry;
        this.redisTemplate = redisTemplate;
    }

    public SkuAdmissionControl(int maxConcurrentPerSku, MeterRegistry meterRegistry) {
        this(maxConcurrentPerSku, meterRegistry, null);
    }

    /**
     * Attempts to acquire admission permit across distributed Redis cluster and local JVM limits.
     *
     * @param productId The SKU identifier
     * @param timeout   Maximum local wait duration
     * @return true if accepted; false if rejected due to high flash-sale contention
     */
    public boolean tryAcquire(Long productId, Duration timeout) {
        // 1. Distributed Redis Token Bucket Check
        if (redisTemplate != null) {
            try {
                String key = "khandualoom:admission:" + productId;
                List<String> keys = Collections.singletonList(key);
                Long result = redisTemplate.execute(
                        tokenBucketScript,
                        keys,
                        String.valueOf(maxConcurrentPerSku),
                        String.valueOf(maxConcurrentPerSku),
                        "1",
                        "60"
                );

                if (result != null && result == 0L) {
                    log.warn("Cluster SkuAdmissionControl: Distributed limit exceeded for SKU #{}", productId);
                    meterRegistry.counter("khandualoom.inventory.admission_control.rejected", "productId", String.valueOf(productId)).increment();
                    return false;
                }
            } catch (Exception e) {
                log.warn("Redis admission check failed for SKU #{}: {}. Safely falling back to local JVM limits.",
                        productId, e.getMessage());
                meterRegistry.counter("khandualoom.inventory.admission_control.redis_fallback", "productId", String.valueOf(productId)).increment();
            }
        }

        // 2. Local JVM Semaphore Check (Defense-in-Depth)
        Semaphore semaphore = localSemaphores.computeIfAbsent(productId, k -> new Semaphore(localJvmPermits, true));
        try {
            boolean acquired = semaphore.tryAcquire(timeout.toMillis(), TimeUnit.MILLISECONDS);
            if (!acquired) {
                log.warn("Local SkuAdmissionControl rejected request for SKU #{}: Local container limit of {} permits saturated",
                        productId, localJvmPermits);
                meterRegistry.counter("khandualoom.inventory.admission_control.rejected", "productId", String.valueOf(productId)).increment();
                return false;
            }
            meterRegistry.counter("khandualoom.inventory.admission_control.accepted", "productId", String.valueOf(productId)).increment();
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            meterRegistry.counter("khandualoom.inventory.admission_control.interrupted", "productId", String.valueOf(productId)).increment();
            return false;
        }
    }

    /**
     * Releases local container permit.
     */
    public void release(Long productId) {
        Semaphore semaphore = localSemaphores.get(productId);
        if (semaphore != null) {
            semaphore.release();
        }
    }

    public int getAvailablePermits(Long productId) {
        Semaphore semaphore = localSemaphores.get(productId);
        return semaphore != null ? semaphore.availablePermits() : localJvmPermits;
    }
}
