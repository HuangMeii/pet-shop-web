# Luồng 3: Giỏ hàng & Thanh toán (Cart & Checkout)

## 1. Tổng quan

Luồng giỏ hàng và thanh toán cho phép khách hàng thêm sản phẩm vào giỏ, quản lý số lượng, và tiến hành tạo hoá đơn. Hệ thống hỗ trợ thanh toán online qua PayOS và thanh toán khi nhận hàng (COD).

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **USER** | Khách hàng - thao tác giỏ hàng, tạo hoá đơn |
| **STAFF** | Nhân viên thu ngân - tạo hoá đơn tại quầy (Cashier Screen) |

## 3. Luồng xử lý chi tiết

### 3.1. Xem / Tạo giỏ hàng

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /cart/{customerId} |                                |
   |   hoặc                    |                                |
   |--- POST /cart/{customerId}|                                |
   |                           |--- Tìm Cart theo CustomerId -->|
   |                           |--- Nếu không có → tạo mới ----->|
   |                           |                                |
   |<-- CartResponse ----------|                                |
```

**Backend:**
- **Controller:** `CartController.java`
- **Service:** `CartService.java`
- **Method:** `getOrCreateCart(UUID customerId)`
- **Xử lý:**
  1. Tìm `Cart` theo `customerId`
  2. Nếu chưa có → tạo mới `Cart` với `customer` tương ứng
  3. Trả về `CartResponse` (danh sách `CartItem`)

### 3.2. Thêm / Cập nhật sản phẩm trong giỏ

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /cart/{customerId}|                                |
   |   {productId, quantity}   |                                |
   |                           |--- Tìm Cart ------------------>|
   |                           |--- Tìm Product --------------->|
   |                           |--- Kiểm tra item đã tồn tại ---|
   |                           |   ├── Có → cập nhật quantity   |
   |                           |   └── Không → thêm mới         |
   |                           |--- Save Cart ----------------->|
   |<-- CartResponse ----------|                                |
```

**Backend:**
- **Service:** `CartService.java`
- **Method:** `addProduct(UUID customerId, CartRequest request)`
- **Xử lý:**
  1. Tìm `Cart` theo `customerId`
  2. Tìm `Product` theo `productId`
  3. Kiểm tra item đã tồn tại trong giỏ chưa:
     - Nếu `quantity == 0` → xoá item khỏi giỏ
     - Nếu đã tồn tại → cập nhật `quantity`
     - Nếu chưa → tạo `CartItem` mới
  4. Lưu và trả về `CartResponse`

### 3.3. Tạo hoá đơn (Checkout)

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /invoices ------->|                                |
   |   {customerId,            |                                |
   |    paymentMethod,         |                                |
   |    shippingAddress,       |                                |
   |    invoiceDetails: [      |                                |
   |      {productId, quantity}|                                |
   |      {petId}              |                                |
   |    ]}                     |                                |
   |                           |                                |
   |                           |--- 1. Tìm Customer ----------->|
   |                           |--- 2. Tìm Staff (nếu có) ----->|
   |                           |--- 3. Load Products ---------->|
   |                           |--- 4. Load Promotions --------->|
   |                           |--- 5. Tạo InvoiceDetails ------|
   |                           |       ├── Product: check stock |
   |                           |       │   ├── Giảm quantity    |
   |                           |       │   └── Áp dụng KM nếu có|
   |                           |       └── Pet: markAsSold()    |
   |                           |--- 6. Tính totalAmount --------|
   |                           |--- 7. Tính realAmount ---------|
   |                           |--- 8. Save Invoice ----------->|
   |                           |--- 9. Xoá items khỏi Cart ---->|
   |                           |                                |
   |<-- InvoiceResponse -------|                                |
```

**Backend:**
- **Controller:** `InvoiceController.java`
- **Service:** `InvoiceService.java`
- **Method:** `createInvoice(InvoiceCreationRequest request)`
- **Xử lý chi tiết:**

#### Bước 1: Tìm Customer
```java
Customer customer = customerRepository.findById(request.getCustomerId())
    .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));
```

#### Bước 2: Tìm Staff (nếu có - cho thanh toán tại quầy)
```java
Staff staff = null;
if (request.getStaffId() != null) {
    staff = staffRepository.findById(request.getStaffId())
        .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));
}
```

#### Bước 3: Load Products
```java
Set<UUID> productIds = request.getInvoiceDetails().stream()
    .map(InvoiceDetailCreationRequest::getProductId)
    .filter(Objects::nonNull)
    .collect(Collectors.toSet());
List<Product> products = productRepository.findAllById(productIds);
Map<UUID, Product> productMap = products.stream()
    .collect(Collectors.toMap(Product::getId, p -> p));
```

#### Bước 4: Load Promotions đang hoạt động
```java
List<PromotionDetail> promotionDetails =
    promotionDetailRepository.findActivePromotionDetails(productIds, LocalDate.now());
// Chọn khuyến mãi tốt nhất cho mỗi sản phẩm
Map<UUID, PromotionDetail> bestPromotionByProduct = promotionDetails.stream()
    .collect(Collectors.toMap(
        pd -> pd.getProduct().getId(),
        pd -> pd,
        (pd1, pd2) -> {
            BigDecimal d1 = calculateDiscountAmount(pd1, pd1.getProduct().getPrice());
            BigDecimal d2 = calculateDiscountAmount(pd2, pd2.getProduct().getPrice());
            return d1.compareTo(d2) >= 0 ? pd1 : pd2;
        }
    ));
```

#### Bước 5: Xử lý từng InvoiceDetail
- **Product:** Kiểm tra available + quantity, giảm stock, áp dụng promotion
- **Pet:** Kiểm tra available, gọi `pet.markAsSold()`

#### Bước 6-7: Tính toán
```java
totalAmount = totalAmount.add(lineTotal);  // Tổng tiền hàng
realAmount = realAmount.add(lineTotal.subtract(discount));  // Tổng sau giảm giá
```

#### Bước 9: Xoá items khỏi Cart
```java
cartService.removeCartItems(request.getCustomerId(), productIds);
```

### 3.4. Tính Discount (Khuyến mãi)

```java
private BigDecimal calculateDiscountAmount(PromotionDetail promotionDetail, BigDecimal productPrice) {
    if (promotionDetail.getPromotion().getDiscountType() == DiscountType.PERCENT) {
        BigDecimal percentDiscount = productPrice
            .multiply(promotionDetail.getPromotion().getDiscountValue())
            .divide(BigDecimal.valueOf(100));
        if (promotionDetail.getPromotion().getMaxDiscountValue() != null) {
            return percentDiscount.min(promotionDetail.getPromotion().getMaxDiscountValue());
        }
        return percentDiscount;
    }
    // FIXED: Giảm giá cố định
    return promotionDetail.getPromotion().getDiscountValue();
}
```

## 4. Cấu trúc dữ liệu

### Cart Entity
```
Cart {
    id: UUID (PK)
    customer: Customer (1-1)
    cartItems: Set<CartItem>
}
```

### CartItem Entity
```
CartItem {
    id: UUID (PK)
    cart: Cart (N-1)
    product: Product (N-1)
    quantity: Integer
}
```

### Invoice Entity
```
Invoice {
    id: UUID (PK)
    customer: Customer (N-1)
    staff: Staff (N-1, nullable)
    paymentMethod: String
    shippingAddress: String
    totalAmount: BigDecimal
    realAmount: BigDecimal
    status: PaymentStatus (PENDING, PAID, CANCELLED, REFUNDED)
    invoiceDetails: Set<InvoiceDetail>
    createdAt: LocalDateTime
}
```

### InvoiceDetail Entity
```
InvoiceDetail {
    id: UUID (PK)
    invoice: Invoice (N-1)
    product: Product (N-1, nullable)
    pet: Pet (N-1, nullable)
    quantity: Integer
    unitPrice: BigDecimal
    totalPrice: BigDecimal
    discountAmount: BigDecimal
    promotionDetail: PromotionDetail (N-1, nullable)
}
```

## 5. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/cart/{customerId}` | Lấy giỏ hàng | USER |
| POST | `/cart/{customerId}` | Thêm/Cập nhật sản phẩm | USER |
| POST | `/invoices` | Tạo hoá đơn mới | USER/STAFF |
| GET | `/invoices` | Lấy tất cả hoá đơn | ADMIN |
| GET | `/invoices/{id}` | Lấy chi tiết hoá đơn | USER/STAFF |
| GET | `/invoices/customer/{id}` | Lấy hoá đơn theo khách hàng | USER |
| GET | `/invoices/staff/{id}` | Lấy hoá đơn theo nhân viên | STAFF |
| PUT | `/invoices/{id}/status` | Cập nhật trạng thái | ADMIN |
| DELETE | `/invoices/{id}` | Xoá hoá đơn | ADMIN |

## 6. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `CartPage.tsx` | Trang giỏ hàng - hiển thị danh sách sản phẩm, tổng tiền |
| `ReviewPage.tsx` | Trang xem lại đơn hàng trước khi thanh toán |
| `PaidInvoicesPage.tsx` | Lịch sử hoá đơn đã thanh toán |
| `InvoiceDetailPage.tsx` | Chi tiết hoá đơn |

## 7. Cashier Screen (Tại quầy)

Hệ thống có một module riêng `happy-cashier-screen/` (Spring Boot) dành cho nhân viên thu ngân tại quầy, cho phép:
- Tạo hoá đơn tại quầy (có staffId)
- Quét sản phẩm
- Xem lịch sử bán hàng
