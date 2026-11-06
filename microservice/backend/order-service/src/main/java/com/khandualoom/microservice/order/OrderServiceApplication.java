package com.khandualoom.microservice.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.khandualoom.microservice.order", "com.khandualoom.microservice.common"})
@EntityScan(basePackages = {"com.khandualoom.microservice.order", "com.khandualoom.microservice.common"})
@EnableJpaRepositories(basePackages = {"com.khandualoom.microservice.order", "com.khandualoom.microservice.common"})
@EnableScheduling
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
