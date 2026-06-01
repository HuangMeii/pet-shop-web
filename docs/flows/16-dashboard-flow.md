# Luồng 16: Dashboard & Thống kê (Dashboard & Statistics)

## 1. Tổng quan

Dashboard cung cấp cái nhìn tổng quan về hoạt động kinh doanh cho quản trị viên. Hệ thống thống kê bao gồm doanh thu, đơn hàng, khách hàng, sản phẩm bán chạy, và cảnh báo tồn kho.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **ADMIN** | Quản trị viên - xem tất cả thống kê |

## 3. Luồng xử lý chi tiết

### 3.1. Dashboard tổng quan

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/dashboard --->|                                |
   |   /stats                  |                                |
   |                           |                                |
   |                           |--- 1. Đếm totalOrders -------->|
   |                           |    invoiceRepository.count()   |
   |                           |                                |
   |                           |--- 2. Tính totalRevenue ------>|
   |                           |    Sum of all realAmount       |
   |                           |                                |
   |                           |--- 3. Đếm newCustomers ------->|
   |                           |    customerRepository.count()  |
   |                           |                                |
   |                           |--- 4. Đếm totalProducts ------>|
   |                           |    productRepository.count()   |
   |                           |                                |
   |                           |--- 5. getRevenueTrend() -------|
   |                           |    7 ngày gần nhất             |
   |                           |                                |
   |                           |--- 6. getOrderStatusDist() ----|
   |                           |    Group by status             |
   |                           |                                |
   |                           |--- 7. getProductTypeDist() ----|
   |                           |    Product vs Pet count        |
   |                           |                                |
   |                           |--- 8. getNewVsReturning() -----|
   |                           |    Khách mới vs quay lại       |
   |                           |                                |
   |                           |--- 9. getTopItems("PET") ------|
   |                           |    Top 5 pet bán chạy          |
   |                           |                                |
   |                           |--- 10. getTopItems("PRODUCT") -|
   |                           |    Top 5 product bán chạy      |
   |                           |                                |
   |                           |--- 11. getLowStockAlerts() ----|
   |                           |    Sản phẩm tồn < 5            |
   |                           |                                |
   |<-- DashboardStatsResponse |                                |
```

**Backend:**
- **Controller:** `DashboardController.java`
- **Service:** `DashboardService.java`
- **Method:** `getStats()`

#### Chi tiết các phương thức thống kê:

**Revenue Trend (7 ngày gần nhất)**
```java
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
            .date(date).revenue(dayRevenue).orderCount(dayInvoices.size())
            .build());
    }
    return trend;
}
```

**Order Status Distribution**
```java
private Map<String, Long> getOrderStatusDistribution() {
    return allInvoices.stream()
        .map(inv -> inv.getStatus() != null ? inv.getStatus().name() : "UNKNOWN")
        .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
}
```

**New vs Returning Customers**
```java
private NewVsReturningCustomers getNewVsReturningCustomers() {
    Map<UUID, Long> customerOrderCount = allInvoices.stream()
        .filter(inv -> inv.getCustomer() != null && inv.getCustomer().getId() != null)
        .collect(Collectors.groupingBy(inv -> inv.getCustomer().getId(), Collectors.counting()));

    long newCust = customerOrderCount.values().stream().filter(c -> c == 1).count();
    long returningCust = customerOrderCount.size() - newCust;
    // Tính phần trăm
}
```

**Top Items (Top 5 bán chạy)**
```java
private List<TopItem> getTopItems(String type) {
    // Duyệt tất cả InvoiceDetails
    // Nếu type = "PRODUCT": nhóm theo product, tính totalSold + totalRevenue
    // Nếu type = "PET": nhóm theo pet, tính totalSold + totalRevenue
    // Sort theo totalSold giảm dần, lấy top 5
}
```

**Low Stock Alerts**
```java
private List<LowStockItem> getLowStockAlerts() {
    // Product: quantity < 5 && available = true
    // Pet: available = true && sold = false
}
```

### 3.2. Thống kê doanh thu (Revenue Statistics)

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/dashboard --->|                                |
   |   /revenue                |                                |
   |                           |--- Tính doanh thu theo tháng ->|
   |                           |--- Tính doanh thu theo ngày -->|
   |<-- RevenueStatsResponse --|                                |
```

### 3.3. Thống kê đánh giá (Review Statistics)

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/reviews ---->|                                |
   |   /admin/statistics       |                                |
   |                           |                                |
   |                           |--- getMonthlyTrend() ----------|
   |                           |   Group by year-month          |
   |                           |   Tính reviewCount + avgRating |
   |                           |                                |
   |                           |--- getSentimentByRating() -----|
   |                           |   Với mỗi rating 1-5:          |
   |                           |   Tính positive/neutral/negative|
   |                           |                                |
   |                           |--- getSentimentMonthlyTrend() -|
   |                           |   Group by year-month          |
   |                           |   Tính positive/neutral/negative|
   |                           |                                |
   |<-- ReviewStatisticsResponse                                |
```

## 4. Cấu trúc dữ liệu Response

### DashboardStatsResponse
```json
{
  "totalOrders": 150,
  "totalRevenue": 50000000,
  "newCustomers": 80,
  "totalProducts": 200,
  "revenueTrend": [
    {"date": "2026-05-25", "revenue": 5000000, "orderCount": 10},
    {"date": "2026-05-26", "revenue": 7000000, "orderCount": 15}
  ],
  "orderStatusDistribution": {
    "PAID": 120,
    "PENDING": 20,
    "CANCELLED": 10
  },
  "productTypeDistribution": {
    "PRODUCT": 300,
    "PET": 50
  },
  "newVsReturning": {
    "newCustomers": 60,
    "returningCustomers": 20,
    "newPercent": 75.0,
    "returningPercent": 25.0
  },
  "topPets": [
    {"id": "...", "name": "Golden Retriever", "totalSold": 5, "totalRevenue": 25000000}
  ],
  "topProducts": [
    {"id": "...", "name": "Hạt Royal Canin", "totalSold": 50, "totalRevenue": 15000000}
  ],
  "lowStockAlerts": [
    {"id": "...", "name": "Pate Whiskas", "currentStock": 2, "type": "PRODUCT"}
  ]
}
```

## 5. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/dashboard/stats` | Dashboard tổng quan | ADMIN |
| GET | `/api/dashboard/revenue` | Thống kê doanh thu | ADMIN |
| GET | `/api/reviews/admin/statistics` | Thống kê đánh giá | ADMIN |
| GET | `/api/reviews/admin/sentiment-stats` | Thống kê sentiment | ADMIN |

## 6. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `AdminDashBoard.tsx` | Trang Dashboard chính - hiển thị tất cả thống kê |
| `RevenueStatisticsPage.tsx` | Trang thống kê doanh thu chi tiết |
| `ReviewStatisticsPage.tsx` | Trang thống kê đánh giá |
| `dashboardService.ts` | Service gọi API dashboard |
| `AdminSideBar.tsx` | Sidebar điều hướng admin |
