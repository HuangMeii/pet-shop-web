package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    long countByCustomerIdAndIsReadFalse(UUID customerId);
}
