# Luồng 9: Quản lý nhân viên (Staff Management)

## 1. Tổng quan

Luồng quản lý nhân viên cho phép quản trị viên thực hiện các thao tác CRUD với tài khoản nhân viên.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **ADMIN** | Quản trị viên - CRUD nhân viên |

## 3. Luồng xử lý chi tiết

### 3.1. Tạo nhân viên mới

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /staffs --------->|                                |
   |   {username, password,    |                                |
   |    firstName, lastName,   |                                |
   |    email, phone,          |                                |
   |    address, position,     |                                |
   |    salary, hireDate}      |                                |
   |                           |                                |
   |                           |--- 1. Tạo User (role=STAFF) -->|
   |                           |--- 2. Tạo Staff -------------->|
   |<-- StaffResponse ---------|                                |
```

### 3.2. Xem danh sách nhân viên

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /staffs ---------->|                                |
   |                           |--- FindAll ------------------>|
   |<-- StaffResponse[] -------|                                |
```

## 4. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/staffs` | Lấy danh sách nhân viên | ADMIN |
| GET | `/staffs/{id}` | Lấy chi tiết nhân viên | ADMIN |
| POST | `/staffs` | Tạo nhân viên mới | ADMIN |
| PUT | `/staffs/{id}` | Cập nhật nhân viên | ADMIN |
| DELETE | `/staffs/{id}` | Xoá nhân viên | ADMIN |

## 5. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `StaffPage.tsx` | Trang quản lý nhân viên |
