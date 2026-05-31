package com.sgu.happycashierscreen.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceDetailCreationRequest {

    UUID productId;

    UUID petId;

    Integer quantity;

    private boolean isValidDetail() {
        boolean hasProduct = productId != null;
        boolean hasPet = petId != null;
        return hasProduct != hasPet;
    }
}
