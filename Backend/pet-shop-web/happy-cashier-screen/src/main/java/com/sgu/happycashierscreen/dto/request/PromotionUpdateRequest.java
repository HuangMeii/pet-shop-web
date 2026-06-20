package com.sgu.happycashierscreen.dto.request;

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

    String code;

    String description;

    String discountType;

    BigDecimal discountValue;

    BigDecimal maxDiscountValue;

    LocalDate startDate;

    LocalDate endDate;

    String status;
}