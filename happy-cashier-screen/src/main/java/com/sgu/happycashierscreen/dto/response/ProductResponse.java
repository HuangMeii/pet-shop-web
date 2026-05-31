package com.sgu.happycashierscreen.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {
    UUID id;

    String name;

    String description;

    BigDecimal price;

    String categoryId;
    String categoryName;

    String brand;

    String origin;

    String unit;

    int quantity;

    LocalDate expiryDate;

    String imageUrl;

    boolean available;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
