package com.sgu.happycashierscreen.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {

    String name;

    String description;

    BigDecimal price;

    Integer quantity;

    String unit;

    UUID categoryId;

    String brand;

    String origin;

    LocalDate expiryDate;

    String imageUrl;
}

