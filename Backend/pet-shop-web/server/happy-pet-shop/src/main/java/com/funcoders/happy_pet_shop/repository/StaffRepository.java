package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StaffRepository extends JpaRepository<Staff, UUID> {
    Optional<Staff> findByUser_Username(String username);
}
