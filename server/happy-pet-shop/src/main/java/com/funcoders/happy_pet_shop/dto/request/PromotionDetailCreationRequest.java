package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionDetailCreationRequest {

    @NotNull(message = "Product ID must not be null")
    UUID productId;
}
