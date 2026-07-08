package com.vastraloom.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailVerified = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean phoneVerified = false;

    private String password;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuthProvider provider = AuthProvider.local;

    private String providerId;

    private String phone;

    @Column(nullable = false)
    private String role; // e.g. "ROLE_ADMIN", "ROLE_USER"

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @Builder.Default
    private List<Address> addresses = new ArrayList<>();

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
