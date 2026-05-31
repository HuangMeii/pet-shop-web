package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseDetailCreationRequest {
    @NotNull(message = "INVALID_PRODUCT_ID")
    UUID productId;

    @NotNull(message = "INVALID_QUANTITY")
    @Min(value = 1, message = "INVALID_QUANTITY")
    Integer quantity;

    @NotNull(message = "INVALID_UNIT_PRICE")
    @DecimalMin(value = "0.0", inclusive = false, message = "INVALID_UNIT_PRICE")
    BigDecimal unitPrice;
}
