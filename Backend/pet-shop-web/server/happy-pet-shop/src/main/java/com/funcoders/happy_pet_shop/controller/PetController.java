package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.request.PetCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.PetUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.ApiResponse;
import com.funcoders.happy_pet_shop.dto.response.PetResponse;
import com.funcoders.happy_pet_shop.service.PetService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetController {

    PetService petService;

    @PostMapping
    public ApiResponse<PetResponse> createPet(@Valid @RequestBody PetCreationRequest request) {
        PetResponse response = petService.createPet(request);
        return new ApiResponse<>(response, "Create pet successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<PetResponse> getPetById(@PathVariable UUID id) {
        PetResponse response = petService.getPetById(id);
        return new ApiResponse<>(response, "Get pet successfully");
    }

    @GetMapping
    public ApiResponse<List<PetResponse>> getAllPets() {
        List<PetResponse> responseList = petService.getAllPets();
        return new ApiResponse<>(responseList, "Get all pets successfully");
    }

    @GetMapping("/paginate")
    public ApiResponse<List<PetResponse>> getAllPetsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (page < 0) page = 0;
        if (size < 1) size = 10;

        List<PetResponse> responseList = petService.getAllPetsPaginated(page, size);
        return new ApiResponse<>(responseList, "Get all pets successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<PetResponse> updatePet(
            @PathVariable UUID id,
            @Valid @RequestBody PetUpdateRequest request
    ) {
        PetResponse response = petService.updatePet(id, request);
        return new ApiResponse<>(response, "Update pet successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePet(@PathVariable UUID id) {
        petService.deletePet(id);
        return new ApiResponse<>(null, "Delete pet successfully");
    }

    @PatchMapping("/{id}/sold")
    public ApiResponse<Void> markAsSold(@PathVariable UUID id) {
        petService.markAsSold(id);
        return new ApiResponse<>(null, "Mark pet as sold successfully");
    }
}