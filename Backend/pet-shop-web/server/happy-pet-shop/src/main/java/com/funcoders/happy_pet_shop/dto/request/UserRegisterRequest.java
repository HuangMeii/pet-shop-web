package com.funcoders.happy_pet_shop.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterRequest {

    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(min = 3, max = 50, message = "USERNAME_LENGTH_INVALID")
    private String username;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 6, max = 100, message = "PASSWORD_LENGTH_INVALID")
    private String password;

    @NotBlank(message = "PHONE_REQUIRED")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "PHONE_FORMAT_INVALID")
    private String phone;

    @Size(max = 255, message = "ADDRESS_TOO_LONG")
    private String address;

    @NotBlank(message = "ROLE_REQUIRED")
    private String role;
}