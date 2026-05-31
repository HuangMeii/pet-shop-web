# Happy Pet Shop 🐾

Hệ thống quản lý cửa hàng thú cưng với backend Spring Boot, frontend React và cashier screen.

---

## 📋 Yêu cầu hệ thống

| Công cụ | Phiên bản | Ghi chú |
|---------|-----------|---------|
| **Docker** & **Docker Compose** | Latest | Chạy PostgreSQL + Redis + Backend |
| **Node.js** | >= 18 | Chạy Frontend React |
| **Java** | 21 | Chạy Backend / Cashier Screen |
| **Maven** | >= 3.9 | Build Backend / Cashier Screen |

---

## 📁 Cấu trúc project

```
happypetshop/
├── server/happy-pet-shop/       # Backend Spring Boot (API)
│   ├── compose.yaml             # Docker Compose (PostgreSQL + Redis + App)
│   ├── Dockerfile               # Build Docker cho Backend
│   ├── pom.xml                  # Maven dependencies (có Flyway)
│   └── src/main/resources/
│       ├── application.yaml     # Cấu hình Spring (Flyway, JPA, Redis...)
│       └── db/migration/
│           ├── V1__create_tables.sql   # Flyway: tạo bảng
│           └── V2__seed_data.sql       # Flyway: dữ liệu mẫu
│
├── my-app/                      # Frontend React (Vite + TypeScript)
│
├── happy-cashier-screen/        # Cashier Screen (Spring Boot)
│
└── export_202605100827.sql      # Dữ liệu export từ DB cũ
```

---

## 🚀 Cách chạy

### 1. Backend + Database (Docker)

Chạy toàn bộ backend, PostgreSQL và Redis chỉ với **1 lệnh**:

```bash
cd server/happy-pet-shop
docker compose up --build
```

Khi chạy, Flyway sẽ tự động:
1. ✅ Tạo tất cả bảng (V1__create_tables.sql)
2. ✅ Import dữ liệu mẫu (V2__seed_data.sql)
3. ✅ Spring Boot JPA chỉ validate schema

**Các service được khởi động:**

| Service | Container name | Port |
|---------|---------------|------|
| PostgreSQL 16 | `happy-pet-shop-db` | 5432 |
| Redis 7 | `happy-pet-shop-redis` | 6379 |
| Spring Boot App | `happy-pet-shop` | 8080 |

> ⚠️ **Lần đầu chạy** sẽ mất thời gian để Maven download dependencies và build Docker image.

### 2. Frontend React (Terminal riêng)

```bash
cd my-app
npm install
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### 3. Cashier Screen (Terminal riêng)

Cashier Screen là ứng dụng **JavaFX** (không phải Spring Boot), chạy bằng lệnh:

```powershell
cd happy-cashier-screen
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.11"
.\mvnw.cmd clean javafx:run
```

> ⚠️ Nếu bạn đã set `JAVA_HOME` trong biến môi trường hệ thống thì không cần dòng `$env:JAVA_HOME = ...`
>
> 💡 Để set `JAVA_HOME` vĩnh viễn: System Properties → Environment Variables → New → `JAVA_HOME` = `C:\Program Files\Java\jdk-21.0.11`

---

## 🔗 API Endpoints

Sau khi backend chạy, API có thể truy cập tại:

- **Swagger UI:** http://localhost:8080/happy-pet-shop/swagger-ui.html
- **Base URL:** http://localhost:8080/happy-pet-shop

---

## 👤 Tài khoản mặc định

| Vai trò | Username | Password (mã hóa BCrypt) |
|---------|----------|------------------------|
| **Admin** | `admin` | `$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu` |
| **Staff** | `0901234567` | `$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu` |
| **Staff** | `0912345678` | `$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu` |
| **User** | `0901234565` | `$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu` |
| **User** | `0916114537` | `$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu` |

> 🔑 Tất cả tài khoản đều dùng chung password (hash giống nhau). Liên hệ admin để biết password gốc.

---

## 🗄️ Flyway Migration

Khi backend khởi động, Flyway tự động chạy các migration trong thư mục:

```
src/main/resources/db/migration/
├── V1__create_tables.sql    # Schema: 19 bảng
└── V2__seed_data.sql        # Dữ liệu: users, products, invoices...
```

**Các bảng đã tạo:**

| # | Bảng | Mô tả |
|---|------|-------|
| 1 | `roles` | Vai trò người dùng (USER, STAFF, ADMIN) |
| 2 | `users` | Người dùng |
| 3 | `user_roles` | Liên kết user ↔ role |
| 4 | `categories` | Danh mục sản phẩm |
| 5 | `products` | Sản phẩm |
| 6 | `pets` | Thú cưng |
| 7 | `customers` | Khách hàng |
| 8 | `staffs` | Nhân viên |
| 9 | `carts` | Giỏ hàng |
| 10 | `cart_items` | Chi tiết giỏ hàng |
| 11 | `promotions` | Khuyến mãi |
| 12 | `promotion_details` | Chi tiết khuyến mãi |
| 13 | `suppliers` | Nhà cung cấp |
| 14 | `purchases` | Phiếu nhập hàng |
| 15 | `purchase_details` | Chi tiết phiếu nhập |
| 16 | `invoices` | Hóa đơn |
| 17 | `invoice_details` | Chi tiết hóa đơn |
| 18 | `invalidated_token` | Token đã thu hồi |
| 19 | `messages` | Tin nhắn |

---

## 🐳 Docker Commands hữu ích

```bash
# Khởi động tất cả
docker compose up --build

# Khởi động ở chế độ nền (detached)
docker compose up --build -d

# Xem log
docker compose logs -f

# Dừng và xóa container
docker compose down

# Dừng và xóa cả volume (xóa luôn dữ liệu DB)
docker compose down -v

# Xem trạng thái
docker compose ps
```

---

## ⚙️ Biến môi trường

| Biến | Mô tả | Giá trị mặc định |
|------|-------|-----------------|
| `SPRING_DATASOURCE_URL` | JDBC URL cho PostgreSQL | `jdbc:postgresql://postgres:5432/happy_pet_shop` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `root` |
| `SPRING_REDIS_HOST` | Redis host | `redis` |
| `SPRING_REDIS_PORT` | Redis port | `6379` |
| `JWT_KEY` | Secret key cho JWT | (đã cấu hình sẵn) |
| `GOOGLE_CLIENT_ID` | Google OAuth2 Client ID | (cần cấu hình) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 Client Secret | (cần cấu hình) |

---

## ❌ Troubleshooting

**1. Port 5432 đã được sử dụng?**
→ Dừng PostgreSQL local đang chạy, hoặc đổi port trong `compose.yaml`.

**2. Docker build quá chậm?**
→ Lần đầu sẽ chậm do download dependencies. Lần sau Docker sẽ cache lại.

**3. Lỗi kết nối DB?**
→ Kiểm tra container `happy-pet-shop-db` đã chạy chưa: `docker compose ps`

**4. Flyway báo lỗi migration?**
→ Nếu đã có bảng cũ, xóa volume: `docker compose down -v` rồi chạy lại.
