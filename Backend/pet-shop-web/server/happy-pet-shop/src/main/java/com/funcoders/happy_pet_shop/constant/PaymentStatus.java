package com.funcoders.happy_pet_shop.constant;

public enum PaymentStatus {
    PENDING,        // Mới tạo, chưa thanh toán
    PAID,           // Đã thanh toán
    CANCELLED,      // Đã hủy (do khách hoặc hệ thống)
    FAILED,         // Thanh toán thất bại
    REFUNDED        // Đã hoàn tiền
}
