package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.response.InvoiceDetailResponse;
import com.funcoders.happy_pet_shop.entity.InvoiceDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceDetailMapper {

    @Mapping(target = "productId", expression = "java(invoiceDetail.getProduct() != null ? invoiceDetail.getProduct().getId() : null)")
    @Mapping(target = "productName", expression = "java(invoiceDetail.getProduct() != null ? invoiceDetail.getProduct().getName() : null)")
    @Mapping(target = "petId", expression = "java(invoiceDetail.getPet() != null ? invoiceDetail.getPet().getId() : null)")
    InvoiceDetailResponse toResponse(InvoiceDetail invoiceDetail);
}
