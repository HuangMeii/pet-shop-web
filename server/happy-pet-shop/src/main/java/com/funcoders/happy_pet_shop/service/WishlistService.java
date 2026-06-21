package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.WishlistRequest;
import com.funcoders.happy_pet_shop.dto.response.ProductResponse;
import com.funcoders.happy_pet_shop.dto.response.WishlistResponse;
import com.funcoders.happy_pet_shop.entity.Customer;
import com.funcoders.happy_pet_shop.entity.Product;
import com.funcoders.happy_pet_shop.entity.Wishlist;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.ProductMapper;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import com.funcoders.happy_pet_shop.repository.WishlistRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishlistService {

    WishlistRepository wishlistRepository;
    CustomerRepository customerRepository;
    ProductRepository productRepository;
    ProductMapper productMapper;

    public List<WishlistResponse> getWishlistByCustomerId(UUID customerId) {
        return wishlistRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistResponse addToWishlist(UUID customerId, WishlistRequest request) {
        UUID productId = UUID.fromString(request.getProductId());

        // Check if already in wishlist
        if (wishlistRepository.existsByCustomerIdAndProductId(customerId, productId)) {
            throw new AppException(ErrorType.ALREADY_EXISTS);
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        Wishlist wishlist = Wishlist.builder()
                .customer(customer)
                .product(product)
                .build();

        return toResponse(wishlistRepository.save(wishlist));
    }

    @Transactional
    public void removeFromWishlist(UUID customerId, UUID productId) {
        wishlistRepository.deleteByCustomerIdAndProductId(customerId, productId);
    }

    public boolean isInWishlist(UUID customerId, UUID productId) {
        return wishlistRepository.existsByCustomerIdAndProductId(customerId, productId);
    }

    private WishlistResponse toResponse(Wishlist wishlist) {
        ProductResponse productResponse = productMapper.toResponse(wishlist.getProduct());
        return WishlistResponse.builder()
                .id(wishlist.getId())
                .product(productResponse)
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}
