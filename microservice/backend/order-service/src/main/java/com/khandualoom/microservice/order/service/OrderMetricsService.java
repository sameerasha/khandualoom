package com.khandualoom.microservice.order.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

/**
 * Micrometer Observability Metrics Service for Order & Payment Operations.
 * Emits custom counters and timers scraped by Prometheus and displayed on Grafana.
 */
@Service
public class OrderMetricsService {

    private final Counter ordersCreatedCounter;
    private final Counter ordersAmountCounter;
    private final Counter paymentsCompletedCounter;
    private final Counter paymentsFailedCounter;
    private final Timer orderProcessingTimer;

    public OrderMetricsService(MeterRegistry registry) {
        this.ordersCreatedCounter = Counter.builder("orders.created.total")
                .description("Total number of customer orders created")
                .tag("service", "order-service")
                .register(registry);

        this.ordersAmountCounter = Counter.builder("orders.revenue.amount.inr")
                .description("Total gross order revenue in INR")
                .tag("service", "order-service")
                .register(registry);

        this.paymentsCompletedCounter = Counter.builder("payments.completed.total")
                .description("Total number of successful payment transactions")
                .tag("service", "order-service")
                .register(registry);

        this.paymentsFailedCounter = Counter.builder("payments.failed.total")
                .description("Total number of failed payment transactions")
                .tag("service", "order-service")
                .register(registry);

        this.orderProcessingTimer = Timer.builder("order.processing.duration")
                .description("Latency distribution for order creation and outbox publishing")
                .tag("service", "order-service")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(registry);
    }

    public void recordOrderCreated(BigDecimal amount) {
        ordersCreatedCounter.increment();
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            ordersAmountCounter.increment(amount.doubleValue());
        }
    }

    public void recordPaymentCompleted() {
        paymentsCompletedCounter.increment();
    }

    public void recordPaymentFailed() {
        paymentsFailedCounter.increment();
    }

    public void recordOrderDuration(long durationMillis) {
        orderProcessingTimer.record(durationMillis, TimeUnit.MILLISECONDS);
    }
}
