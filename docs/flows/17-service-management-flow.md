# Luồng 17: Quản lý dịch vụ (Service Management)

## 1. Tổng quan

Luồng quản lý dịch vụ cho phép quản trị viên quản lý các dịch vụ thú cưng (tắm, cắt tỉa lông, khám sức khỏe, etc.) và khách hàng có thể đặt lịch dịch vụ.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **USER** | Khách hàng - xem và đặt lịch dịch vụ |
| **ADMIN** | Quản trị viên - CRUD dịch vụ |

## 3. Luồng xử lý chi tiết

### 3.1. Xem danh sách dịch vụ

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /services -------->|                                |
   |                           |--- FindAll ------------------>|
   |<-- ServiceResponse[] -----|                                |
```

### 3.2. Đặt lịch dịch vụ

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /services ------->|                                |
   |   /bookings               |                                |
   |   {serviceId, customerId, |                                |
   |    petId, appointmentDate,|                                |
   |    notes}                 |                                |
   |                           |--- Tạo ServiceBooking -------->|
   |<-- BookingResponse -------|                                |
```

## 4. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/services` | Lấy danh sách dịch vụ | PUBLIC |
| GET | `/services/{id}` | Lấy chi tiết dịch vụ | PUBLIC |
| POST | `/services` | Tạo dịch vụ mới | ADMIN |
| PUT | `/services/{id}` | Cập nhật dịch vụ | ADMIN |
| DELETE | `/services/{id}` | Xoá dịch vụ | ADMIN |
| POST | `/services/bookings` | Đặt lịch dịch vụ | USER |

## 5. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `ServicesPage.tsx` | Trang danh sách dịch vụ cho khách hàng |
| `ServiceManagementPage.tsx` | Trang quản lý dịch vụ cho admin |
