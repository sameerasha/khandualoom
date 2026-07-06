package com.vastraloom.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private double price;

    @Column(name = "original_price")
    private double originalPrice;

    @Column(columnDefinition = "TEXT")
    private String image; // Stores Base64 string or public URL path

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String fabric;

    @Column(nullable = false)
    private String weave;

    @Column(nullable = false)
    private String color;

    private double rating;
    private int reviews;
    private String badge; // e.g. "Bestseller", "Premium", "New Arrival"
}
