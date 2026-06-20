package com.funcoders.happy_pet_shop.dto.request;

import com.funcoders.happy_pet_shop.constant.DiscountType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionCreationRequest {

    @NotBlank
    @Size(max = 50)
    String code;

    @Size(max = 255)
    String description;

    @NotNull
    DiscountType discountType;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    BigDecimal discountValue;

    @DecimalMin(value = "0.0", inclusive = false)
    BigDecimal maxDiscountValue;

    @NotNull
    LocalDate startDate;

    @NotNull
    LocalDate endDate;

    @Valid
    List<PromotionDetailCreationRequest> promotionDetails;
}