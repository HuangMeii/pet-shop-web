# Luồng quản lý nhà cung cấp (Supplier Management Flow)

## 1. Mô tả chức năng

Cho phép admin CRUD nhà cung cấp.

## 2. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/admin/SupplierPage/SupplierPage.tsx` | Trang quản lý nhà cung cấp |

### Backend
| File | Mô tả |
|------|-------|
| `controller/SupplierController.java` | REST controller supplier |
| `service/SupplierService.java` | Business logic supplier |
| `entity/Supplier.java` | Entity nhà cung cấp |

## 3. API Endpoints

```
GET /suppliers                          # Lấy tất cả nhà cung cấp
GET /suppliers/{id}                     # Lấy nhà cung cấp theo ID
POST /suppliers                         # Tạo nhà cung cấp mới
PUT /suppliers/{id}                     # Cập nhật nhà cung cấp
DELETE /suppliers/{id}                  # Xoá nhà cung cấp
```
