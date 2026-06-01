# Luồng quản lý dịch vụ (Service Management Flow)

## 1. Mô tả chức năng

Cho phép admin CRUD dịch vụ (service) và user xem danh sách dịch vụ.

## 2. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/user/ServicesPage/ServicesPage.tsx` | Trang xem dịch vụ (user) |
| `src/pages/admin/ServiceManagementPage/ServiceManagementPage.tsx` | Quản lý dịch vụ (admin) |

### Backend
| File | Mô tả |
|------|-------|
| `controller/ServiceController.java` | REST controller service |
| `service/ServiceService.java` | Business logic service |
| `entity/Service.java` | Entity dịch vụ |

## 3. API Endpoints

```
GET /services                           # Lấy tất cả dịch vụ
GET /services/{id}                      # Lấy dịch vụ theo ID
POST /services                          # Tạo dịch vụ mới
PUT /services/{id}                      # Cập nhật dịch vụ
DELETE /services/{id}                   # Xoá dịch vụ
```
