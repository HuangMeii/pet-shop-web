package com.sgu.happycashierscreen.controllers;

import com.sgu.happycashierscreen.dto.response.StaffResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Shared app state for staff user and sales data.
 */
public class AppState {
    @Getter
    @Setter
    private static StaffResponse staffUser = null;
    private static final List<SaleRecord> salesHistory = new ArrayList<>();

    public static void rememberUser(StaffResponse user) {
        // Could persist to prefs/file
        staffUser = user;
    }

    public static void addSale(SaleRecord sale) {
        salesHistory.add(sale);
    }

    public static List<SaleRecord> getSalesHistory() {
        return new ArrayList<>(salesHistory);
    }

    public static void clearSales() {
        salesHistory.clear();
    }

    public record SaleRecord(
            String id,
            String productName,
            int quantity,
            double unitPrice,
            double total,
            String timestamp,
            String paymentMethod
    ) {}
}
