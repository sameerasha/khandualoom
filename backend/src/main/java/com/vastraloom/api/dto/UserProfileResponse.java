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
    private String username;
    private String email;
    private String phone;
    private List<Address> addresses;
}
