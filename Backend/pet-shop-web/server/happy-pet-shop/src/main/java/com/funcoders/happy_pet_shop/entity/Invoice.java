package com.funcoders.happy_pet_shop.entity;

import com.funcoders.happy_pet_shop.constant.PaymentMethod;
import com.funcoders.happy_pet_shop.constant.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(
        name = "invoices",
        indexes = {
                @Index(name = "idx_invoice_staff", columnList = "staff_id"),
                @Index(name = "idx_invoice_customer", columnList = "customer_id"),
                @Index(name = "idx_invoice_created_at", columnList = "created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    // ===== NGƯỜI XỬ LÝ (offline) =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    Staff staff;

    // ===== NGƯỜI MUA =====
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id")
    Customer customer;

    // ===== ĐỊA CHỈ GIAO HÀNG (snapshot) =====
    @Column(length = 255)
    String shippingAddress;

    // ===== GIÁ TIỀN =====
    @Column(nullable = false, precision = 15, scale = 2)
    BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    BigDecimal realAmount = BigDecimal.ZERO;

    // ===== THANH TOÁN =====
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    PaymentStatus status = PaymentStatus.PENDING;

    // ===== THỜI GIAN =====
    @Column(nullable = false, updatable = false)
    LocalDateTime createdAt;

    // ===== CHI TIẾT HÓA ĐƠN =====
    @OneToMany(
            mappedBy = "invoice",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    Set<InvoiceDetail> invoiceDetails = new HashSet<>();

    // ===== LIFECYCLE =====
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = PaymentStatus.PENDING;

        if (realAmount == null || realAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.realAmount = this.totalAmount;
        }
    }
}
