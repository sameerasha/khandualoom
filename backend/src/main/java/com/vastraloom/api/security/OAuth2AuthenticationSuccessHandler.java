package com.vastraloom.api.security;

import com.vastraloom.api.model.AuthProvider;
import com.vastraloom.api.model.User;
import com.vastraloom.api.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;


@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
        
        String email = "";
        String name = "";
        String providerId = "";
        
        if ("google".equalsIgnoreCase(registrationId)) {
            email = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name");
            providerId = oAuth2User.getAttribute("sub");
        } else if ("facebook".equalsIgnoreCase(registrationId)) {
            email = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name");
            providerId = oAuth2User.getAttribute("id");
            if (email == null || email.isEmpty()) {
                email = providerId + "@facebook.mock.local";
            }
        } else if ("instagram".equalsIgnoreCase(registrationId)) {
            // Instagram Basic Display API might not provide email easily.
            // Using username as fallback for email
            name = oAuth2User.getAttribute("username");
            email = name + "@instagram.mock.local"; 
            providerId = oAuth2User.getAttribute("id");
        }
        
        String firstName = "User";
        String lastName = "";
        if (name != null && !name.trim().isEmpty()) {
            String[] parts = name.trim().split("\\s+");
            if (parts.length == 1) {
                firstName = parts[0];
            } else {
                lastName = parts[parts.length - 1];
                firstName = String.join(" ", java.util.Arrays.copyOfRange(parts, 0, parts.length - 1));
            }
        }

        // Check if user exists
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update provider info if they previously registered locally?
            if (user.getProvider() == AuthProvider.local) {
                user.setProvider(AuthProvider.valueOf(registrationId.toLowerCase()));
                user.setProviderId(providerId);
                userRepository.save(user);
            }
        } else {
            // Create new user
            user = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .role("ROLE_USER")
                    .provider(AuthProvider.valueOf(registrationId.toLowerCase()))
                    .providerId(providerId)
                    .emailVerified(true)
                    .build();
            userRepository.save(user);
        }

        // Generate JWT Token
        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());

        // Ensure we only use the primary frontend URL if multiple are provided via CORS config
        String primaryFrontendUrl = frontendUrl.contains(",") ? frontendUrl.split(",")[0] : frontendUrl;

        // Redirect to Frontend
        String targetUrl = UriComponentsBuilder.fromUriString(primaryFrontendUrl + "/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
