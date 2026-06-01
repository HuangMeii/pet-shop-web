# Luồng quản lý nhân viên (Staff Management Flow)

## 1. Mô tả chức năng

Cho phép admin CRUD nhân viên, phân ca làm việc.

## 2. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/admin/StaffPage/StaffPage.tsx` | Trang quản lý nhân viên |

### Backend
| File | Mô tả |
|------|-------|
| `controller/StaffController.java` | REST controller staff |
| `service/StaffService.java` | Business logic staff |
| `entity/Staff.java` | Entity nhân viên |

## 3. API Endpoints

```
GET /staffs                            # Lấy tất cả nhân viên
GET /staffs/{id}                       # Lấy nhân viên theo ID
POST /staffs                           # Tạo nhân viên mới
PUT /staffs/{id}                       # Cập nhật nhân viên
DELETE /staffs/{id}                    # Xoá nhân viên
```

## 4. Luồng xử lý

1. Admin vào trang `/admin/staffs`
2. Xem danh sách nhân viên (gọi `GET /staffs`)
3. Thêm nhân viên mới: nhập thông tin, chọn ca làm việc
4. Gọi `POST /staffs` → Backend tạo User + Staff
5. Có thể sửa/xoá thông tin nhân viên
