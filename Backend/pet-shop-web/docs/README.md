# HappyPetShop - Tổng quan hệ thống

## Giới thiệu

HappyPetShop là một ứng dụng thương mại điện tử chuyên về thú cưng và sản phẩm cho thú cưng. Hệ thống được xây dựng theo kiến trúc microservices với frontend React và backend Spring Boot, tích hợp nhiều dịch vụ AI như gợi ý sản phẩm, tìm kiếm bằng hình ảnh, và kiểm duyệt nội dung.

## Công nghệ sử dụng

### Frontend
- **React 18** với TypeScript
- **React Router DOM** cho định tuyến
- **Tailwind CSS** cho styling
- **Vite** cho build tool

### Backend (Main Server)
- **Java 17** với Spring Boot 3.x
- **Spring Security** + JWT (OAuth2 Resource Server)
- **Spring Data JPA** + Hibernate
- **PostgreSQL** làm database chính
- **Redis** cho caching
- **Flyway** cho migration database
- **WebSocket** cho chat real-time

### External Services
- **Recommendation Server** (FastAPI/Python) - Gợi ý sản phẩm bằng ALS + Content-based
- **Image Search Server** (FastAPI/Python) - Tìm kiếm bằng hình ảnh qua CLIP model
- **Payment Backend** (Node.js/Express) - Thanh toán qua PayOS

## Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │ User App │  │Admin App │  │   Cashier Screen (HTML)  │  │
│  └────┬─────┘  └────┬─────┘  └──────────────────────────┘  │
│       │              │                                      │
└───────┼──────────────┼──────────────────────────────────────┘
        │              │
        ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (Spring Boot - port 8080)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │ Product  │  │ Invoice  │  │  Chat    │   │
│  │ Controller│  │Controller│  │Controller│  │Controller│   │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤   │
│  │  Staff   │  │Customer  │  │ Purchase │  │Promotion │   │
│  │ Controller│  │Controller│  │Controller│  │Controller│   │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤   │
│  │  Review  │  │Dashboard │  │ Category │  │ Supplier │   │
│  │ Controller│  │Controller│  │Controller│  │Controller│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                           │                                 │
│              ┌────────────┴────────────┐                   │
│              ▼                         ▼                   │
│        ┌──────────┐             ┌──────────┐              │
│        │PostgreSQL│             │  Redis   │              │
│        └──────────┘             └──────────┘              │
└─────────────────────────────────────────────────────────────┘
        │              │              │
        ▼              ▼              ▼
┌──────────┐  ┌──────────────┐  ┌──────────────┐
│PayOS     │  │Recommendation│  │Image Search  │
│Payment   │  │Server        │  │Server        │
│(Node.js) │  │(FastAPI)     │  │(FastAPI)     │
└──────────┘  └──────────────┘  └──────────────┘
```

## Danh sách các luồng chức năng

| # | Luồng | Mô tả | Vai trò |
|---|-------|-------|---------|
| 1 | [Xác thực & Phân quyền](./flows/01-authentication-flow.md) | Đăng nhập, đăng ký, logout, refresh token | USER, STAFF, ADMIN |
| 2 | [Duyệt sản phẩm & Thú cưng](./flows/02-product-browsing-flow.md) | Xem danh sách, phân trang, lọc, chi tiết | USER |
| 3 | [Giỏ hàng & Thanh toán](./flows/03-cart-checkout-flow.md) | Thêm/xoá sản phẩm, tạo hoá đơn, thanh toán | USER |
| 4 | [Quản lý đơn hàng](./flows/04-order-management-flow.md) | Xem, cập nhật trạng thái đơn hàng | STAFF, ADMIN |
| 5 | [Đánh giá sản phẩm](./flows/05-review-flow.md) | Tạo đánh giá, AI moderation, sentiment, thống kê | USER, ADMIN |
| 6 | [Chat hỗ trợ](./flows/06-chat-support-flow.md) | Chat real-time giữa khách hàng và nhân viên | USER, STAFF |
| 7 | [Nhập hàng & Quản lý kho](./flows/07-purchase-stock-flow.md) | Tạo phiếu nhập, quản lý tồn kho | STAFF, ADMIN |
| 8 | [Khuyến mãi](./flows/08-promotion-flow.md) | Tạo/xoá chương trình khuyến mãi | ADMIN |
| 9 | [Quản lý nhân viên](./flows/09-staff-management-flow.md) | CRUD nhân viên, phân ca | ADMIN |
| 10 | [Quản lý khách hàng](./flows/10-customer-management-flow.md) | Xem danh sách, thêm điểm | ADMIN |
| 11 | [Quản lý nhà cung cấp](./flows/11-supplier-management-flow.md) | CRUD nhà cung cấp | ADMIN |
| 12 | [Quản lý danh mục](./flows/12-category-management-flow.md) | CRUD danh mục sản phẩm | ADMIN |
| 13 | [Gợi ý sản phẩm (AI)](./flows/13-recommendation-flow.md) | Gợi ý dựa trên ALS + Content-based | USER |
| 14 | [Tìm kiếm hình ảnh (AI)](./flows/14-image-search-flow.md) | Tìm sản phẩm bằng hình ảnh CLIP | USER |
| 15 | [Thanh toán PayOS](./flows/15-payment-flow.md) | Tạo link thanh toán, kiểm tra, huỷ | USER |
| 16 | [Dashboard & Thống kê](./flows/16-dashboard-flow.md) | Thống kê doanh thu, đánh giá | ADMIN |
| 17 | [Quản lý dịch vụ](./flows/17-service-management-flow.md) | CRUD dịch vụ | ADMIN, USER |

## Cấu trúc thư mục

```
happypetshop/
├── my-app/                          # Frontend React
│   └── src/
│       ├── components/              # Components dùng chung
│       ├── config/                  # Cấu hình API
│       ├── context/                 # React Context (Auth)
│       ├── layouts/                 # Layouts (User, Admin)
│       ├── pages/
│       │   ├── user/               # Pages cho người dùng
│       │   └── admin/              # Pages cho admin
│       ├── services/               # API services
│       ├── types/                  # TypeScript types
│       └── utils/                  # Utilities
├── server/happy-pet-shop/          # Backend Spring Boot
│   └── src/main/java/com/funcoders/happy_pet_shop/
│       ├── configuration/          # Config (Security, WebSocket, Redis...)
│       ├── constant/               # Constants (Role, Status...)
│       ├── controller/             # REST Controllers
│       ├── dto/                    # Request/Response DTOs
│       ├── entity/                 # JPA Entities
│       ├── exception/              # Exception handling
│       ├── mapper/                 # MapStruct mappers
│       ├── repository/             # JPA Repositories
│       ├── service/                # Business logic
│       └── validation/             # Custom validators
├── recommendation-server/          # AI Recommendation (FastAPI)
├── image-search/                   # AI Image Search (FastAPI)
├── payment_backend/                # Payment (Node.js/Express)
└── happy-cashier-screen/           # Cashier screen (Spring Boot)
```
