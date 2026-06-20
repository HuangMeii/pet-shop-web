package com.funcoders.happy_pet_shop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Entity
@Table(
        name = "promotion_details",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_promotion_product",
                        columnNames = {"promotion_id", "product_id"}
                )
        },
        indexes = {
                @Index(name = "idx_pd_promotion", columnList = "promotion_id"),
                @Index(name = "idx_pd_product", columnList = "product_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne()
    @JoinColumn(name = "promotion_id", nullable = false, updatable = false)
    Promotion promotion;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, updatable = false)
    Product product;

    @PrePersist
    private void validate() {
        if (promotion == null || product == null) {
            throw new IllegalStateException("Promotion and Product must not be null");
        }
    }
}
