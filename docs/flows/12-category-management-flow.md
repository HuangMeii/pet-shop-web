# Luồng 12: Quản lý danh mục (Category Management)

## 1. Tổng quan

Luồng quản lý danh mục cho phép quản trị viên thực hiện các thao tác CRUD với danh mục sản phẩm.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **ADMIN** | Quản trị viên - CRUD danh mục |

## 3. Luồng xử lý chi tiết

### 3.1. Tạo danh mục mới

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /categories ----->|                                |
   |   {name, description}     |                                |
   |                           |--- Tạo Category -------------->|
   |<-- CategoryResponse ------|                                |
```

### 3.2. Xem danh sách danh mục

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /categories ------>|                                |
   |                           |--- FindAll ------------------>|
   |<-- CategoryResponse[] ----|                                |
```

## 4. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/categories` | Lấy danh sách danh mục | ADMIN |
| GET | `/categories/{id}` | Lấy chi tiết danh mục | ADMIN |
| POST | `/categories` | Tạo danh mục mới | ADMIN |
| PUT | `/categories/{id}` | Cập nhật danh mục | ADMIN |
| DELETE | `/categories/{id}` | Xoá danh mục | ADMIN |

## 5. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `CategoryPage.tsx` | Trang quản lý danh mục |
