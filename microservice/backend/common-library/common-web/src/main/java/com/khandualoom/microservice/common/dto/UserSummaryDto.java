package com.khandualoom.microservice.common.dto;

import java.io.Serializable;

public record UserSummaryDto(
    Long id,
    String email,
    String role,
    String firstName,
    String lastName
) implements Serializable {}
