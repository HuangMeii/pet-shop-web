package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.ReviewCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ProductReviewResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewStatsResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewStatisticsResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewStatisticsResponse.*;
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

    // ========== Admin methods ==========

    @Transactional(readOnly = true)
    public List<ProductReviewResponse> getAllReviews() {
        return reviewMapper.toResponseList(
                reviewRepository.findAllOrderByCreatedAtDesc()
        );
    }

    @Transactional
    public void deleteReview(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        reviewRepository.delete(review);
    }

    @Transactional(readOnly = true)
    public SentimentStatsResponse getSentimentStats() {
        List<Object[]> results = reviewRepository.countBySentimentLabel();
        long total = 0;
        long positive = 0;
        long neutral = 0;
        long negative = 0;

        for (Object[] row : results) {
            String label = (String) row[0];
            Long count = (Long) row[1];
            total += count;
            if ("POSITIVE".equals(label)) {
                positive = count;
            } else if ("NEGATIVE".equals(label)) {
                negative = count;
            } else {
                neutral += count;
            }
        }

        // Also count reviews with null sentiment label as neutral
        long totalReviews = reviewRepository.count();
        long nullLabelCount = totalReviews - total;
        neutral += nullLabelCount;
        total = totalReviews;

        double positivePercent = total > 0 ? Math.round((double) positive / total * 1000.0) / 10.0 : 0.0;
        double neutralPercent = total > 0 ? Math.round((double) neutral / total * 1000.0) / 10.0 : 0.0;
        double negativePercent = total > 0 ? Math.round((double) negative / total * 1000.0) / 10.0 : 0.0;

        return SentimentStatsResponse.builder()
                .totalReviews(total)
                .positive(positive)
                .neutral(neutral)
                .negative(negative)
                .positivePercent(positivePercent)
                .neutralPercent(neutralPercent)
                .negativePercent(negativePercent)
                .build();
    }

    // ========== Review Statistics for Dashboard ==========

    @Transactional(readOnly = true)
    public ReviewStatisticsResponse getReviewStatistics() {
        List<MonthlyTrendItem> monthlyTrend = getMonthlyTrend();
        Map<Integer, SentimentStatsResponse> sentimentByRating = getSentimentByRating();
        List<SentimentMonthlyTrendItem> sentimentMonthlyTrend = getSentimentMonthlyTrend();

        // Compute summary statistics
        List<Review> allReviews = reviewRepository.findAllOrderByCreatedAtDesc();
        long totalReviews = allReviews.size();

        double avgRating = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        double averageRating = Math.round(avgRating * 10.0) / 10.0;

        long productsWithReviews = allReviews.stream()
                .map(r -> r.getProduct().getId())
                .distinct()
                .count();

        // Rating distribution
        Map<String, Long> ratingDistribution = new LinkedHashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int rating = i;
            long count = allReviews.stream()
                    .filter(r -> r.getRating() == rating)
                    .count();
            ratingDistribution.put(String.valueOf(i), count);
        }

        // Monthly review counts
        Map<String, Long> monthlyReviewCounts = new LinkedHashMap<>();
        Map<String, List<Review>> groupedByMonth = allReviews.stream()
                .filter(r -> r.getCreatedAt() != null)
                .collect(Collectors.groupingBy(r -> r.getCreatedAt().getYear() + "-" + String.format("%02d", r.getCreatedAt().getMonthValue())));
        groupedByMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> monthlyReviewCounts.put(entry.getKey(), (long) entry.getValue().size()));

        return ReviewStatisticsResponse.builder()
                .totalReviews(totalReviews)
                .averageRating(averageRating)
                .productsWithReviews(productsWithReviews)
                .ratingDistribution(ratingDistribution)
                .monthlyReviewCounts(monthlyReviewCounts)
                .monthlyTrend(monthlyTrend)
                .sentimentByRating(sentimentByRating)
                .sentimentMonthlyTrend(sentimentMonthlyTrend)
                .build();
    }


    private List<MonthlyTrendItem> getMonthlyTrend() {
        List<Review> allReviews = reviewRepository.findAllOrderByCreatedAtDesc();
        Map<String, List<Review>> groupedByMonth = allReviews.stream()
                .filter(r -> r.getCreatedAt() != null)
                .collect(Collectors.groupingBy(r -> r.getCreatedAt().getYear() + "-" + r.getCreatedAt().getMonthValue()));

        List<MonthlyTrendItem> trend = new ArrayList<>();
        for (Map.Entry<String, List<Review>> entry : groupedByMonth.entrySet()) {
            String[] parts = entry.getKey().split("-");
            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            List<Review> reviews = entry.getValue();
            double avgRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            trend.add(MonthlyTrendItem.builder()
                    .year(year)
                    .month(month)
                    .reviewCount(reviews.size())
                    .averageRating(Math.round(avgRating * 10.0) / 10.0)
                    .build());
        }
        trend.sort((a, b) -> {
            int cmp = Integer.compare(a.getYear(), b.getYear());
            if (cmp == 0) cmp = Integer.compare(a.getMonth(), b.getMonth());
            return cmp;
        });
        return trend;
    }

    private Map<Integer, SentimentStatsResponse> getSentimentByRating() {
        Map<Integer, SentimentStatsResponse> result = new LinkedHashMap<>();
        List<Review> allReviews = reviewRepository.findAllOrderByCreatedAtDesc();
        for (int rating = 1; rating <= 5; rating++) {
            final int currentRating = rating;
            List<Review> reviewsForRating = allReviews.stream()
                    .filter(r -> r.getRating() == currentRating)
                    .collect(Collectors.toList());

            long total = reviewsForRating.size();
            long positive = reviewsForRating.stream().filter(r -> "POSITIVE".equals(r.getSentimentLabel())).count();
            long negative = reviewsForRating.stream().filter(r -> "NEGATIVE".equals(r.getSentimentLabel())).count();
            long neutral = total - positive - negative;

            double posPct = total > 0 ? Math.round((double) positive / total * 1000.0) / 10.0 : 0;
            double neuPct = total > 0 ? Math.round((double) neutral / total * 1000.0) / 10.0 : 0;
            double negPct = total > 0 ? Math.round((double) negative / total * 1000.0) / 10.0 : 0;

            result.put(rating, SentimentStatsResponse.builder()
                    .totalReviews(total)
                    .positive(positive)
                    .neutral(neutral)
                    .negative(negative)
                    .positivePercent(posPct)
                    .neutralPercent(neuPct)
                    .negativePercent(negPct)
                    .build());
        }
        return result;
    }

    private List<SentimentMonthlyTrendItem> getSentimentMonthlyTrend() {
        List<Review> allReviews = reviewRepository.findAllOrderByCreatedAtDesc();
        Map<String, List<Review>> groupedByMonth = allReviews.stream()
                .filter(r -> r.getCreatedAt() != null)
                .collect(Collectors.groupingBy(r -> r.getCreatedAt().getYear() + "-" + r.getCreatedAt().getMonthValue()));

        List<SentimentMonthlyTrendItem> trend = new ArrayList<>();
        for (Map.Entry<String, List<Review>> entry : groupedByMonth.entrySet()) {
            String[] parts = entry.getKey().split("-");
            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            List<Review> reviews = entry.getValue();

            long positive = reviews.stream().filter(r -> "POSITIVE".equals(r.getSentimentLabel())).count();
            long negative = reviews.stream().filter(r -> "NEGATIVE".equals(r.getSentimentLabel())).count();
            long neutral = reviews.size() - positive - negative;

            trend.add(SentimentMonthlyTrendItem.builder()
                    .year(year)
                    .month(month)
                    .positive(positive)
                    .neutral(neutral)
                    .negative(negative)
                    .build());
        }
        trend.sort((a, b) -> {
            int cmp = Integer.compare(a.getYear(), b.getYear());
            if (cmp == 0) cmp = Integer.compare(a.getMonth(), b.getMonth());
            return cmp;
        });
        return trend;
    }
}
