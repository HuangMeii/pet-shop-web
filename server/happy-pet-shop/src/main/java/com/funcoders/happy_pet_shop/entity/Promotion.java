package com.funcoders.happy_pet_shop.entity;

import com.funcoders.happy_pet_shop.constant.DiscountType;
import com.funcoders.happy_pet_shop.constant.PromotionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(
        name = "promotions",
        indexes = {
                @Index(name = "idx_promotion_code", columnList = "code"),
                @Index(name = "idx_promotion_status", columnList = "status"),
                @Index(name = "idx_promotion_date", columnList = "start_date, end_date")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false, unique = true, length = 50)
    String code;

    @Column(length = 255)
    String description;

    @OneToMany(mappedBy = "promotion",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    Set<PromotionDetail> promotionDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    DiscountType discountType;

    @Column(nullable = false, precision = 15, scale = 2)
    BigDecimal discountValue;

    @Column(precision = 15, scale = 2)
    BigDecimal maxDiscountValue;

    @Column(nullable = false)
    LocalDate startDate;

    @Column(nullable = false)
    LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    PromotionStatus status;

    @Column(nullable = false, updatable = false)
    LocalDateTime createdAt;

    LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (status == null) {
            status = PromotionStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isValidNow() {
        LocalDate today = LocalDate.now();
        return status == PromotionStatus.ACTIVE
                && !today.isBefore(startDate)
                && !today.isAfter(endDate);
    }
}
