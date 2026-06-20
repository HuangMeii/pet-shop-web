 package com.funcoders.happy_pet_shop.entity;

import com.funcoders.happy_pet_shop.constant.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

 @Entity
 @Table(
         name = "suppliers",
         indexes = {
                 @Index(name = "idx_supplier_name", columnList = "name"),
                 @Index(name = "idx_supplier_email", columnList = "email"),
                 @Index(name = "idx_supplier_phone", columnList = "phone")
         }
 )
 @Getter
 @Setter
 @NoArgsConstructor
 @AllArgsConstructor
 @Builder
 @FieldDefaults(level = AccessLevel.PRIVATE)
 public class Supplier {

     @Id
     @GeneratedValue(strategy = GenerationType.UUID)
     UUID id;

     @Column(nullable = false, length = 100)
     String name;

     @Column(length = 100, unique = true)
     String email;

     @Column(nullable = false, length = 10, unique = true)
     String phone;

     @Column(length = 255)
     String address;

     @Enumerated(EnumType.STRING)
     @Column(nullable = false, length = 20)
     UserStatus status;

     @Column(nullable = false, updatable = false)
     LocalDateTime createdAt;

     @Column(nullable = false)
     LocalDateTime updatedAt;

     @PrePersist
     protected void onCreate() {
         LocalDateTime now = LocalDateTime.now();
         this.createdAt = now;
         this.updatedAt = now;

         if (this.status == null) {
             this.status = UserStatus.ACTIVATED;
         }
     }

     @PreUpdate
     protected void onUpdate() {
         this.updatedAt = LocalDateTime.now();
     }
 }


