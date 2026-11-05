package com.khandualoom.microservice.inventory.infrastructure.concurrency;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class SkuAdmissionControl {

    private final int maxConcurrentPerSku;
    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<Long, Semaphore> skuSemaphores = new ConcurrentHashMap<>();

    public SkuAdmissionControl(
            @Value("${khandualoom.inventory.max-concurrent-per-sku:50}") int maxConcurrentPerSku,
            MeterRegistry meterRegistry) {
        this.maxConcurrentPerSku = maxConcurrentPerSku;
        this.meterRegistry = meterRegistry;
    }

    public boolean tryAcquire(Long productId, Duration timeout) {
        Semaphore semaphore = skuSemaphores.computeIfAbsent(productId, k -> new Semaphore(maxConcurrentPerSku, true));
        try {
            boolean acquired = semaphore.tryAcquire(timeout.toMillis(), TimeUnit.MILLISECONDS);
            if (!acquired) {
                log.warn("SKU admission control rejected request for productId={}: limit of {} concurrent locks reached",
                        productId, maxConcurrentPerSku);
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

    public void release(Long productId) {
        Semaphore semaphore = skuSemaphores.get(productId);
        if (semaphore != null) {
            semaphore.release();
        }
    }

    public int getAvailablePermits(Long productId) {
        Semaphore semaphore = skuSemaphores.get(productId);
        return semaphore != null ? semaphore.availablePermits() : maxConcurrentPerSku;
    }
}
