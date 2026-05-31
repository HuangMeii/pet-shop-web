package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryCreationRequest {

    @NotBlank(message = "INVALID_CATEGORY_NAME")
    @Size(max = 100, message = "INVALID_CATEGORY_NAME_LENGTH")
    String name;

    @Size(max = 1000, message = "INVALID_CATEGORY_DESCRIPTION_LENGTH")
    String description;
}
