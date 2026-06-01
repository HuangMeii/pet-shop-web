# Luồng 8: Khuyến mãi (Promotion)

## 1. Tổng quan

Luồng khuyến mãi cho phép quản trị viên tạo các chương trình khuyến mãi áp dụng cho sản phẩm. Hỗ trợ hai loại giảm giá: phần trăm (%) và cố định (FIXED).

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **ADMIN** | Quản trị viên - CRUD khuyến mãi |

## 3. Luồng xử lý chi tiết

### 3.1. Tạo khuyến mãi

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /promotions ----->|                                |
   |   {name, description,     |                                |
   |    discountType,          |                                |
   |    discountValue,         |                                |
   |    maxDiscountValue,      |                                |
   |    startDate, endDate,    |                                |
   |    productIds[]}          |                                |
   |                           |                                |
   |                           |--- 1. Tạo Promotion ---------->|
   |                           |--- 2. Tạo PromotionDetails --->|
   |                           |    Cho mỗi productId           |
   |                           |                                |
   |<-- PromotionResponse -----|                                |
```

**Backend:**
- **Controller:** `PromotionController.java`
- **Service:** `PromotionService.java`
- **Xử lý:**
  1. Tạo `Promotion` với thông tin khuyến mãi
  2. Với mỗi `productId`, tạo `PromotionDetail` liên kết
  3. Lưu và trả về response

### 3.2. Xoá khuyến mãi

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- DELETE /promotions --->|                                |
   |   /{id}                   |                                |
   |                           |--- Xoá PromotionDetails ------>|
   |                           |--- Xoá Promotion ------------->|
   |<-- Success ----------------|                                |
```

## 4. Cấu trúc dữ liệu

### Promotion Entity
```
Promotion {
    id: UUID (PK)
    name: String
    description: String
    discountType: DiscountType (PERCENT, FIXED)
    discountValue: BigDecimal
    maxDiscountValue: BigDecimal (nullable - chỉ cho PERCENT)
    startDate: LocalDate
    endDate: LocalDate
    promotionDetails: Set<PromotionDetail>
}
```

### PromotionDetail Entity
```
PromotionDetail {
    id: UUID (PK)
    promotion: Promotion (N-1)
    product: Product (N-1)
}
```

## 5. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/promotions` | Tạo khuyến mãi mới | ADMIN |
| GET | `/promotions` | Lấy danh sách khuyến mãi | ADMIN |
| GET | `/promotions/{id}` | Lấy chi tiết khuyến mãi | ADMIN |
| DELETE | `/promotions/{id}` | Xoá khuyến mãi | ADMIN |

## 6. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `PromotionManagementPage.tsx` | Trang quản lý khuyến mãi |
| `AddPromotionPage.tsx` | Trang tạo khuyến mãi mới |
