package com.vastraloom.microservice.notification.controller;

import com.vastraloom.microservice.notification.model.SocialMedia;
import com.vastraloom.microservice.notification.repository.SocialMediaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/social-media")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class SocialMediaController {

    private final SocialMediaRepository socialMediaRepository;


    // Public endpoint for the storefront
    @GetMapping
    public List<SocialMedia> getAllSocialMedia() {
        return socialMediaRepository.findAll();
    }
}

