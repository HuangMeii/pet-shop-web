package com.funcoders.happy_pet_shop.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {
    UUID customerId;
    String shippingAddress;
    List<ReviewDetailRequest> details;
}
