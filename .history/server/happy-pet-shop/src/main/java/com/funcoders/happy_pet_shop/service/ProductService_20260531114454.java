package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.ProductCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.ProductUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.ProductResponse;
import com.funcoders.happy_pet_shop.entity.Category;
import com.funcoders.happy_pet_shop.entity.Product;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.ProductMapper;
import com.funcoders.happy_pet_shop.repository.CategoryRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ProductResponse createProduct(ProductCreationRequest request) {
        Product productEntity = productMapper.toEntity(request);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorType.INVALID_CATEGORY));

        productEntity.setCategory(category);

        return productMapper.toResponse(productRepository.save(productEntity));
    }

    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));
        return productMapper.toResponse(product);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProductsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ProductResponse updateProduct(UUID id, ProductUpdateRequest request) {
//        SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().map(grantedAuthority -> {return grantedAuthority.toString();});

        Product productEntity = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        productMapper.updateProduct(productEntity, request);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorType.INVALID_CATEGORY));

        productEntity.setCategory(category);

        System.out.println(productEntity.isAvailable());
        return productMapper.toResponse(productRepository.save(productEntity));
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorType.NOT_FOUND);
        }
        productRepository.deleteById(id);
    }
}
