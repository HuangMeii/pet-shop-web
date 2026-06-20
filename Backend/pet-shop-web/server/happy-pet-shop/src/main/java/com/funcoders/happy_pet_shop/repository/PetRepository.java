package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {

    List<Pet> findByAvailableTrue();

    List<Pet> findBySpeciesIgnoreCase(String species);

    List<Pet> findBySoldFalse();
}
