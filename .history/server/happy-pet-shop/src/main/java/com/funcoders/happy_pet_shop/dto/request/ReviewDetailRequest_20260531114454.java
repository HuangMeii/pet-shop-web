package com.funcoders.happy_pet_shop.dto.request;

import com.funcoders.happy_pet_shop.constant.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewDetailRequest {

    UUID productId;

    @NotNull(message = "INVALID_QUANTITY")
    @Min(value = 1, message = "INVALID_QUANTITY")
    Integer quantity;
}