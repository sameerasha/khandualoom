package com.khandualoom.microservice.inventory.domain.exception;

public class SkuContentionException extends RuntimeException {
    public SkuContentionException(String message) {
        super(message);
    }
}
