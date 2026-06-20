# Luồng 7: Nhập hàng & Quản lý kho (Purchase & Stock)

## 1. Tổng quan

Luồng nhập hàng cho phép nhân viên/quản trị viên tạo phiếu nhập hàng từ nhà cung cấp, quản lý số lượng tồn kho của sản phẩm.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **STAFF** | Nhân viên - tạo phiếu nhập, xem lịch sử nhập hàng |
| **ADMIN** | Quản trị viên - toàn quyền quản lý nhập hàng |

## 3. Luồng xử lý chi tiết

### 3.1. Tạo phiếu nhập hàng

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /purchases ------>|                                |
   |   {supplierId, staffId,   |                                |
   |    purchaseDetails: [     |                                |
   |      {productId, quantity,|                                |
   |       unitPrice}          |                                |
   |    ]}                     |                                |
   |                           |                                |
   |                           |--- 1. Tìm Supplier ----------->|
   |                           |--- 2. Tìm Staff -------------->|
   |                           |--- 3. Tạo Purchase ----------->|
   |                           |--- 4. Tạo PurchaseDetails ---->|
   |                           |       ├── Tìm Product          |
   |                           |       └── Cập nhật quantity    |
   |                           |           (tăng stock)         |
   |                           |--- 5. Save Purchase ---------->|
   |<-- PurchaseResponse ------|                                |
```

**Backend:**
- **Controller:** `PurchaseController.java`
- **Service:** `PurchaseService.java`
- **Xử lý:**
  1. Kiểm tra supplier và staff tồn tại
  2. Tạo `Purchase` với tổng tiền
  3. Với mỗi `PurchaseDetail`:
     - Tìm `Product`
     - Cập nhật `quantity` (tăng stock)
     - Tính `totalPrice = quantity * unitPrice`
  4. Lưu và trả về response

### 3.2. Xem danh sách phiếu nhập

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /purchases ------->|                                |
   |                           |--- FindAll order by createdAt->|
   |<-- PurchaseResponse[] ----|                                |
```

## 4. Cấu trúc dữ liệu

### Purchase Entity
```
Purchase {
    id: UUID (PK)
    supplier: Supplier (N-1)
    staff: Staff (N-1)
    totalAmount: BigDecimal
    purchaseDetails: Set<PurchaseDetail>
    createdAt: LocalDateTime
}
```

### PurchaseDetail Entity
```
PurchaseDetail {
    id: UUID (PK)
    purchase: Purchase (N-1)
    product: Product (N-1)
    quantity: Integer
    unitPrice: BigDecimal
    totalPrice: BigDecimal
}
```

## 5. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/purchases` | Tạo phiếu nhập hàng | STAFF/ADMIN |
| GET | `/purchases` | Lấy danh sách phiếu nhập | STAFF/ADMIN |
| GET | `/purchases/{id}` | Lấy chi tiết phiếu nhập | STAFF/ADMIN |

## 6. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `PurchasePage.tsx` | Trang danh sách phiếu nhập |
| `AddPurchasePage.tsx` | Trang tạo phiếu nhập mới |
