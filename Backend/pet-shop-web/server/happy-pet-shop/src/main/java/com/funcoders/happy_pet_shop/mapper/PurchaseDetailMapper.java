package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.request.PurchaseDetailCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.PurchaseDetailResponse;
import com.funcoders.happy_pet_shop.entity.PurchaseDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PurchaseDetailMapper {

    @Mapping(target = "productId", expression = "java(purchaseDetail.getProduct() != null ? purchaseDetail.getProduct().getId() : null)")
    @Mapping(target = "productName", expression = "java(purchaseDetail.getProduct() != null ? purchaseDetail.getProduct().getName() : null)")
    PurchaseDetailResponse toResponse(PurchaseDetail purchaseDetail);

    PurchaseDetail toEntity(PurchaseDetailCreationRequest request);
}
