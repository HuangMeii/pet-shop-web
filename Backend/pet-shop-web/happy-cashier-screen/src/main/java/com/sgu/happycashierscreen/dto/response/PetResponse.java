package com.sgu.happycashierscreen.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetResponse {

    UUID id;

    String name;

    String species;

    String breed;

    LocalDate birth;

    String gender;

    BigDecimal price;

    Boolean vaccinated;

    String imageUrl;

    Boolean available;

    Boolean sold;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}

