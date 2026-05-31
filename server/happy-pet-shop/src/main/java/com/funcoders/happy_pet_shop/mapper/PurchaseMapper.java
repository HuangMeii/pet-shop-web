package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.response.PurchaseResponse;
import com.funcoders.happy_pet_shop.entity.Purchase;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {PurchaseDetailMapper.class, SupplierMapper.class, StaffMapper.class})
public interface PurchaseMapper {
    PurchaseResponse toResponse(Purchase purchase);
}
