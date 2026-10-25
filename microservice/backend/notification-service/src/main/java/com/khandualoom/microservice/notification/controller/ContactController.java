package com.khandualoom.microservice.notification.controller;

import com.khandualoom.microservice.notification.model.ContactMessage;
import com.khandualoom.microservice.notification.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> submitContactMessage(@RequestBody ContactMessage contactMessage) {
        // createdDate is set in the entity's constructor automatically
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);
        return ResponseEntity.ok(savedMessage);
    }
}

