package com.funcoders.happy_pet_shop.dto.request;

import com.funcoders.happy_pet_shop.constant.PaymentMethod;
import com.funcoders.happy_pet_shop.constant.PaymentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceStatusUpdateRequest {
    @NotNull(message = "INVALID_PAYMENT_STATUS")
    PaymentStatus paymentStatus;
}
