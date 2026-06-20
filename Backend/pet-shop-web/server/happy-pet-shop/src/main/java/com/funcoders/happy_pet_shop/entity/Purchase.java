package com.funcoders.happy_pet_shop.entity;

import com.funcoders.happy_pet_shop.constant.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(
        name = "purchases",
        indexes = {
                @Index(name = "idx_purchase_staff", columnList = "staff_id"),
                @Index(name = "idx_purchase_supplier", columnList = "supplier_id"),
                @Index(name = "idx_purchase_created_at", columnList = "created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    Staff staff;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    Supplier supplier;

    @Column(nullable = false, precision = 15, scale = 2)
    BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    PaymentStatus status;

    @OneToMany(
            mappedBy = "purchase",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    Set<PurchaseDetail> purchaseDetails;

    @Column(nullable = false, updatable = false)
    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        recalculateTotalAmount();

        if (status == null) {
            status = PaymentStatus.PENDING;
        }

        if (this.totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
        }
    }

    public void recalculateTotalAmount() {
        if (purchaseDetails == null) {
            this.totalAmount = BigDecimal.ZERO;
            return;
        }

        this.totalAmount = purchaseDetails.stream()
                .map(PurchaseDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
