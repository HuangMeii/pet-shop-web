package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.PetCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.PetUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.PetResponse;
import com.funcoders.happy_pet_shop.entity.Pet;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.PetMapper;
import com.funcoders.happy_pet_shop.repository.PetRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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
public class PetService {

    PetRepository petRepository;
    PetMapper petMapper;

    @Transactional
    public PetResponse createPet(PetCreationRequest request) {

        Pet petEntity = petMapper.toEntity(request);

        return petMapper.toResponse(
                petRepository.save(petEntity)
        );
    }

    public PetResponse getPetById(UUID id) {

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        return petMapper.toResponse(pet);
    }

    public List<PetResponse> getAllPets() {

        return petRepository.findAll()
                .stream()
                .map(petMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<PetResponse> getAllPetsPaginated(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return petRepository.findAll(pageable)
                .stream()
                .map(petMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public PetResponse updatePet(UUID id, PetUpdateRequest request) {

        Pet petEntity = petRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        petMapper.updatePet(petEntity, request);

        return petMapper.toResponse(
                petRepository.save(petEntity)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deletePet(UUID id) {

        if (!petRepository.existsById(id)) {
            throw new AppException(ErrorType.NOT_FOUND);
        }

        petRepository.deleteById(id);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void markAsSold(UUID id) {

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        pet.markAsSold();
    }
}
