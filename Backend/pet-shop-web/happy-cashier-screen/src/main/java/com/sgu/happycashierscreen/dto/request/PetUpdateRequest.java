package com.sgu.happycashierscreen.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetUpdateRequest {

    String name;

    String species;

    String breed;

    LocalDate birth;

    String gender;

    BigDecimal price;

    Boolean vaccinated;

    String imageUrl;

    Boolean available;
}