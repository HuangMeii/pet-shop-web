package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.ReviewCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.ProductReviewResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewStatsResponse;
import com.funcoders.happy_pet_shop.dto.response.SentimentStatsResponse;
import com.funcoders.happy_pet_shop.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ApiResponse<ProductReviewResponse> createReview(
            Principal principal,
            @Valid @RequestBody ReviewCreationRequest request) {
        if (principal == null) {
            return ApiResponse.<ProductReviewResponse>builder()
                    .success(false)
                    .message("Authentication required")
                    .build();
        }
        // principal.getName() returns username, we need customerId
        // For now, we'll use a header or query param approach
        // This will be handled by the frontend passing customerId
        return ApiResponse.<ProductReviewResponse>builder()
                .success(false)
                .message("Use /api/reviews/customer/{customerId} endpoint")
                .build();
    }

    @PostMapping("/customer/{customerId}")
    public ApiResponse<ProductReviewResponse> createReview(
            @PathVariable UUID customerId,
            @Valid @RequestBody ReviewCreationRequest request) {
        try {
            ProductReviewResponse response = reviewService.createReview(customerId, request);
            return ApiResponse.<ProductReviewResponse>builder()
                    .success(true)
                    .data(response)
                    .message("Review created successfully")
                    .build();
        } catch (RuntimeException e) {
            return ApiResponse.<ProductReviewResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
        }
    }

    @GetMapping("/product/{productId}")
    public ApiResponse<List<ProductReviewResponse>> getReviewsByProductId(
            @PathVariable UUID productId) {
        List<ProductReviewResponse> reviews = reviewService.getReviewsByProductId(productId);
        return ApiResponse.<List<ProductReviewResponse>>builder()
                .success(true)
                .data(reviews)
                .build();
    }

    @GetMapping("/product/{productId}/stats")
    public ApiResponse<ReviewStatsResponse> getReviewStats(
            @PathVariable UUID productId) {
        ReviewStatsResponse stats = reviewService.getReviewStats(productId);
        return ApiResponse.<ReviewStatsResponse>builder()
                .success(true)
                .data(stats)
                .build();
    }

    @GetMapping("/customer/{customerId}")
    public ApiResponse<List<ProductReviewResponse>> getReviewsByCustomerId(
            @PathVariable UUID customerId) {
        List<ProductReviewResponse> reviews = reviewService.getReviewsByCustomerId(customerId);
        return ApiResponse.<List<ProductReviewResponse>>builder()
                .success(true)
                .data(reviews)
                .build();
    }

    // ========== Admin endpoints ==========

    @GetMapping("/all")
    public ApiResponse<List<ProductReviewResponse>> getAllReviews() {
        List<ProductReviewResponse> reviews = reviewService.getAllReviews();
        return ApiResponse.<List<ProductReviewResponse>>builder()
                .success(true)
                .data(reviews)
                .build();
    }

    @GetMapping("/sentiment-stats")
    public ApiResponse<SentimentStatsResponse> getSentimentStats() {
        SentimentStatsResponse stats = reviewService.getSentimentStats();
        return ApiResponse.<SentimentStatsResponse>builder()
                .success(true)
                .data(stats)
                .build();
    }
}
