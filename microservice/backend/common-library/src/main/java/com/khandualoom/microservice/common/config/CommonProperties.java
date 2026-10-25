package com.khandualoom.microservice.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "khandualoom")
@Getter
@Setter
public class CommonProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Admin superadmin = new Admin();
    private Admin admin = new Admin();

    @Getter
    @Setter
    public static class Jwt {
        private String secret = "9a4f2c8d3b7a1e6f5c8d0b2a4f6e8d1c3b5a7f9e2d4c6b8a0f1e3d5c7b9a2f4";
        private long expirationMs = 86400000L;
        private long refreshExpirationMs = 604800000L;
    }

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins = List.of("http://localhost:3000", "http://localhost:5173", "http://localhost:5174");
    }

    @Getter
    @Setter
    public static class Admin {
        private String email;
        private String password;
    }
}
