package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.request.PetCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.PetUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.PetResponse;
import com.funcoders.happy_pet_shop.entity.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetMapper {

    Pet toEntity(PetCreationRequest request);

    PetResponse toResponse(Pet pet);

    void updatePet(@MappingTarget Pet pet, PetUpdateRequest request);
}
