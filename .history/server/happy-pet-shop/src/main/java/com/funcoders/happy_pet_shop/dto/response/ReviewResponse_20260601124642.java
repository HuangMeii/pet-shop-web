package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponse {
    UUID id;
    UUID productId;
    String productName;
    UUID customerId;
    String customerName;
    int rating;
    String comment;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
