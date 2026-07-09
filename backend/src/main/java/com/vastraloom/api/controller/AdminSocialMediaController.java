package com.vastraloom.api.controller;

import com.vastraloom.api.model.SocialMedia;
import com.vastraloom.api.repository.SocialMediaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/social-media")
@CrossOrigin(origins = "*", maxAge = 3600)
@SuppressWarnings("null")
public class AdminSocialMediaController {

    private final SocialMediaRepository socialMediaRepository;

    public AdminSocialMediaController(SocialMediaRepository socialMediaRepository) {
        this.socialMediaRepository = socialMediaRepository;
    }

    @PostMapping
    public ResponseEntity<?> addSocialMedia(@RequestBody SocialMedia socialMedia) {
        Optional<SocialMedia> existing = socialMediaRepository.findByPlatform(socialMedia.getPlatform());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Platform already exists.");
        }
        SocialMedia saved = socialMediaRepository.save(socialMedia);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSocialMedia(@PathVariable("id") Long id, @RequestBody SocialMedia details) {
        return socialMediaRepository.findById(id).map(social -> {
            social.setPlatform(details.getPlatform());
            social.setUrl(details.getUrl());
            social.setAnnouncement(details.getAnnouncement());
            return ResponseEntity.ok(socialMediaRepository.save(social));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSocialMedia(@PathVariable("id") Long id) {
        return socialMediaRepository.findById(id).map(social -> {
            socialMediaRepository.delete(social);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
