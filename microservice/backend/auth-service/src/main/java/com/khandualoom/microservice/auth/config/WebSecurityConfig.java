package com.khandualoom.microservice.auth.config;
import com.khandualoom.microservice.auth.security.JwtAuthenticationFilter;
import com.khandualoom.microservice.auth.security.OAuth2AuthenticationSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private org.springframework.security.oauth2.client.registration.ClientRegistrationRepository clientRegistrationRepository;

    @Value("${khandualoom.cors.allowed-origins:${khandualoom.cors.allowed-origins:${khandualoom.cors.allowed-origins:http://localhost:3000,http://localhost:5173,http://localhost:5174}}}")
    private String corsAllowedOrigins;

    public WebSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                             OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Health & Actuator & H2
                        .requestMatchers("/api/health", "/api/v1/health").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()

                        // Auth APIs (Public)
                        .requestMatchers("/api/auth/**", "/api/v1/auth/**").permitAll()

                        // Public Products APIs
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/v1/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products", "/api/v1/products").permitAll()

                        // Public Social Media
                        .requestMatchers(HttpMethod.GET, "/api/social-media/**", "/api/v1/social/**", "/api/v1/social-media/**").permitAll()

                        // Public Contact Form
                        .requestMatchers(HttpMethod.POST, "/api/contact/**", "/api/v1/contact/**").permitAll()

                        // Super Admin Restricted APIs (SUPER_ADMIN role only)
                        .requestMatchers("/api/super-admin/**", "/api/v1/super-admin/**").hasRole("SUPER_ADMIN")

                        // Admin Restricted APIs (ADMIN and SUPER_ADMIN roles only)
                        .requestMatchers("/api/admin/**", "/api/v1/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        // User Profile & User APIs (USER, ADMIN, SUPER_ADMIN all have access)
                        .requestMatchers("/api/users/**", "/api/v1/users/**").hasAnyRole("USER", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/orders/**", "/api/v1/orders/**").hasAnyRole("USER", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/checkout/**", "/api/v1/checkout/**").hasAnyRole("USER", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/payment/**", "/api/v1/payments/**").hasAnyRole("USER", "ADMIN", "SUPER_ADMIN")

                        // Any other requests require authentication
                        .anyRequest().authenticated());

        if (clientRegistrationRepository != null) {
            http.oauth2Login(oauth2 -> oauth2
                    .clientRegistrationRepository(clientRegistrationRepository)
                    .successHandler(oAuth2AuthenticationSuccessHandler)
            );
        }

        // Add our custom JWT security filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(corsAllowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

