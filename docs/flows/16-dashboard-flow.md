# Luồng thống kê Dashboard (Dashboard Flow)

## 1. Mô tả chức năng

Hiển thị thống kê tổng quan cho admin: doanh thu, đơn hàng, sản phẩm, khách hàng mới, đánh giá gần đây.

## 2. Sơ đồ luồng

```mermaid
sequenceDiagram
    participant Admin as Quản trị viên
    participant UI as Admin Dashboard
    participant API as Backend API
    participant DB as Database
    
    Note over Admin,DB: === XEM DASHBOARD ===
    Admin->>UI: Vào /admin/dashboard
    UI->>API: GET /api/dashboard/stats
    API->>DB: Aggregate data
    DB-->>API: Dashboard data
    API-->>UI: DashboardStatsResponse
    UI-->>Admin: Hiển thị biểu đồ & thống kê
    
    Note over Admin,DB: === XEM THỐNG KÊ DOANH THU ===
    Admin->>UI: Vào /admin/revenueStatistics
    UI->>API: GET /api/dashboard/revenue?period=month
    API->>DB: Aggregate revenue by period
    DB-->>API: Revenue data
    API-->>UI: Revenue data
    UI-->>Admin: Biểu đồ doanh thu
```

## 3. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/admin/DashBoardPage/AdminDashBoard.tsx` | Trang dashboard |
| `src/pages/admin/RevenueStatisticsPage/RevenueStatisticsPage.tsx` | Thống kê doanh thu |
| `src/services/dashboardService.ts` | Service gọi API dashboard |

### Backend
| File | Mô tả |
|------|-------|
| `controller/DashboardController.java` | REST controller dashboard |
| `service/DashboardService.java` | Business logic dashboard |
| `dto/response/DashboardStatsResponse.java` | DTO dashboard stats |

## 4. API Endpoints

```
GET /api/dashboard/stats               # Thống kê tổng quan
GET /api/dashboard/revenue             # Thống kê doanh thu
GET /api/dashboard/revenue-by-date     # Doanh thu theo ngày
```

## 5. Dashboard Stats

```
DashboardStatsResponse:
- totalRevenue: Tổng doanh thu
- totalOrders: Tổng đơn hàng
- totalProducts: Tổng sản phẩm
- totalCustomers: Tổng khách hàng
- newCustomersThisMonth: Khách hàng mới trong tháng
- recentReviews: Đánh giá gần đây
- revenueByPeriod: Doanh thu theo kỳ
```
