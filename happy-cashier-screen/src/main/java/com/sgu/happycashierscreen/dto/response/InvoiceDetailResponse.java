package com.sgu.happycashierscreen.dto.response;

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
public class InvoiceDetailResponse {
    UUID id;

    UUID productId;
    UUID petId;

    BigDecimal unitPrice;
    Integer quantity;
    BigDecimal totalPrice;
    BigDecimal discountAmount;
}
