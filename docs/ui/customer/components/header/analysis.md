# Header Design Specification

## 🎯 Mục tiêu
Thiết kế header cho hệ thống bán hàng (pet shop / ecommerce) với khả năng:
- Điều hướng chính
- Tìm kiếm sản phẩm/ảnh theo user chọn
- Hỗ trợ wishlist, cart, auth
- Phân quyền user & admin

---

## 🎨 Màu sắc
- Primary: Xanh lá (green) + trắng nhẹ
- Accent: Cam (chỉ dùng highlight / badge / CTA)
- Background: Trắng hoặc trắng xám nhẹ
- Lưu ý: Không dùng đồng thời cam + xanh lá làm chủ đạo ngang nhau

---

## 🧩 Cấu trúc Header

### 1. Menu (Left)
- ☰ Icon 3 gạch ngang
  - Mở sidebar
  - Sidebar chứa danh mục:
    - Thú cưng
    - Sản phẩm
    - Dịch vụ

- 🏠 Trang chủ

---

### 2. Search (Center)
- Thanh tìm kiếm
- Cho phép chọn loại tìm kiếm:
  - Ảnh
  - Text

---

### 3. Navigation (Right Group 1)
- ❤️ Danh sách yêu thích (Wishlist)
- 🛍️ Cửa hàng
  - Trang tổng
  - Filter:
    - Thú cưng
    - Sản phẩm
    - Dịch vụ
- 🔔 Thông báo
  - Badge số lượng thông báo

- 🛒 Giỏ hàng
  - Badge số lượng sản phẩm

---

### 4. User / Auth (Right Group 2)
- 👤 Tài khoản user
  - Nếu CHƯA đăng nhập → chuyển trang Login
  - Nếu ĐÃ đăng nhập → menu profile

- 🔐 Admin login (icon khóa)
  - Truy cập trang admin login