package com.vastraloom.api.dto;

import com.vastraloom.api.model.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private boolean emailVerified;
    private boolean phoneVerified;
    private List<Address> addresses;
}
