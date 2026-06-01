package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.funcoders.happy_pet_shop.constant.PaymentMethod;
import com.funcoders.happy_pet_shop.constant.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponse {

    // Customer (hiển thị)
    String customerName;

    String shippingAddress;

    // Tiền
    BigDecimal totalAmount;
    BigDecimal realAmount;

    // Danh sách sản phẩm
    Set<ReviewDetailResponse> reviewDetails;
}