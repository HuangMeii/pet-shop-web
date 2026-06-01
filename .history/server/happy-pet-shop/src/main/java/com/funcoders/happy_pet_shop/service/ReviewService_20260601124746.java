package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.ReviewCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ProductReviewResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewStatsResponse;
import com.funcoders.happy_pet_shop.entity.Customer;
import com.funcoders.happy_pet_shop.entity.Product;
import com.funcoders.happy_pet_shop.entity.Review;
import com.funcoders.happy_pet_shop.mapper.ReviewMapper;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import com.funcoders.happy_pet_shop.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public ProductReviewResponse createReview(UUID customerId, ReviewCreationRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (reviewRepository.existsByProductIdAndCustomerId(product.getId(), customerId)) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .customer(customer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Transactional(readOnly = true)
    public List<ProductReviewResponse> getReviewsByProductId(UUID productId) {
        return reviewMapper.toResponseList(
                reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
        );
    }

    @Transactional(readOnly = true)
    public ReviewStatsResponse getReviewStats(UUID productId) {
        double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        long totalReviews = reviewRepository.countByProductId(productId);
        List<Object[]> distribution = reviewRepository.findRatingDistributionByProductId(productId);


