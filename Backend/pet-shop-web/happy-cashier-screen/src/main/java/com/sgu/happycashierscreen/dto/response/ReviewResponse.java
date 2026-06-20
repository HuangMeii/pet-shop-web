package com.sgu.happycashierscreen.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Set;

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