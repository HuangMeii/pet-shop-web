package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.request.SupplierCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.SupplierUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.SupplierResponse;
import com.funcoders.happy_pet_shop.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    Supplier toEntity(SupplierCreationRequest request);

    SupplierResponse toResponse(Supplier supplier);

    void updateSupplier(@MappingTarget Supplier supplier, SupplierUpdateRequest request);
}

