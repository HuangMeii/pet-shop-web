# Luồng 10: Quản lý khách hàng (Customer Management)

## 1. Tổng quan

Luồng quản lý khách hàng cho phép quản trị viên xem danh sách khách hàng và quản lý điểm thưởng (loyalty points).

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **ADMIN** | Quản trị viên - xem danh sách, quản lý điểm |

## 3. Luồng xử lý chi tiết

### 3.1. Xem danh sách khách hàng

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /customers ------->|                                |
   |                           |--- FindAll ------------------>|
   |<-- CustomerResponse[] ----|                                |
```

### 3.2. Thêm điểm thưởng

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- PUT /customers ------->|                                |
   |   /{id}/loyalty-points    |                                |
   |   {points}                |                                |
   |                           |--- Cập nhật loyaltyPoints ---->|
   |<-- CustomerResponse ------|                                |
```

## 4. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/customers` | Lấy danh sách khách hàng | ADMIN |
| GET | `/customers/{id}` | Lấy chi tiết khách hàng | ADMIN |
| PUT | `/customers/{id}/loyalty-points` | Cập nhật điểm thưởng | ADMIN |

## 5. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `CustomerPage.tsx` | Trang quản lý khách hàng |
