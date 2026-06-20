package com.funcoders.happy_pet_shop.exception;

import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
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

        ApiResponse apiResponse = ApiResponse.builder()
                .success(false)
                .message(message)
                .errorCode(4000)
                .status(400)
                .build();

        return ResponseEntity
                .badRequest()
                .body(apiResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiResponse> handleHttpMessageNotReadable(
            HttpMessageNotReadableException exception
    ) {
        log.error("JSON parse error: ", exception);

        String message = exception.getMessage();
        // Extract the most meaningful part of the error for the user
        if (message != null && message.contains("Cannot deserialize value")) {
            // Extract enum type and value from error message
            message = "Invalid value for payment status. Please check and try again.";
        }

        ApiResponse apiResponse = ApiResponse.builder()
                .success(false)
                .message(message)
                .errorCode(4001)
                .status(400)
                .build();

        return ResponseEntity
                .badRequest()
                .body(apiResponse);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse> handleAllUncaughtException(Exception exception) {
        log.error("Unhandled exception: ", exception);

        ApiResponse apiResponse = ApiResponse.builder()
                .success(false)
                .message("Internal server error: " + exception.getMessage())
                .status(500)
                .build();

        return ResponseEntity
                .status(500)
                .body(apiResponse);
    }
}
