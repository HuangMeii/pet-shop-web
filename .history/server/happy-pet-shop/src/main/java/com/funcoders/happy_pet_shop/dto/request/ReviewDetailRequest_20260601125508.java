package com.funcoders.happy_pet_shop.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewDetailRequest {
    UUID productId;
    int quantity;
}

    UUID productId;

    @NotNull(message = "INVALID_QUANTITY")
    @Min(value = 1, message = "INVALID_QUANTITY")
    Integer quantity;
}