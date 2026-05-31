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
public class InvoiceResponse {

    UUID id;

    // Staff (có thể null)
    UUID staffId;
    String staffName;

    // Customer
    UUID customerId;
    String customerName;

    BigDecimal totalAmount;
    BigDecimal realAmount;

    PaymentMethod paymentMethod;

    String shippingAddress;

    PaymentStatus status;

    LocalDateTime createdAt;

    Set<InvoiceDetailResponse> invoiceDetails;
}
