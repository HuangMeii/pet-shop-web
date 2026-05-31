package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.PurchaseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PurchaseDetailRepository extends JpaRepository<PurchaseDetail, UUID> {
}
