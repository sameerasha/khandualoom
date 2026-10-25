package com.khandualoom.microservice.common.config;

import com.khandualoom.microservice.common.exception.GlobalExceptionHandler;
import com.khandualoom.microservice.common.security.JwtUtils;
import com.khandualoom.microservice.common.web.CorrelationIdFilter;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@AutoConfiguration
@EnableConfigurationProperties(CommonProperties.class)
public class CommonAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public JwtUtils jwtUtils(CommonProperties properties) {
        return new JwtUtils(
            properties.getJwt().getSecret(),
            properties.getJwt().getExpirationMs(),
            properties.getJwt().getRefreshExpirationMs()
        );
    }

    @Configuration(proxyBeanMethods = false)
    @ConditionalOnClass(name = "jakarta.servlet.Filter")
    @ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
    static class ServletWebConfiguration {

        @Bean
        @ConditionalOnMissingBean
        public CorrelationIdFilter correlationIdFilter() {
            return new CorrelationIdFilter();
        }

        @Bean
        @ConditionalOnMissingBean
        public GlobalExceptionHandler globalExceptionHandler() {
            return new GlobalExceptionHandler();
        }
    }
}
