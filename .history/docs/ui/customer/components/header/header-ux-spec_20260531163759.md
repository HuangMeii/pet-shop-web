# Header Implementation & UX Plan

---

## 🎯 1. Mục tiêu hệ thống
Thiết kế header cho hệ thống ecommerce (pet shop) với các mục tiêu:

- Điều hướng chính rõ ràng
- Tìm kiếm sản phẩm / ảnh / text
- Hỗ trợ wishlist, cart, notification
- Phân quyền user & admin
- UX tối ưu cho desktop + mobile

---

## 🎨 2. Design System

### Primary Color
- Green (chủ đạo thương hiệu)

### Accent Color
- Orange (chỉ dùng cho badge, CTA, highlight)

### Background
- White / light gray

### Lưu ý quan trọng
- Không dùng green + orange làm 2 màu chính ngang nhau
- Orange chỉ để nhấn

---

## 🧩 3. Header Layout Structure

---

## 📌 4. Component Breakdown

### 4.1 Left Section (Navigation)

- ☰ Hamburger menu
  - Open sidebar

- Sidebar menu:
  - Thú cưng
  - Sản phẩm
  - Dịch vụ

- 🏠 Trang chủ
  - Active route highlight

---

### 4.2 Center Section (Search System)

- Search input field
- Dropdown chọn loại tìm kiếm:
  - Image
  - Text

#### UX rules:
- Enter → search
- Debounce 300ms
- Clear button (✕)
- Suggestion dropdown

---

### 4.3 Right Section (Actions)

#### ❤️ Wishlist
- Save/remove items
- Page wishlist riêng

---

#### 🛍️ Store
- Redirect page all products
- Filter inside:
  - Thú cưng
  - Sản phẩm
  - Dịch vụ

---

#### 🔔 Notification
- Badge số lượng
- Dropdown preview:
  - Order updates
  - System alerts

---

#### 🛒 Cart
- Badge số lượng sản phẩm
- Mini cart dropdown:
  - Preview items
  - Total price
  - Checkout button

---

### 4.4 Auth Section

#### 👤 User Account
- Nếu chưa login → redirect Login
- Nếu login → dropdown:
  - Profile
  - Orders
  - Settings
  - Logout

---

#### 🔐 Admin Login
- Icon riêng (lock)
- Route: `/admin/login`
- Không trộn với user system

---

## 📱 5. Responsive UX

### Desktop
- Full layout

### Tablet
- Icons only (hide labels)
- Compact search bar

### Mobile
- ☰ mở full sidebar
- Search → full screen overlay
- Cart → bottom sheet
- Notification → full screen panel

---

## ⚙️ 6. UX Rules & Behavior

### Navigation
- Active route highlight rõ ràng
- Smooth hover effects

---

### Search UX
- Debounce 300ms
- Suggestion dropdown
- Support image/text toggle
- Recent search history

---

### Cart UX
- Always visible badge
- Hover preview mini cart
- Quick checkout button

---

### Wishlist UX
- Toggle heart icon (fill/unfill)
- Sync realtime state

---

### Notification UX
- Badge animation (pulse nhẹ)
- Group notifications by type

---

### Auth UX
- Guest → show Login CTA
- User → avatar dropdown
- Admin → separate entry point

---

## 🚀 7. UX Prioritization

### High priority
- Search system
- Cart
- Navigation clarity

### Medium priority
- Wishlist
- Notification dropdown

### Low priority
- Admin entry UX polish

---

## 🧠 8. Key UX Principles

- Reduce clicks to checkout
- Keep search always visible
- Mobile-first interaction
- Clear separation user vs admin
- Minimal visual noise

---

## 📌 9. Future improvements (optional)

- Voice search
- AI search suggestion
- Recently viewed products
- Smart cart recommendation