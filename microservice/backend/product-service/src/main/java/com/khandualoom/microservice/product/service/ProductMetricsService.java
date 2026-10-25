package com.khandualoom.microservice.product.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Micrometer Observability Metrics Service for Product Catalog & AI Search Operations.
 * Emits custom counters and timers scraped by Prometheus and displayed on Grafana.
 */
@Service
public class ProductMetricsService {

    private final MeterRegistry registry;
    private final Counter productsViewedCounter;
    private final Counter aiQueriesCounter;
    private final Timer catalogQueryTimer;
    private final Timer aiQueryTimer;

    public ProductMetricsService(MeterRegistry registry) {
        this.registry = registry;

        this.productsViewedCounter = Counter.builder("products.viewed.total")
                .description("Total product detail page views")
                .tag("service", "product-service")
                .register(registry);

        this.aiQueriesCounter = Counter.builder("ai.rag.queries.total")
                .description("Total AI assistant semantic searches and recommendations")
                .tag("service", "product-service")
                .register(registry);

        this.catalogQueryTimer = Timer.builder("product.catalog.query.duration")
                .description("Latency distribution for product filtering and search queries")
                .tag("service", "product-service")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(registry);

        this.aiQueryTimer = Timer.builder("ai.rag.query.duration")
                .description("Latency distribution for AI semantic embeddings and generation")
                .tag("service", "product-service")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(registry);
    }

    public void recordProductSearch(String category) {
        Counter.builder("products.searched.total")
                .description("Total product search queries by category")
                .tag("service", "product-service")
                .tag("category", category != null && !category.isBlank() ? category : "all")
                .register(registry)
                .increment();
    }

    public void recordProductView() {
        productsViewedCounter.increment();
    }

    public void recordAiQuery() {
        aiQueriesCounter.increment();
    }

    public void recordCatalogQueryDuration(long millis) {
        catalogQueryTimer.record(millis, TimeUnit.MILLISECONDS);
    }

    public void recordAiQueryDuration(long millis) {
        aiQueryTimer.record(millis, TimeUnit.MILLISECONDS);
    }
}
