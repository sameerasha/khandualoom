package com.vastraloom.api.controller;

import com.vastraloom.api.model.SocialMedia;
import com.vastraloom.api.repository.SocialMediaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/social-media")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SocialMediaController {

    private final SocialMediaRepository socialMediaRepository;

    public SocialMediaController(SocialMediaRepository socialMediaRepository) {
        this.socialMediaRepository = socialMediaRepository;
    }

    // Public endpoint for the storefront
    @GetMapping
    public List<SocialMedia> getAllSocialMedia() {
        return socialMediaRepository.findAll();
    }
}
