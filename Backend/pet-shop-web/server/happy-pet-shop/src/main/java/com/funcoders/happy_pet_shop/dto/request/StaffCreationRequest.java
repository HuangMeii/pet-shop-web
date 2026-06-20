package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffCreationRequest {
    @Valid
    UserCreationRequest userCreationRequest;

    @Min(value = 1, message = "INVALID_SHIFT")
    @Max(value = 3, message = "INVALID_SHIFT")
    int shift;
}
