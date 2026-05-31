package com.sgu.happycashierscreen.dto.request;

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

    String code;

    String description;

    String discountType;

    BigDecimal discountValue;

    BigDecimal maxDiscountValue;

    LocalDate startDate;

    LocalDate endDate;

    List<PromotionDetailCreationRequest> promotionDetails;
}