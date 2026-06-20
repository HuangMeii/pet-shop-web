package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.CategoryCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.CategoryUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.CategoryResponse;
import com.funcoders.happy_pet_shop.entity.Category;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.CategoryMapper;
import com.funcoders.happy_pet_shop.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    @Transactional
    public CategoryResponse createCategory(CategoryCreationRequest request){
        if (categoryRepository.existsByName(request.getName()))
            throw new AppException(ErrorType.CATEGORY_ALREADY_EXISTS);

        Category categoryEntity = categoryMapper.toCategoryEntity(request);

        return categoryMapper.toResponse(categoryRepository.save(categoryEntity));
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(
                categoryMapper::toResponse
        ).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID id) {
        Category managedCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.CATEGORY_NOT_FOUND));

        return categoryMapper.toResponse(managedCategory);
    }

    @Transactional()
    public CategoryResponse updateCategoryById(UUID id, CategoryUpdateRequest request) {
        Category managedCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.CATEGORY_NOT_FOUND));

        categoryMapper.updateCategory(managedCategory, request);

        return categoryMapper.toResponse(managedCategory);
    }
}
