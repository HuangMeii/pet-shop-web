package com.funcoders.happy_pet_shop.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final ErrorType errorType;

    public AppException(ErrorType errorType) {
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
