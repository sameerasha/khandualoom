package com.vastraloom.api.security;

import com.vastraloom.api.model.User;
import com.vastraloom.api.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        log.debug("Attempting to load user by identifier: {}", identifier);
        
        String query = identifier;
        if ("admin".equalsIgnoreCase(identifier)) {
            query = "admin@vastraloom.com";
        }
        
        String finalQuery = query;
        User user = userRepository.findByEmail(finalQuery)
                .or(() -> userRepository.findByPhone(finalQuery))
                .orElseThrow(() -> {
                    log.error("User not found with identifier: {}", identifier);
                    return new UsernameNotFoundException("User not found with identifier: " + identifier);
                });
        
        log.debug("User {} loaded successfully with role {}", user.getEmail(), user.getRole());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword() != null ? user.getPassword() : "",
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
