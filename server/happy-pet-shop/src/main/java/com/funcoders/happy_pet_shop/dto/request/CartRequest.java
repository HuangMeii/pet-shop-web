package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {

    @NotNull(message = "INVALID_PRODUCT_ID")
    UUID productId;
    
    @Min(value = 0, message = "INVALID_QUANTITY")
    int quantity;
}
