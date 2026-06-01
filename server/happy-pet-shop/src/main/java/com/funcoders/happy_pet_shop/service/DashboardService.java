package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.response.DashboardStatsResponse;
import com.funcoders.happy_pet_shop.dto.response.DashboardStatsResponse.*;
import com.funcoders.happy_pet_shop.entity.Invoice;
import com.funcoders.happy_pet_shop.entity.InvoiceDetail;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.InvoiceRepository;
import com.funcoders.happy_pet_shop.repository.PetRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {

    InvoiceRepository invoiceRepository;
    CustomerRepository customerRepository;
    ProductRepository productRepository;
    PetRepository petRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        long totalOrders = invoiceRepository.count();
        long newCustomers = customerRepository.count();
        long totalProducts = productRepository.count();

        // Calculate total revenue from all invoices (sum of realAmount)
        BigDecimal totalRevenue = invoiceRepository.findAll().stream()
                .map(invoice -> invoice.getRealAmount() != null ? invoice.getRealAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Extended stats
        List<RevenueTrendItem> revenueTrend = getRevenueTrend();
        Map<String, Long> orderStatusDistribution = getOrderStatusDistribution();
        Map<String, Long> productTypeDistribution = getProductTypeDistribution();
        NewVsReturningCustomers newVsReturning = getNewVsReturningCustomers();
        List<TopItem> topPets = getTopItems("PET");
        List<TopItem> topProducts = getTopItems("PRODUCT");
        List<LowStockItem> lowStockAlerts = getLowStockAlerts();

        return DashboardStatsResponse.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .newCustomers(newCustomers)
                .totalProducts(totalProducts)
                .revenueTrend(revenueTrend)
                .orderStatusDistribution(orderStatusDistribution)
                .productTypeDistribution(productTypeDistribution)
                .newVsReturning(newVsReturning)
                .topPets(topPets)
                .topProducts(topProducts)
                .lowStockAlerts(lowStockAlerts)
                .build();
    }

    private List<RevenueTrendItem> getRevenueTrend() {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        Map<LocalDate, List<Invoice>> groupedByDate = allInvoices.stream()
                .filter(inv -> inv.getCreatedAt() != null)
                .collect(Collectors.groupingBy(inv -> inv.getCreatedAt().toLocalDate()));

        List<RevenueTrendItem> trend = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            List<Invoice> dayInvoices = groupedByDate.getOrDefault(date, Collections.emptyList());
            BigDecimal dayRevenue = dayInvoices.stream()
                    .map(inv -> inv.getRealAmount() != null ? inv.getRealAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            trend.add(RevenueTrendItem.builder()
                    .date(date)
                    .revenue(dayRevenue)
                    .orderCount(dayInvoices.size())
                    .build());
        }
        return trend;
    }

    private Map<String, Long> getOrderStatusDistribution() {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        return allInvoices.stream()
                .map(inv -> inv.getStatus() != null ? inv.getStatus().name() : "UNKNOWN")
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
    }

    private Map<String, Long> getProductTypeDistribution() {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        long productCount = 0;
        long petCount = 0;
        for (Invoice inv : allInvoices) {
            if (inv.getInvoiceDetails() != null) {
                for (InvoiceDetail detail : inv.getInvoiceDetails()) {
                    if (detail.getProduct() != null) {
                        productCount += detail.getQuantity();
                    }
                    if (detail.getPet() != null) {
                        petCount++;
                    }
                }
            }
        }
        Map<String, Long> dist = new HashMap<>();
        dist.put("PRODUCT", productCount);
        dist.put("PET", petCount);
        return dist;
    }

    private NewVsReturningCustomers getNewVsReturningCustomers() {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        // Count invoices per customer
        Map<UUID, Long> customerOrderCount = allInvoices.stream()
                .filter(inv -> inv.getCustomer() != null && inv.getCustomer().getId() != null)
                .collect(Collectors.groupingBy(
                        inv -> inv.getCustomer().getId(),
                        Collectors.counting()
                ));

        long newCust = 0;
        long returningCust = 0;
        for (long count : customerOrderCount.values()) {
            if (count == 1) {
                newCust++;
            } else {
                returningCust++;
            }
        }

        long total = newCust + returningCust;
        double newPct = total > 0 ? Math.round((double) newCust / total * 1000.0) / 10.0 : 0;
        double returningPct = total > 0 ? Math.round((double) returningCust / total * 1000.0) / 10.0 : 0;

        return NewVsReturningCustomers.builder()
                .newCustomers(newCust)
                .returningCustomers(returningCust)
                .newPercent(newPct)
                .returningPercent(returningPct)
                .build();
    }

    private List<TopItem> getTopItems(String type) {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        Map<String, TopItem.TopItemBuilder> itemMap = new LinkedHashMap<>();

        for (Invoice inv : allInvoices) {
            if (inv.getInvoiceDetails() != null) {
                for (InvoiceDetail detail : inv.getInvoiceDetails()) {
                    if ("PRODUCT".equals(type) && detail.getProduct() != null) {
                        String id = detail.getProduct().getId().toString();
                        itemMap.computeIfAbsent(id, k -> TopItem.builder()
                                .id(id)
                                .name(detail.getProduct().getName())
                                .imageUrl(detail.getProduct().getImageUrl())
                                .totalSold(0)
                                .totalRevenue(BigDecimal.ZERO));
                        TopItem.TopItemBuilder builder = itemMap.get(id);
                        builder.totalSold(builder.build().getTotalSold() + detail.getQuantity());
                        BigDecimal rev = detail.getTotalPrice() != null ? detail.getTotalPrice() : BigDecimal.ZERO;
                        if (detail.getDiscountAmount() != null) {
                            rev = rev.subtract(detail.getDiscountAmount());
                        }
                        builder.totalRevenue(builder.build().getTotalRevenue().add(rev));
                    } else if ("PET".equals(type) && detail.getPet() != null) {
                        String id = detail.getPet().getId().toString();
                        itemMap.computeIfAbsent(id, k -> TopItem.builder()
                                .id(id)
                                .name(detail.getPet().getName())
                                .imageUrl(detail.getPet().getImageUrl())
                                .totalSold(0)
                                .totalRevenue(BigDecimal.ZERO));
                        TopItem.TopItemBuilder builder = itemMap.get(id);
                        builder.totalSold(builder.build().getTotalSold() + 1);
                        BigDecimal rev = detail.getTotalPrice() != null ? detail.getTotalPrice() : BigDecimal.ZERO;
                        if (detail.getDiscountAmount() != null) {
                            rev = rev.subtract(detail.getDiscountAmount());
                        }
                        builder.totalRevenue(builder.build().getTotalRevenue().add(rev));
                    }
                }
            }
        }

        return itemMap.values().stream()
                .map(TopItem.TopItemBuilder::build)
                .sorted((a, b) -> Long.compare(b.getTotalSold(), a.getTotalSold()))
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<LowStockItem> getLowStockAlerts() {
        List<LowStockItem> alerts = new ArrayList<>();

        // Low stock products
        productRepository.findAll().stream()
                .filter(p -> p.getQuantity() < 5 && p.isAvailable())
                .forEach(p -> alerts.add(LowStockItem.builder()
                        .id(p.getId().toString())
                        .name(p.getName())
                        .currentStock(p.getQuantity())
                        .type("PRODUCT")
                        .build()));

        // Available pets (not sold)
        petRepository.findByAvailableTrue().stream()
                .filter(p -> Boolean.FALSE.equals(p.getSold()))
                .forEach(p -> alerts.add(LowStockItem.builder()
                        .id(p.getId().toString())
                        .name(p.getName() + " (" + p.getSpecies() + ")")
                        .currentStock(1)
                        .type("PET")
                        .build()));

        return alerts;
    }
}
