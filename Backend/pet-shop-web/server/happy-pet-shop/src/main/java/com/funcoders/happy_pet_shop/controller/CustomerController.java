package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.CartRequest;
import com.funcoders.happy_pet_shop.dto.request.UserCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.CartResponse;
import com.funcoders.happy_pet_shop.dto.response.CustomerResponse;
import com.funcoders.happy_pet_shop.service.CartService;
import com.funcoders.happy_pet_shop.service.CustomerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {

    CartService cartService;

    CustomerService customerService;

    @PostMapping
    public ApiResponse<CustomerResponse> createCustomer(
            @RequestBody UserCreationRequest request
    ) {
        CustomerResponse response = customerService.createCustomer(request);
        return new ApiResponse<>(response, "Create customer successfully");
    }

    @GetMapping
    public ApiResponse<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> responses = customerService.getAllCustomers();
        return new ApiResponse<>(responses, "Get all customers successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> getCustomerById(
            @PathVariable UUID id
    ) {
        CustomerResponse response = customerService.getCustomerById(id);
        return new ApiResponse<>(response, "Get customer successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCustomer(
            @PathVariable UUID id
    ) {
        customerService.deleteCustomer(id);
        return new ApiResponse<>(null, "Delete customer successfully");
    }

    @GetMapping("/info")
    public ApiResponse<CustomerResponse> getInfo() {
        CustomerResponse response = customerService.getInfo();
        return new ApiResponse<>(response, "Get customer successfully");
    }

    @PostMapping("/{id}/points")
    public ApiResponse<CustomerResponse> addPoints(
            @PathVariable UUID id,
            @RequestParam BigDecimal points
    ) {
        CustomerResponse response = customerService.addPoints(id, points);
        return new ApiResponse<>(response, "Add points successfully");
    }

    @PostMapping("/{customerId}/items")
    public ApiResponse<CartResponse> addProductToCart(
            @PathVariable UUID customerId,
            @RequestBody CartRequest request
    ) {

        CartResponse response = cartService.addProduct(customerId, request);

        return new ApiResponse<>(response, "Add product successfully");
    }
}
