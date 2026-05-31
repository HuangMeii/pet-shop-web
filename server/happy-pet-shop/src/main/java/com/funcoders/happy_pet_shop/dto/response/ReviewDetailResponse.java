package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewDetailResponse {

    UUID productId;
    String productName;
    String imageUrl;

    BigDecimal unitPrice;
    Integer quantity;

    BigDecimal totalPrice;
    BigDecimal discountAmount;
}