package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.CategoryCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.CategoryUpdateRequest;
import com.funcoders.happy_pet_shop.dto.request.UserCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.CategoryResponse;
import com.funcoders.happy_pet_shop.dto.response.CustomerResponse;
import com.funcoders.happy_pet_shop.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryCreationRequest request
    ) {
        CategoryResponse response = categoryService.createCategory(request);
        return new ApiResponse<>(response, "create category successfully");
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> responses = categoryService.getAllCategories();
        return new ApiResponse<>(responses, "get all categories successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(
            @PathVariable UUID id
    ) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return new ApiResponse<>(response, "get category successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategoryById(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryUpdateRequest request
    ) {
        CategoryResponse response = categoryService.updateCategoryById(id, request);
        return new ApiResponse<>(response, "update category successfully");
    }
}
