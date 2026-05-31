package com.funcoders.happy_pet_shop.mapper;

import com.funcoders.happy_pet_shop.dto.response.InvoiceResponse;
import com.funcoders.happy_pet_shop.entity.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {InvoiceDetailMapper.class, PromotionMapper.class}
)
public interface InvoiceMapper {

    // ===== Customer =====
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(
            target = "customerName",
            expression = "java(invoice.getCustomer().getUser().getLastName() + \" \" + invoice.getCustomer().getUser().getFirstName())"
    )

    // ===== Staff (nullable) =====
    @Mapping(target = "staffId", source = "staff.id")
    @Mapping(
            target = "staffName",
            expression = "java(invoice.getStaff() != null ? " +
                    "invoice.getStaff().getUser().getLastName() + \" \" + invoice.getStaff().getUser().getFirstName() : null)"
    )

    // ===== Invoice Details =====
    @Mapping(target = "invoiceDetails", source = "invoiceDetails")
    InvoiceResponse toResponse(Invoice invoice);
}
