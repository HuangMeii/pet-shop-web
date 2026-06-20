package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.request.PromotionCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.PromotionUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.PromotionResponse;
import com.funcoders.happy_pet_shop.entity.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = PromotionDetailMapper.class)
public interface PromotionMapper {

    @Mapping(target = "promotionDetails", ignore = true)
    Promotion toEntity(PromotionCreationRequest request);

    void updatePromotion(@MappingTarget Promotion promotion, PromotionUpdateRequest request);

    @Mapping(target = "promotionDetails", source = "promotionDetails")
    PromotionResponse toResponse(Promotion promotion);
}
