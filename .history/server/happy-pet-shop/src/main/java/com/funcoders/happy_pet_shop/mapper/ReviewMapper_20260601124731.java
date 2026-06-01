package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.response.ProductReviewResponse;
import com.funcoders.happy_pet_shop.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", source = "customer.user.lastName")
    ProductReviewResponse toResponse(Review review);

    List<ProductReviewResponse> toResponseList(List<Review> reviews);
}
