package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.ProductCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.ProductUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.ProductResponse;
import com.funcoders.happy_pet_shop.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductCreationRequest request) {
        ProductResponse response = productService.createProduct(request);
        return new ApiResponse<>(response, "Create product successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable UUID id) {
        ProductResponse response = productService.getProductById(id);
        return new ApiResponse<>(response, "Get product successfully");
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> responseList = productService.getAllProducts();
        return new ApiResponse<>(responseList, "Get all products successfully");
    }

    @GetMapping("/paginate")
    public ApiResponse<List<ProductResponse>> getAllProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (page < 0) page = 0;
        if (size < 1) size = 10;

        List<ProductResponse> responseList = productService.getAllProductsPaginated(page, size);
        return new ApiResponse<>(responseList, "Get all products successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable UUID id, @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return new ApiResponse<>(response, "Update product successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return new ApiResponse<>(null, "Delete product successfully");
    }
}
