package com.khandualoom.microservice.user.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
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
