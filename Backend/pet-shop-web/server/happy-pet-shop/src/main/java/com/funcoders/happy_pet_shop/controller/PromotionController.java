package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.PromotionCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.PromotionResponse;
import com.funcoders.happy_pet_shop.service.PromotionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/promotions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionController {

    PromotionService promotionService;

    @PostMapping
    public ApiResponse<PromotionResponse> createPromotion(@RequestBody @Valid PromotionCreationRequest request) {
        PromotionResponse response = promotionService.createPromotion(request);
        return new ApiResponse<>(response, "create promotion successfully");
    }
    @GetMapping("/{id}")
    public ApiResponse<PromotionResponse> getPromotionById(@PathVariable UUID id) {
        PromotionResponse response = promotionService.getPromotionById(id);
        return new ApiResponse<>(response, "get promotion successfully");
    }

    @GetMapping
    public ApiResponse<List<PromotionResponse>> getAllPromotions() {
        List<PromotionResponse> responses = promotionService.getAllPromotions();
        return new ApiResponse<>(responses, "get all promotions successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePromotion(@PathVariable UUID id) {
        promotionService.deletePromotion(id);
        return new ApiResponse<>(null, "delete promotion successfully");
    }
}

