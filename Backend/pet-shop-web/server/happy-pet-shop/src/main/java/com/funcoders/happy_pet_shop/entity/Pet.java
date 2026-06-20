package com.funcoders.happy_pet_shop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "pets",
        indexes = {
                @Index(name = "idx_pet_species", columnList = "species"),
                @Index(name = "idx_pet_breed", columnList = "breed"),
                @Index(name = "idx_pet_available", columnList = "available"),
                @Index(name = "idx_pet_created_at", columnList = "created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false, length = 150)
    String name;

    @Column(nullable = false, length = 100)
    String species; // Dog, Cat, Hamster...

    @Column(nullable = false, length = 100)
    String breed;

    @Column(nullable = false)
    LocalDate birth;

    @Column(nullable = false, length = 10)
    String gender;

    @Column(nullable = false, precision = 15, scale = 2)
    BigDecimal price;

    @Column(nullable = false)
    Boolean vaccinated;

    @Column(name = "image_url", length = 500)
    String imageUrl;

    @Column(nullable = false)
    Boolean available;

    @Column(nullable = false)
    Boolean sold;

    @Column(nullable = false, updatable = false)
    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (available == null) available = true;
        if (sold == null) sold = false;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsSold() {
        this.sold = true;
        this.available = false;
    }
}
