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
public class InvoiceCreationRequest {

    UUID staffId;

    UUID customerId;

    String shippingAddress;

    String paymentMethod;

    List<InvoiceDetailCreationRequest> invoiceDetails;
}
