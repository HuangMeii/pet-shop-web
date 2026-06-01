package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByProductIdOrderByCreatedAtDesc(UUID productId);

    List<Review> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    long countByProductId(UUID productId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.product.id = :productId")
    double findAverageRatingByProductId(@Param("productId") UUID productId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.rating ORDER BY r.rating")
    List<Object[]> findRatingDistributionByProductId(@Param("productId") UUID productId);

    boolean existsByProductIdAndCustomerId(UUID productId, UUID customerId);
}
