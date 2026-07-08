package com.vastraloom.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "social_media_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String platform; // e.g., facebook, instagram, whatsapp, telegram, twitter

    @Column(nullable = false)
    private String url; // url, group link, or phone number

    @Column(columnDefinition = "TEXT")
    private String announcement; // extra text to show in the modal
}
