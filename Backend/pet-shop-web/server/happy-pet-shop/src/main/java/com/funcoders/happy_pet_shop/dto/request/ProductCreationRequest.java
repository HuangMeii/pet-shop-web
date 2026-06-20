package com.funcoders.happy_pet_shop.dto.request;

import com.funcoders.happy_pet_shop.constant.Unit;
import com.funcoders.happy_pet_shop.validation.CategoryConstraint;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 150, message = "Tên sản phẩm phải từ 3 đến 150 ký tự")
    String name;

    @Size(max = 500, message = "Mô tả không quá 500 ký tự")
    String description;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.01", message = "Giá phải lớn hơn 0")
    @DecimalMax(value = "999999999", message = "Giá không được vượt quá 999,999,999")
    BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    @Max(value = 99999, message = "Số lượng không vượt quá 99,999")
    Integer quantity;

    @NotNull(message = "Đơn vị tính không được để trống")
    Unit unit;

    @NotNull(message = "Danh mục không được để trống")
    UUID categoryId;

    @Size(max = 100, message = "Brand không quá 100 ký tự")
    String brand;

    @Size(max = 100, message = "Xuất xứ không quá 100 ký tự")
    String origin;

    LocalDate expiryDate;

    String imageUrl;
}

