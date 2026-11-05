package com.khandualoom.microservice.common.test;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Base integration test fixture providing reusable Testcontainers for
 * isolated integration testing across microservices.
 */
public abstract class BaseIntegrationTest {

    protected static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
        DockerImageName.parse("postgres:16-alpine")
    )
    .withDatabaseName("test_db")
    .withUsername("test")
    .withPassword("test");

    protected static final KafkaContainer kafka = new KafkaContainer(
        DockerImageName.parse("confluentinc/cp-kafka:7.6.1")
    );

    protected static final GenericContainer<?> redis = new GenericContainer<>(
        DockerImageName.parse("redis:7-alpine")
    )
    .withExposedPorts(6379);

    static {
        // Start containers statically to share across test execution context when activated
        if (Boolean.getBoolean("testcontainers.enabled")) {
            postgres.start();
            kafka.start();
            redis.start();
        }
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        if (postgres.isRunning()) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl);
            registry.add("spring.datasource.username", postgres::getUsername);
            registry.add("spring.datasource.password", postgres::getPassword);
        }
        if (kafka.isRunning()) {
            registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        }
        if (redis.isRunning()) {
            registry.add("spring.data.redis.host", redis::getHost);
            registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
        }
    }
}
