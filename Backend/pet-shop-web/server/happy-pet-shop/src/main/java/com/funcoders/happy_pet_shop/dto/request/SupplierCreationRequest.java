package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierCreationRequest {
    @NotBlank(message = "INVALID_SUPPLIER_NAME")
    @Size(min = 2, max = 100, message = "INVALID_SUPPLIER_NAME_LENGTH")
    String name;

    @Email(message = "INVALID_EMAIL_FORMAT")
    @Size(max = 100, message = "INVALID_EMAIL_LENGTH")
    String email;

    @NotBlank(message = "INVALID_PHONE")
    @Pattern(
            regexp = "^(0|\\+84)[0-9]{9}$",
            message = "INVALID_PHONE_FORMAT"
    )
    String phone;

    @Size(max = 255, message = "INVALID_ADDRESS_LENGTH")
    String address;
}
