package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.request.CategoryCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.CategoryUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.CategoryResponse;
import com.funcoders.happy_pet_shop.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategoryEntity(CategoryCreationRequest request);

    CategoryResponse toResponse(Category category);

    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);
}
