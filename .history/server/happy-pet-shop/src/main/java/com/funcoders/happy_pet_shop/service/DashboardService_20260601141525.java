package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.response.DashboardStatsResponse;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.InvoiceRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {

    InvoiceRepository invoiceRepository;
    CustomerRepository customerRepository;
    ProductRepository productRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        long totalOrders = invoiceRepository.count();
        long newCustomers = customerRepository.count();
        long totalProducts = productRepository.count();

        // Calculate total revenue from all invoices (sum of realAmount)
        BigDecimal totalRevenue = invoiceRepository.findAll().stream()
                .map(invoice -> invoice.getRealAmount() != null ? invoice.getRealAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsResponse.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .newCustomers(newCustomers)
                .totalProducts(totalProducts)
                .build();
    }
}
