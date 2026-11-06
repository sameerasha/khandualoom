package com.khandualoom.microservice.product.model;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    @Builder.Default
    private java.util.List<String> images = new java.util.ArrayList<>();

    public java.util.List<String> getImages() {
        if (images == null) {
            return new java.util.ArrayList<>();
        }
        return (images.getClass() == java.util.ArrayList.class) ? images : new java.util.ArrayList<>(images);
    }

    @Column(name = "created_date", updatable = false)
    private java.time.LocalDateTime createdDate;

    @Column(name = "modified_date")
    private java.time.LocalDateTime modifiedDate;

    @PrePersist
    protected void onCreate() {
        createdDate = java.time.LocalDateTime.now();
        modifiedDate = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedDate = java.time.LocalDateTime.now();
    }
}

