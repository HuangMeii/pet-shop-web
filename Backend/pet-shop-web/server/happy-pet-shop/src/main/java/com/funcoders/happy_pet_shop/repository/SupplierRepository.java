package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
