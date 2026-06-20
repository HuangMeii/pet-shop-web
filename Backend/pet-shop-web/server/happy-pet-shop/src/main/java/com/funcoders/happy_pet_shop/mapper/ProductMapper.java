package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.request.ProductCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.ProductUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.ProductResponse;
import com.funcoders.happy_pet_shop.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductCreationRequest request);

    @Mapping(target = "category", ignore = true)
    void updateProduct(@MappingTarget Product productEntity, ProductUpdateRequest request);

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "categoryId", source = "category.id")
    ProductResponse toResponse(Product productEntity);
}
