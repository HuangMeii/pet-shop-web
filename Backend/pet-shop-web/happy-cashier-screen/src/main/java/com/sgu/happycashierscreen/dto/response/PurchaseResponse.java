package com.sgu.happycashierscreen.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseResponse {
    UUID id;

    StaffResponse staff;

    SupplierResponse supplier;

    BigDecimal totalAmount;

    String status;

    Set<PurchaseDetailResponse> purchaseDetails;

    LocalDateTime createdAt;
}
