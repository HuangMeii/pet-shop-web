package com.sgu.happycashierscreen.controllers;

import com.sgu.happycashierscreen.dto.response.InvoiceDetailResponse;
import com.sgu.happycashierscreen.dto.response.InvoiceResponse;
import com.sgu.happycashierscreen.services.InvoiceService;
import javafx.application.Platform;
import javafx.beans.property.SimpleStringProperty;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

import java.math.BigDecimal;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

public class HistoryController implements Initializable {
    @FXML private Label todayTotalLabel;
    @FXML private Label cashTotalLabel;
    @FXML private Label cardTotalLabel;
    @FXML private Button filterAllBtn;
    @FXML private Button filterTodayBtn;
    @FXML private Button filterWeekBtn;
    @FXML private Button filterMonthBtn;
    @FXML private TableView<SaleRow> salesTableView;
    @FXML private TableColumn<SaleRow, String> dateColumn;
    @FXML private TableColumn<SaleRow, String> productColumn;
    @FXML private TableColumn<SaleRow, String> qtyColumn;
    @FXML private TableColumn<SaleRow, String> totalColumn;
    @FXML private TableColumn<SaleRow, String> methodColumn;

    private String currentFilter = "all";

    /** Combined list: invoices from API + local sales from AppState */
    private final List<AppState.SaleRecord> allSales = new ArrayList<>();

    public static class SaleRow {
        private final SimpleStringProperty dateTime;
        private final SimpleStringProperty product;
        private final SimpleStringProperty qty;
        private final SimpleStringProperty total;
        private final SimpleStringProperty method;

        public SaleRow(String dateTime, String product, String qty, String total, String method) {
            this.dateTime = new SimpleStringProperty(dateTime);
            this.product = new SimpleStringProperty(product);
            this.qty = new SimpleStringProperty(qty);
            this.total = new SimpleStringProperty(total);
            this.method = new SimpleStringProperty(method);
        }

        public String getDateTime() { return dateTime.get(); }
        public String getProduct() { return product.get(); }
        public String getQty() { return qty.get(); }
        public String getTotal() { return total.get(); }
        public String getMethod() { return method.get(); }
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        dateColumn.setCellValueFactory(new PropertyValueFactory<>("dateTime"));
        productColumn.setCellValueFactory(new PropertyValueFactory<>("product"));
        qtyColumn.setCellValueFactory(new PropertyValueFactory<>("qty"));
        totalColumn.setCellValueFactory(new PropertyValueFactory<>("total"));
        methodColumn.setCellValueFactory(new PropertyValueFactory<>("method"));

        filterAllBtn.getStyleClass().add("active");

        // Load invoices from API in background thread
        loadInvoicesFromApi();
    }

    private void loadInvoicesFromApi() {
        new Thread(() -> {
            try {
                List<InvoiceResponse> invoices = InvoiceService.fetchAllInvoices();
                Platform.runLater(() -> {
                    allSales.clear();
                    // Convert API invoices to SaleRecord
                    for (InvoiceResponse inv : invoices) {
                        String timestamp = inv.getCreatedAt() != null
                                ? inv.getCreatedAt().toString().replace("T", "T")
                                : new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new Date());
                        // Ensure format is yyyy-MM-dd'T'HH:mm:ss (strip nanos/millis)
                        if (timestamp.contains(".")) {
                            timestamp = timestamp.substring(0, timestamp.indexOf("."));
                        }
                        if (timestamp.contains("+")) {
                            timestamp = timestamp.substring(0, timestamp.indexOf("+"));
                        }
                        String paymentMethod = normalizePaymentMethod(inv.getPaymentMethod());

                        if (inv.getInvoiceDetails() != null && !inv.getInvoiceDetails().isEmpty()) {
                            for (InvoiceDetailResponse detail : inv.getInvoiceDetails()) {
                                double unitPrice = detail.getUnitPrice() != null ? detail.getUnitPrice().doubleValue() : 0;
                                int qty = detail.getQuantity() != null ? detail.getQuantity() : 0;
                                double total = detail.getTotalPrice() != null ? detail.getTotalPrice().doubleValue() : (unitPrice * qty);
                                String productName = detail.getProductName() != null && !detail.getProductName().isBlank()
                                        ? detail.getProductName()
                                        : "Product " + (detail.getProductId() != null ? detail.getProductId().toString().substring(0, 8) : "?");
                                allSales.add(new AppState.SaleRecord(
                                        inv.getId() != null ? inv.getId().toString() : UUID.randomUUID().toString(),
                                        productName,
                                        qty,
                                        unitPrice,
                                        total,
                                        timestamp,
                                        paymentMethod
                                ));
                            }
                        } else {
                            // Invoice with no details - show as single row
                            double totalAmount = inv.getTotalAmount() != null ? inv.getTotalAmount().doubleValue() : 0;
                            allSales.add(new AppState.SaleRecord(
                                    inv.getId() != null ? inv.getId().toString() : UUID.randomUUID().toString(),
                                    "Invoice #" + (inv.getId() != null ? inv.getId().toString().substring(0, 8) : "?"),
                                    1,
                                    totalAmount,
                                    totalAmount,
                                    timestamp,
                                    paymentMethod
                            ));
                        }
                    }
                    // Also add local sales from AppState (sales made in current session)
                    allSales.addAll(AppState.getSalesHistory());
                    // Sort by timestamp descending
                    allSales.sort((a, b) -> b.timestamp().compareTo(a.timestamp()));
                    refresh();
                });
            } catch (Exception e) {
                Platform.runLater(() -> {
                    // If API fails, fall back to local sales only
                    allSales.clear();
                    allSales.addAll(AppState.getSalesHistory());
                    refresh();
                });
            }
        }, "load-invoices").start();
    }

    private String normalizePaymentMethod(String method) {
        if (method == null) return "cash";
        String m = method.toLowerCase();
        if (m.equals("cod") || m.equals("cash")) return "cash";
        if (m.equals("qr_scanning") || m.equals("card") || m.equals("credit_card")) return "card";
        return m;
    }

    private List<AppState.SaleRecord> getFilteredSales() {
        if ("all".equals(currentFilter)) return new ArrayList<>(allSales);
        Date now = new Date();
        return allSales.stream().filter(s -> {
            try {
                Date d = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(s.timestamp());
                if ("today".equals(currentFilter)) {
                    return sameDay(d, now);
                }
                if ("week".equals(currentFilter)) {
                    Calendar weekAgo = Calendar.getInstance();
                    weekAgo.add(Calendar.DAY_OF_YEAR, -7);
                    return d.after(weekAgo.getTime());
                }
                if ("month".equals(currentFilter)) {
                    Calendar monthAgo = Calendar.getInstance();
                    monthAgo.add(Calendar.MONTH, -1);
                    return d.after(monthAgo.getTime());
                }
            } catch (Exception ignored) {}
            return true;
        }).collect(Collectors.toList());
    }

    private boolean sameDay(Date a, Date b) {
        Calendar ca = Calendar.getInstance();
        ca.setTime(a);
        Calendar cb = Calendar.getInstance();
        cb.setTime(b);
        return ca.get(Calendar.YEAR) == cb.get(Calendar.YEAR)
                && ca.get(Calendar.DAY_OF_YEAR) == cb.get(Calendar.DAY_OF_YEAR);
    }

    private void refresh() {
        List<AppState.SaleRecord> filtered = getFilteredSales();

        double todaySum = allSales.stream()
                .filter(s -> {
                    try {
                        return sameDay(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(s.timestamp()), new Date());
                    } catch (Exception e) { return false; }
                })
                .mapToDouble(AppState.SaleRecord::total)
                .sum();
        double cashSum = filtered.stream().filter(s -> "cash".equals(s.paymentMethod())).mapToDouble(AppState.SaleRecord::total).sum();
        double cardSum = filtered.stream().filter(s -> "card".equals(s.paymentMethod())).mapToDouble(AppState.SaleRecord::total).sum();

        todayTotalLabel.setText(formatMoney(BigDecimal.valueOf(todaySum)));
        cashTotalLabel.setText(formatMoney(BigDecimal.valueOf(cashSum)));
        cardTotalLabel.setText(formatMoney(BigDecimal.valueOf(cardSum)));

        salesTableView.getItems().clear();
        SimpleDateFormat dtFmt = new SimpleDateFormat("MMM d, yyyy HH:mm");
        for (AppState.SaleRecord s : filtered) {
            String dtStr = s.timestamp();
            try {
                dtStr = dtFmt.format(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(s.timestamp()));
            } catch (Exception ignored) {}
            salesTableView.getItems().add(new SaleRow(
                    dtStr, s.productName(), String.valueOf(s.quantity()),
                    formatMoney(BigDecimal.valueOf(s.total())), s.paymentMethod().toUpperCase()
            ));
        }

        updateFilterButtons();
    }

    private void updateFilterButtons() {
        for (Button b : List.of(filterAllBtn, filterTodayBtn, filterWeekBtn, filterMonthBtn)) {
            b.getStyleClass().remove("active");
        }
        switch (currentFilter) {
            case "all" -> filterAllBtn.getStyleClass().add("active");
            case "today" -> filterTodayBtn.getStyleClass().add("active");
            case "week" -> filterWeekBtn.getStyleClass().add("active");
            case "month" -> filterMonthBtn.getStyleClass().add("active");
        }
    }

    @FXML private void filterAll() { currentFilter = "all"; refresh(); }
    @FXML private void filterToday() { currentFilter = "today"; refresh(); }
    @FXML private void filterWeek() { currentFilter = "week"; refresh(); }
    @FXML private void filterMonth() { currentFilter = "month"; refresh(); }

    private static String formatMoney(BigDecimal amount) {
        if (amount == null) {
            return "—";
        }
        long wholePart = amount.longValue();
        return String.format("%,d", wholePart).replace(",", ".");
    }

    @FXML
    private void goBack() {
        try {
            AppNavigator.showCashier();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
