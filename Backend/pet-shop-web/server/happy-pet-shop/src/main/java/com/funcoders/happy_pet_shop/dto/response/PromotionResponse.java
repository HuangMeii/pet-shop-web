package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.funcoders.happy_pet_shop.constant.DiscountType;
import com.funcoders.happy_pet_shop.constant.PromotionStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PromotionResponse {
    UUID id;

    String code;

    String description;

    DiscountType discountType;

    BigDecimal discountValue;

    BigDecimal maxDiscountValue;

    LocalDate startDate;

    LocalDate endDate;

    PromotionStatus status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Set<PromotionDetailResponse> promotionDetails;
}
