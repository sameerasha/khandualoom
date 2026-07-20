package com.vastraloom.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserBasicInfo {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
}
