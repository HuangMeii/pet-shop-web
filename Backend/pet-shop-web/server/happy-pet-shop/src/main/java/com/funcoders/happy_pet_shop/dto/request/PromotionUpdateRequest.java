package com.funcoders.happy_pet_shop.dto.request;

import com.funcoders.happy_pet_shop.constant.DiscountType;
import com.funcoders.happy_pet_shop.constant.PromotionStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionUpdateRequest {

    @Size(max = 50)
    String code;

    @Size(max = 255)
    String description;

    DiscountType discountType;

    @DecimalMin(value = "0.0", inclusive = false)
    BigDecimal discountValue;

    @DecimalMin(value = "0.0", inclusive = false)
    BigDecimal maxDiscountValue;

    LocalDate startDate;

    LocalDate endDate;

    PromotionStatus status;
}