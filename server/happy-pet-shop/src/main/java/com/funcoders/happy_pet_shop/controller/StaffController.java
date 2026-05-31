package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.StaffCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.StaffResponse;
import com.funcoders.happy_pet_shop.service.StaffService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/staffs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffController {

    StaffService staffService;

    @PostMapping
    public ApiResponse<StaffResponse> createStaff(@RequestBody @Valid StaffCreationRequest request) {
        StaffResponse response = staffService.createStaff(request);
        return new ApiResponse<>(response, "create staff successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<StaffResponse> getStaffById(@PathVariable UUID id) {
        StaffResponse response = staffService.getStaffById(id);
        return new ApiResponse<>(response, "get staff successfully");
    }

    @GetMapping
    public ApiResponse<List<StaffResponse>> getAllStaff() {
        List<StaffResponse> responses = staffService.getAllStaff();
        return new ApiResponse<>(responses, "get all staff successfully");
    }

    @PutMapping("/{id}/shift")
    public ApiResponse<StaffResponse> updateStaffShift(@PathVariable UUID id, @RequestParam int shift) {
        StaffResponse response = staffService.updateStaffShift(id, shift);
        return new ApiResponse<>(response, "update staff shift successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteStaff(
            @PathVariable UUID id
    ) {
        staffService.deleteStaff(id);
        return new ApiResponse<>(null, "delete staff successfully");
    }

    @GetMapping("/info")
    public ApiResponse<StaffResponse> getInfo() {
        StaffResponse response = staffService.getInfo();

        return new ApiResponse<StaffResponse>(response, "get staff successfully");
    }
}

