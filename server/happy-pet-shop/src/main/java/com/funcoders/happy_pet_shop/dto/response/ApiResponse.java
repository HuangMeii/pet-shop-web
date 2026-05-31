package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<DataType> {

    boolean success;
    String message;
    DataType data;
    int errorCode;
    int status;
    Instant timestamp;

//    SUCCESS
    public ApiResponse(DataType data, String message) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.status = 1000;
        timestamp = Instant.now();
    }

//    ERROR
    public ApiResponse(ErrorType errorType) {
        this.success = false;
        this.message = errorType.getMessage();
        this.data = null;
        this.errorCode = errorType.getErrorCode();
        timestamp = Instant.now();
        this.data = null;
    }
}
