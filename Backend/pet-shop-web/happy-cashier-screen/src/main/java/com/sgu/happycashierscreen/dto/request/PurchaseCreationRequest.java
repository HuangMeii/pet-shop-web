package com.sgu.happycashierscreen.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseCreationRequest {
    UUID staffId;

    UUID supplierId;

    List<PurchaseDetailCreationRequest> purchaseDetails;
}
