package com.vastraloom.microservice.auth.dto;

import com.vastraloom.microservice.auth.model.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String previousPassword; // Optional, required if newPassword is provided
    private String newPassword; // Optional
    private String phone;
    private List<Address> addresses;
}

