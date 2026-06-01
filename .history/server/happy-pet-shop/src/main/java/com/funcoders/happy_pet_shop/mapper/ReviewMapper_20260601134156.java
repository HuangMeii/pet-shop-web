package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.response.ProductReviewResponse;
import com.funcoders.happy_pet_shop.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", expression = "java(review.getCustomer().getUser().getFirstName() + \" \" + review.getCustomer().getUser().getLastName())")
    @Mapping(target = "imageUrls", expression = "java(mapImages(review))")
    ProductReviewResponse toResponse(Review review);

    List<ProductReviewResponse> toResponseList(List<Review> reviews);

    default List<String> mapImages(Review review) {
        if (review.getImages() == null || review.getImages().isEmpty()) {
            return Collections.emptyList();
        }
        return review.getImages().stream()
                .sorted((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                .map(img -> img.getImageUrl())
                .collect(Collectors.toList());
    }
}
