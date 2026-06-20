# Luồng 15: Thanh toán PayOS (Payment)

## 1. Tổng quan

Luồng thanh toán tích hợp với PayOS để tạo link thanh toán online. Hệ thống sử dụng một backend riêng (Node.js/Express) để xử lý các giao dịch thanh toán qua PayOS API.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **USER** | Khách hàng - thanh toán đơn hàng |
| **PayOS** | Cổng thanh toán bên thứ ba |

## 3. Kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              paymentService.ts                            │   │
│  │  - createPaymentLink()                                   │   │
│  │  - getPaymentStatus()                                    │   │
│  │  - cancelPayment()                                       │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Payment Backend (Node.js/Express - port 3000)       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              payment.controller.js                        │   │
│  │  - POST /api/payment/create                              │   │
│  │  - GET /api/payment/status/:orderId                      │   │
│  │  - POST /api/payment/cancel/:orderId                     │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │      PayOS API          │
              │  - Tạo link thanh toán  │
              │  - Kiểm tra trạng thái  │
              │  - Huỷ thanh toán      │
              └─────────────────────────┘
```

## 4. Luồng xử lý chi tiết

### 4.1. Tạo link thanh toán

```
[Client]                    [Payment Backend]                   [PayOS]
   |                           |                                  |
   |--- POST /api/payment ---->|                                  |
   |   /create                 |                                  |
   |   {amount, description,   |                                  |
   |    orderId, items[]}      |                                  |
   |                           |                                  |
   |                           |--- POST /v2/payment-requests -->|
   |                           |   {orderCode, amount,            |
   |                           |    description, items,           |
   |                           |    returnUrl, cancelUrl}         |
   |                           |                                  |
   |                           |<-- {orderCode, checkoutUrl,      |
   |                           |     qrCode} ---------------------|
   |                           |                                  |
   |<-- {orderCode, checkoutUrl,                                  |
   |     qrCode} --------------|                                  |
   |                           |                                  |
   |--- Redirect to checkoutUrl                                   |
   |   (PayOS payment page)                                       |
```

**Backend (Payment Backend - Node.js):**
- **Controller:** `payment.controller.js`
- **Method:** `createPaymentLink`
- **Xử lý:**
  1. Nhận request từ frontend
  2. Gọi PayOS API để tạo payment request
  3. Trả về checkoutUrl cho frontend
  4. Frontend redirect user đến trang thanh toán PayOS

### 4.2. Kiểm tra trạng thái thanh toán

```
[Client]                    [Payment Backend]                   [PayOS]
   |                           |                                  |
   |--- GET /api/payment ----->|                                  |
   |   /status/{orderId}       |                                  |
   |                           |--- GET /v2/payment-requests ---->|
   |                           |   /{orderId}/status              |
   |                           |                                  |
   |                           |<-- {status} ---------------------|
   |<-- {status} --------------|                                  |
```

### 4.3. Huỷ thanh toán

```
[Client]                    [Payment Backend]                   [PayOS]
   |                           |                                  |
   |--- POST /api/payment ---->|                                  |
   |   /cancel/{orderId}       |                                  |
   |                           |--- POST /v2/payment-requests --->|
   |                           |   /{orderId}/cancel              |
   |                           |                                  |
   |                           |<-- {success} --------------------|
   |<-- {success} -------------|                                  |
```

## 5. API Endpoints (Payment Backend)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/payment/create` | Tạo link thanh toán PayOS |
| GET | `/api/payment/status/:orderId` | Kiểm tra trạng thái |
| POST | `/api/payment/cancel/:orderId` | Huỷ thanh toán |

## 6. Frontend Service

```typescript
// paymentService.ts
export interface CreatePaymentLinkRequest {
  amount: number;
  description?: string;
  orderId?: string;
  items?: { name: string; quantity: number; price: number }[];
}

export interface PaymentLinkResponse {
  orderCode: string;
  checkoutUrl: string;
  qrCode?: string;
  status?: string;
}

export const createPaymentLink = async (
  request: CreatePaymentLinkRequest
): Promise<PaymentLinkResponse> => {
  const res = await axios.post<PaymentLinkResponse>(
    `${PAYMENT_BASE_URL}/create`, request
  );
  return res.data;
};

export const getPaymentStatus = async (
  orderId: string
): Promise<{ status: string }> => {
  const res = await axios.get<{ status: string }>(
    `${PAYMENT_BASE_URL}/status/${orderId}`
  );
  return res.data;
};

export const cancelPayment = async (orderId: string): Promise<unknown> => {
  const res = await axios.post(`${PAYMENT_BASE_URL}/cancel/${orderId}`);
  return res.data;
};
```

## 7. Luồng thanh toán hoàn chỉnh

```
1. User thêm sản phẩm vào giỏ hàng
2. User vào CartPage → ReviewPage
3. User chọn "Thanh toán online"
4. Frontend gọi createPaymentLink() → nhận checkoutUrl
5. Frontend redirect user đến trang PayOS
6. User thanh toán trên PayOS
7. PayOS redirect về returnUrl (frontend)
8. Frontend gọi getPaymentStatus() để kiểm tra
9. Nếu thành công → cập nhật trạng thái hoá đơn
```

## 8. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `CartPage.tsx` | Giỏ hàng - nút thanh toán |
| `ReviewPage.tsx` | Xem lại đơn hàng trước khi thanh toán |
| `PaidInvoicesPage.tsx` | Lịch sử hoá đơn đã thanh toán |
| `paymentService.ts` | Service gọi API thanh toán |
