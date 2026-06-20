package com.funcoders.happy_pet_shop.dto.request;

import com.funcoders.happy_pet_shop.constant.InventoryStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryCreationRequest {
    @NotNull(message = "ProductId không được để trống")
    UUID productId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    Integer quantity;

    @NotNull(message = "Trạng thái tồn kho không được để trống")
    InventoryStatus status;
}
