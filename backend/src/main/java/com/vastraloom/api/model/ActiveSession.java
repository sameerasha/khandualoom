package com.vastraloom.api.model;

import jakarta.persistence.*;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "active_sessions", indexes = {
    @Index(name = "idx_active_token", columnList = "token")
})
public class ActiveSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1024, unique = true)
    private String token;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryDate;

    @Column(name = "refresh_token", length = 1024)
    private String refreshToken;

    @Column(name = "refresh_expiry_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date refreshExpiryDate;
}
