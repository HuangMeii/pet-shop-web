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

    @Query("SELECT r FROM Review r WHERE r.product.id = :productId ORDER BY r.createdAt DESC")
    List<Review> findByProductIdOrderByCreatedAtDesc(@Param("productId") UUID productId);

    @Query("SELECT r FROM Review r WHERE r.customer.id = :customerId ORDER BY r.createdAt DESC")
    List<Review> findByCustomerIdOrderByCreatedAtDesc(@Param("customerId") UUID customerId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    long countByProductId(@Param("productId") UUID productId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.product.id = :productId")
    double findAverageRatingByProductId(@Param("productId") UUID productId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.rating ORDER BY r.rating")
    List<Object[]> findRatingDistributionByProductId(@Param("productId") UUID productId);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Review r WHERE r.product.id = :productId AND r.customer.id = :customerId")
    boolean existsByProductIdAndCustomerId(@Param("productId") UUID productId, @Param("customerId") UUID customerId);

    @Query("SELECT r FROM Review r ORDER BY r.createdAt DESC")
    List<Review> findAllOrderByCreatedAtDesc();

    @Query("SELECT r.sentimentLabel, COUNT(r) FROM Review r GROUP BY r.sentimentLabel")
    List<Object[]> countBySentimentLabel();

    @Query("SELECT r.sentimentLabel, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.sentimentLabel")
    List<Object[]> countBySentimentLabelAndProductId(@Param("productId") UUID productId);
}
