package com.vastraloom.microservice.notification.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contact_messages")
public class ContactMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String phone;
    private String subject;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Builder.Default
    private LocalDateTime createdDate = LocalDateTime.now();
}

