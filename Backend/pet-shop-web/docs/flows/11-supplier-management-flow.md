# Luồng 11: Quản lý nhà cung cấp (Supplier Management)

## 1. Tổng quan

Luồng quản lý nhà cung cấp cho phép quản trị viên thực hiện các thao tác CRUD với nhà cung cấp.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **ADMIN** | Quản trị viên - CRUD nhà cung cấp |

## 3. Luồng xử lý chi tiết

### 3.1. Tạo nhà cung cấp mới

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /suppliers ------>|                                |
   |   {name, address,         |                                |
   |    phone, email}          |                                |
   |                           |--- Tạo Supplier -------------->|
   |<-- SupplierResponse ------|                                |
```

### 3.2. Xem danh sách nhà cung cấp

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /suppliers ------->|                                |
   |                           |--- FindAll ------------------>|
   |<-- SupplierResponse[] ----|                                |
```

## 4. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/suppliers` | Lấy danh sách nhà cung cấp | ADMIN |
| GET | `/suppliers/{id}` | Lấy chi tiết nhà cung cấp | ADMIN |
| POST | `/suppliers` | Tạo nhà cung cấp mới | ADMIN |
| PUT | `/suppliers/{id}` | Cập nhật nhà cung cấp | ADMIN |
| DELETE | `/suppliers/{id}` | Xoá nhà cung cấp | ADMIN |

## 5. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `SupplierPage.tsx` | Trang quản lý nhà cung cấp |
