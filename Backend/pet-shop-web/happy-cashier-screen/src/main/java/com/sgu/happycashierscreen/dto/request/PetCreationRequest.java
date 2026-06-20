package com.sgu.happycashierscreen.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetCreationRequest {

    String name;

    String species;

    String breed;

    LocalDate birth;

    String gender;

    BigDecimal price;

    Boolean vaccinated;

    String imageUrl;
}
