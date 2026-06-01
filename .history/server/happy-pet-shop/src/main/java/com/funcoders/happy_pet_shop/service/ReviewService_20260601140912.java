package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.ReviewCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ProductReviewResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewStatsResponse;
import com.funcoders.happy_pet_shop.dto.response.SentimentStatsResponse;
import com.funcoders.happy_pet_shop.entity.Customer;
import com.funcoders.happy_pet_shop.entity.Product;
import com.funcoders.happy_pet_shop.entity.Review;
import com.funcoders.happy_pet_shop.entity.ReviewImage;
import com.funcoders.happy_pet_shop.mapper.ReviewMapper;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import com.funcoders.happy_pet_shop.repository.ReviewRepository;
import com.funcoders.happy_pet_shop.service.SentimentService.SentimentResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final ModerationService moderationService;
    private final ToxicService toxicService;
    private final SentimentService sentimentService;

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

        // Check comment against toxic classification server
        toxicService.checkComment(request.getComment());

        // Check images against moderation server first
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            moderationService.checkImages(request.getImageUrls());

            List<ReviewImage> images = IntStream.range(0, request.getImageUrls().size())
                    .mapToObj(i -> ReviewImage.builder()
                            .review(review)
                            .imageUrl(request.getImageUrls().get(i))
                            .sortOrder(i)
                            .build())
                    .collect(Collectors.toList());
            review.setImages(images);
        }

        reviewRepository.save(review);

        // Analyze sentiment of the comment
        try {
            SentimentResult sentiment = sentimentService.analyze(request.getComment());
            if (sentiment != null) {
                review.setSentimentLabel(sentiment.getSentimentType());
                reviewRepository.save(review);
            }
        } catch (Exception e) {
            System.err.println("Failed to analyze sentiment: " + e.getMessage());
        }

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

        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }
        for (Object[] row : distribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingDistribution.put(rating, count);
        }

        return ReviewStatsResponse.builder()
                .averageRating(Math.round(averageRating * 10.0) / 10.0)
                .totalReviews(totalReviews)
                .ratingDistribution(ratingDistribution)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ProductReviewResponse> getReviewsByCustomerId(UUID customerId) {
        return reviewMapper.toResponseList(
                reviewRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
        );
    }
}
