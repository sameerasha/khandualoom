package com.khandualoom.microservice.common.config;

import com.khandualoom.microservice.common.security.InternalAssertionTokenService;
import com.khandualoom.microservice.common.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
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

    @Bean
    @ConditionalOnMissingBean
    public InternalAssertionTokenService internalAssertionTokenService(
            @Value("${khandualoom.security.internal-secret:khandualoom-internal-zero-trust-cluster-secret-key-32b-min!}") String clusterSecret,
            @Value("${khandualoom.security.internal-max-skew-ms:60000}") long maxSkewMs) {
        return new InternalAssertionTokenService(clusterSecret, maxSkewMs);
    }
}
