package com.funcoders.happy_pet_shop.constant;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentStatus {
    PENDING,        // Mới tạo, chưa thanh toán
    PAID,           // Đã thanh toán
    SHIPPING,       // Đang giao hàng
    COMPLETED,      // Đã hoàn thành
    CANCELLED,      // Đã hủy (do khách hoặc hệ thống)
    FAILED,         // Thanh toán thất bại
    REFUNDED;       // Đã hoàn tiền

    @JsonCreator
    public static PaymentStatus fromString(String value) {
        if (value == null) return null;
        for (PaymentStatus status : PaymentStatus.values()) {
            if (status.name().equalsIgnoreCase(value.trim())) {
                return status;
            }
        }
        throw new IllegalArgumentException(
                "Invalid PaymentStatus value: '" + value + "'. Accepted values: " + java.util.Arrays.toString(PaymentStatus.values())
        );
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
