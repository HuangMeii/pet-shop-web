package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.WishlistRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.WishlistResponse;
import com.funcoders.happy_pet_shop.service.WishlistService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/wishlists")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishlistController {

    WishlistService wishlistService;

    @GetMapping("/customer/{customerId}")
    public ApiResponse<List<WishlistResponse>> getWishlist(@PathVariable UUID customerId) {
        List<WishlistResponse> responses = wishlistService.getWishlistByCustomerId(customerId);
        return new ApiResponse<>(responses, "Get wishlist successfully");
    }

    @PostMapping("/customer/{customerId}")
    public ApiResponse<WishlistResponse> addToWishlist(
            @PathVariable UUID customerId,
            @RequestBody WishlistRequest request
    ) {
        WishlistResponse response = wishlistService.addToWishlist(customerId, request);
        return new ApiResponse<>(response, "Add to wishlist successfully");
    }

    @DeleteMapping("/customer/{customerId}/product/{productId}")
    public ApiResponse<Void> removeFromWishlist(
            @PathVariable UUID customerId,
            @PathVariable UUID productId
    ) {
        wishlistService.removeFromWishlist(customerId, productId);
        return new ApiResponse<>(null, "Remove from wishlist successfully");
    }

    @GetMapping("/customer/{customerId}/product/{productId}")
    public ApiResponse<Boolean> isInWishlist(
            @PathVariable UUID customerId,
            @PathVariable UUID productId
    ) {
        boolean exists = wishlistService.isInWishlist(customerId, productId);
        return new ApiResponse<>(exists, "Check wishlist successfully");
    }
}
