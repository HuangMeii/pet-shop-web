package com.funcoders.happy_pet_shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DashboardStatsResponse {
    long totalOrders;
    BigDecimal totalRevenue;
    long newCustomers;
    long totalProducts;

    // Extended stats
    List<RevenueTrendItem> revenueTrend;
    Map<String, Long> orderStatusDistribution;
    Map<String, Long> productTypeDistribution;
    NewVsReturningCustomers newVsReturning;
    List<TopItem> topPets;
    List<TopItem> topProducts;
    List<LowStockItem> lowStockAlerts;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RevenueTrendItem {
        LocalDate date;
        BigDecimal revenue;
        long orderCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NewVsReturningCustomers {
        long newCustomers;
        long returningCustomers;
        double newPercent;
        double returningPercent;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TopItem {
        String id;
        String name;
        long totalSold;
        BigDecimal totalRevenue;
        String imageUrl;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class LowStockItem {
        String id;
        String name;
        int currentStock;
        String type; // PRODUCT or PET
    }
}
