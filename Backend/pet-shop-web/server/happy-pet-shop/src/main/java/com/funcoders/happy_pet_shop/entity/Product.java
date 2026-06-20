package com.funcoders.happy_pet_shop.entity;

import com.funcoders.happy_pet_shop.constant.Unit;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;


@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false, length = 150)
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false, precision = 15, scale = 2)
    BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    Category category;

    @Column(length = 100)
    String brand;

    @Column(length = 100)
    String origin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    Unit unit;

    @Column(nullable = false)
    int quantity;

    @Column(name = "image_url")
    String imageUrl;

    @Column(name = "expiry_date")
    LocalDate expiryDate;

    @Column(name = "available", nullable = false)
    boolean available;

    @Column(nullable = false, updatable = false)
    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        available = true;
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
