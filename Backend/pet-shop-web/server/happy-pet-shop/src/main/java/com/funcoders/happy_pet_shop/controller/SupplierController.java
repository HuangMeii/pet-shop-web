package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.SupplierCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.SupplierUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.SupplierResponse;
import com.funcoders.happy_pet_shop.service.SupplierService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierController {

    SupplierService supplierService;

    @PostMapping
    public ApiResponse<SupplierResponse> createSupplier(@RequestBody @Valid SupplierCreationRequest request) {
        SupplierResponse response = supplierService.createSupplier(request);
        return new ApiResponse<>(response, "create supplier successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<SupplierResponse> getSupplierById(@PathVariable UUID id) {
        SupplierResponse response = supplierService.getSupplierById(id);
        return new ApiResponse<>(response, "get supplier successfully");
    }

    @GetMapping
    public ApiResponse<List<SupplierResponse>> getAllSuppliers() {
        List<SupplierResponse> responses = supplierService.getAllSuppliers();
        return new ApiResponse<>(responses, "get all suppliers successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<SupplierResponse> updateSupplier(
            @PathVariable UUID id,
            @RequestBody @Valid SupplierUpdateRequest request
    ) {
        SupplierResponse response = supplierService.updateSupplier(id, request);
        return new ApiResponse<>(response, "update supplier successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSupplier(@PathVariable UUID id) {
        supplierService.deleteSupplier(id);
        return new ApiResponse<>(null, "delete supplier successfully");
    }
}

