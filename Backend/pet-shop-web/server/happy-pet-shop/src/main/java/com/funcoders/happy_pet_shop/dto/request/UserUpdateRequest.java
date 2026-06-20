package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    @Size(max = 50, message = "INVALID_FIRST_NAME_LENGTH")
    private String firstName;

    @Size(max = 50, message = "INVALID_LAST_NAME_LENGTH")
    private String lastName;

    @Email(message = "INVALID_EMAIL_FORMAT")
    @Size(max = 100, message = "INVALID_EMAIL_LENGTH")
    private String email;

    @Pattern(
            regexp = "^(0|\\+84)[0-9]{9}$",
            message = "INVALID_PHONE_FORMAT"
    )
    private String phone;

    @Size(max = 255, message = "INVALID_ADDRESS_LENGTH")
    private String address;
}
