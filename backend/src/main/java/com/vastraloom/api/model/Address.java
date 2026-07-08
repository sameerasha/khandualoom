package com.vastraloom.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "address_type", nullable = false)
    private String addressType; // e.g., "HOME", "OFFICE", "OTHER"

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "street_address", nullable = false)
    private String streetAddress;

    private String landmark;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = false)
    private String country;

    private String phone; // shipping contact phone

    @Column(name = "is_primary", nullable = false)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonProperty("isPrimary")
    private boolean isPrimary = false;
}
