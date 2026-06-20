package com.funcoders.happy_pet_shop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Check;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "invoice_details")
@Check(
        constraints =
                """
                            (
                                (product_id IS NOT NULL AND pet_id IS NULL)
                                OR
                                (pet_id IS NOT NULL AND product_id IS NULL)
                            )
                        """
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false, updatable = false)
    Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", unique = true)
    Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_detail_id")
    PromotionDetail promotionDetail;

    @Column(precision = 19, scale = 2)
    BigDecimal discountAmount;

    @Column(nullable = false, precision = 19, scale = 2)
    BigDecimal unitPrice;

    @Column(nullable = false)
    int quantity;

    @Column(nullable = false, precision = 19, scale = 2)
    BigDecimal totalPrice;

    @PrePersist
    @PreUpdate
    void calculateTotalPrice() {
        this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}