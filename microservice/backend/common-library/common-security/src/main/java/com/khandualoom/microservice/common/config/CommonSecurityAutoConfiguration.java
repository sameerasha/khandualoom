package com.khandualoom.microservice.common.config;

import com.khandualoom.microservice.common.security.JwtUtils;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@EnableConfigurationProperties(CommonProperties.class)
public class CommonSecurityAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public JwtUtils jwtUtils(CommonProperties properties) {
        return new JwtUtils(
            properties.getJwt().getSecret(),
            properties.getJwt().getExpirationMs(),
            properties.getJwt().getRefreshExpirationMs()
        );
    }
}
