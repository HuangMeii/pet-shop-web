# Luồng quản lý khách hàng (Customer Management Flow)

## 1. Mô tả chức năng

Cho phép admin xem danh sách khách hàng, quản lý điểm tích luỹ.

## 2. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/admin/CustomerPage/CustomerPage.tsx` | Trang quản lý khách hàng |

### Backend
| File | Mô tả |
|------|-------|
| `controller/CustomerController.java` | REST controller customer |
| `service/CustomerService.java` | Business logic customer |
| `entity/Customer.java` | Entity khách hàng |

## 3. API Endpoints

```
GET /customers                          # Lấy tất cả khách hàng
GET /customers/{id}                     # Lấy khách hàng theo ID
PUT /customers/{id}                     # Cập nhật thông tin
POST /customers/{id}/points            # Thêm điểm tích luỹ
```

## 4. Luồng xử lý

1. Admin vào trang `/admin/customers`
2. Xem danh sách khách hàng (gọi `GET /customers`)
3. Xem chi tiết: lịch sử mua hàng, điểm tích luỹ
4. Có thể thêm điểm tích luỹ cho khách hàng
