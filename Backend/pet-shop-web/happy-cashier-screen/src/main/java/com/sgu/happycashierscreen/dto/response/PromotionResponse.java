package com.sgu.happycashierscreen.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
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

    String discountType;

    BigDecimal discountValue;

    BigDecimal maxDiscountValue;

    LocalDate startDate;

    LocalDate endDate;

    String status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Set<PromotionDetailResponse> promotionDetails;
}
