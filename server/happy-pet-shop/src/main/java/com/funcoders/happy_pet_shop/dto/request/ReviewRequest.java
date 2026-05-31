package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {
    UUID customerId;

    String shippingAddress;

    @NotEmpty(message = "INVALID_REVIEW_DETAILS")
    List<@Valid ReviewDetailRequest> details;
}