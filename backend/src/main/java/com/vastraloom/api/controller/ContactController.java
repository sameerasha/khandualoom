package com.vastraloom.api.controller;

import com.vastraloom.api.model.ContactMessage;
import com.vastraloom.api.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> submitContactMessage(@RequestBody ContactMessage contactMessage) {
        // createdDate is set in the entity's constructor automatically
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);
        return ResponseEntity.ok(savedMessage);
    }
}
