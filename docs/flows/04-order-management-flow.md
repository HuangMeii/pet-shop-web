# Luồng quản lý đơn hàng (Order Management Flow)

## 1. Mô tả chức năng

Cho phép nhân viên/admin xem danh sách đơn hàng, cập nhật trạng thái đơn hàng (xác nhận, đang giao, đã giao, đã huỷ).

## 2. Sơ đồ luồng

```mermaid
sequenceDiagram
    participant Staff as Nhân viên
    participant UI as Admin Page
    participant Service as API Service
    participant API as Backend API
    participant DB as Database
    
    Note over Staff,DB: === XEM DANH SÁCH ĐƠN HÀNG ===
    Staff->>UI: Vào /admin/manageOrders
    UI->>Service: invoiceService.getAll()
    Service->>API: GET /invoices
    API->>DB: SELECT * FROM invoices
    DB-->>API: Danh sách hoá đơn
    API-->>Service: List<InvoiceResponse>
    Service-->>UI: Hiển thị bảng đơn hàng
    
    Note over Staff,DB: === CẬP NHẬT TRẠNG THÁI ===
    Staff->>UI: Chọn trạng thái mới
    UI->>Service: invoiceService.updateStatus(id, status)
    Service->>API: PUT /invoices/{id}
    API->>API: InvoiceService.updateInvoiceStatus()
    API->>DB: UPDATE invoices SET status = ?
    DB-->>API: Updated
    API-->>Service: InvoiceResponse
    Service-->>UI: Cập nhật UI
```

## 3. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/admin/ManageOrdersPage/ManageOrdersPage.tsx` | Trang quản lý đơn hàng |
| `src/pages/admin/ManageOrdersPage/useManageOrders.ts` | Hook xử lý |

### Backend
| File | Mô tả |
|------|-------|
| `controller/InvoiceController.java` | REST controller invoice |
| `service/InvoiceService.java` | Business logic invoice |
| `entity/Invoice.java` | Entity hoá đơn |
| `entity/InvoiceDetail.java` | Entity chi tiết hoá đơn |

## 4. API Endpoints

```
GET /invoices                          # Lấy tất cả hoá đơn
GET /invoices/{id}                     # Lấy chi tiết hoá đơn
PUT /invoices/{id}                     # Cập nhật trạng thái
DELETE /invoices/{id}                  # Xoá hoá đơn
```

## 5. Trạng thái hoá đơn

| Trạng thái | Mô tả |
|-----------|-------|
| PENDING | Chờ xác nhận |
| CONFIRMED | Đã xác nhận |
| SHIPPING | Đang giao hàng |
| DELIVERED | Đã giao hàng |
| CANCELLED | Đã huỷ |
| REFUNDED | Đã hoàn tiền |
