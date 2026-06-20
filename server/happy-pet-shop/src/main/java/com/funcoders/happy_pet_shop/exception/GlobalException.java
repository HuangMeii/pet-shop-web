package com.funcoders.happy_pet_shop.exception;

import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalException {
    @ExceptionHandler(AppException.class)
    ResponseEntity<ApiResponse> appExceptionHandler(AppException appException) {
        ErrorType errorType = appException.getErrorType();

        ApiResponse apiResponse = new ApiResponse(errorType);

        return ResponseEntity.status(errorType.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiResponse> dataIntegrityViolationHandler(
            DataIntegrityViolationException exception
    ) {
        log.error("Data integrity violation", exception);

        String message = exception.getMostSpecificCause().getMessage();
        ErrorType errorType = ErrorType.UNCATEGORIZED;

        if (message != null) {
            if (message.contains("username") || message.contains("email")) {
                errorType = ErrorType.USERNAME_ALREADY_EXISTS;
            } else if (message.contains("foreign key") || message.contains("violates foreign key")) {
                errorType = ErrorType.INVALID_CATEGORY;
            }
        }

        ApiResponse apiResponse = new ApiResponse(errorType);

        return ResponseEntity
                .status(errorType.getHttpStatus())
                .body(apiResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception
    ) {
        String message = exception
                .getBindingResult()
                .getFieldError()
                .getDefaultMessage();

        ErrorType errorType;
        try {
            errorType = ErrorType.valueOf(message);
        } catch (Exception e) {
            errorType = ErrorType.UNCATEGORIZED;
        }

        ApiResponse apiResponse = new ApiResponse(errorType);

        return ResponseEntity
                .status(errorType.getHttpStatus())
                .body(apiResponse);
    }
}
