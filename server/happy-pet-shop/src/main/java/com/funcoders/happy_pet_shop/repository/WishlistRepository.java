package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {
    List<Wishlist> findByCustomerId(UUID customerId);
    Optional<Wishlist> findByCustomerIdAndProductId(UUID customerId, UUID productId);
    boolean existsByCustomerIdAndProductId(UUID customerId, UUID productId);
    void deleteByCustomerIdAndProductId(UUID customerId, UUID productId);
}
