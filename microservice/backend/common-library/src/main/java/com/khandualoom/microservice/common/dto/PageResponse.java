package com.khandualoom.microservice.common.dto;

import java.io.Serializable;
import java.util.List;

public record PageResponse<T>(
    List<T> content,
    int pageNumber,
    int pageSize,
    long totalElements,
    int totalPages,
    boolean isLast
) implements Serializable {

    public static <T> PageResponse<T> of(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean isLast
    ) {
        return new PageResponse<>(content, pageNumber, pageSize, totalElements, totalPages, isLast);
    }
}
