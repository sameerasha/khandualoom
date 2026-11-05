package com.khandualoom.microservice.user.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    private Long id;
    private Long userId;
    private String addressType;
    private String fullName;
    private String streetAddress;
    private String landmark;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String phone;
    private Boolean isPrimary;
}
