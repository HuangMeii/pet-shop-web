# Luồng 1: Xác thực & Phân quyền (Authentication & Authorization)

## 1. Tổng quan

Luồng xác thực và phân quyền quản lý việc đăng nhập, đăng ký, và kiểm soát truy cập trong hệ thống HappyPetShop. Hệ thống hỗ trợ đăng nhập bằng JWT (username/password) và OAuth2 (Google Login).

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **USER** | Khách hàng - có thể xem sản phẩm, mua hàng, chat |
| **STAFF** | Nhân viên - quản lý đơn hàng, nhập hàng, chat hỗ trợ |
| **ADMIN** | Quản trị viên - toàn quyền quản lý hệ thống |
| **Guest** | Chưa đăng nhập - chỉ xem được sản phẩm công khai |

## 3. Luồng xử lý chi tiết

### 3.1. Đăng ký (Register)

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /auth/register -->|                                |
   |   {username, password,    |                                |
   |    firstName, lastName,   |                                |
   |    email, phone,          |                                |
   |    address, gender,       |                                |
   |    dateOfBirth}           |                                |
   |                           |--- Kiểm tra username unique -->|
   |                           |--- Hash password (BCrypt) ---->|
   |                           |--- Tạo User + Customer ------->|
   |                           |                                |
   |<-- {token, authenticated, |                                |
   |     user info} -----------|                                |
```

**Backend:**
- **Controller:** `AuthController.java`
- **Service:** `AuthenticationService.java`
- **Method:** `register(RegisterRequest)`
- **Xử lý:**
  1. Kiểm tra username đã tồn tại chưa
  2. Mã hóa password bằng BCrypt (strength = 12)
  3. Tạo entity `User` với role mặc định là `USER`
  4. Tạo entity `Customer` liên kết với User
  5. Tạo JWT token và trả về

### 3.2. Đăng nhập (Login)

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- POST /auth/login ----->|                                |
   |   {username, password}    |                                |
   |                           |--- Tìm user theo username ---->|
   |                           |<-- User entity ----------------|
   |                           |--- Verify password (BCrypt) ---|
   |                           |--- Tạo JWT token --------------|
   |                           |--- Tạo Authentication object --|
   |<-- {token, authenticated, |                                |
   |     user info} -----------|                                |
```

**Backend:**
- **Controller:** `AuthController.java`
- **Service:** `AuthenticationService.java`
- **Method:** `authenticate(AuthRequest)`
- **Xử lý:**
  1. Tìm user theo username
  2. Verify password với BCryptPasswordEncoder
  3. Tạo JWT token với claims: username, roles
  4. Trả về token + thông tin user

### 3.3. Đăng nhập Google (OAuth2)

```
[Client]                    [Server]                    [Google OAuth]
   |                           |                             |
   |--- Redirect /oauth2/ -->  |--- Redirect to Google ----> |
   |                           |                             |
   |<-- Google Login Page -----|                             |
   |--- Login credentials ---->|                             |
   |                           |--- Verify token ----------> |
   |                           |<-- User info ---------------|
   |                           |--- Tìm/Create User ---------|
   |                           |--- Tạo JWT token -----------|
   |<-- Redirect với token ----|                             |
```

**Backend:**
- **Handler:** `OAuth2SuccessHandler.java`
- **Xử lý:**
  1. Nhận thông tin user từ Google (email, name, avatar)
  2. Tìm user trong DB theo email
  3. Nếu chưa tồn tại → tạo mới User + Customer
  4. Tạo JWT token
  5. Redirect về frontend với token trong URL

### 3.4. Xác thực Request (JWT Validation)

```
[Client]                    [Server]
   |                           |
   |--- Request + Bearer JWT ->|
   |                           |--- CustomJWTDecoder.decode() ---
   |                           |--- Verify signature ------------
   |                           |--- Extract claims (username, roles)
   |                           |--- Tạo JwtAuthenticationToken ---
   |                           |--- Kiểm tra authorities ---------
   |                           |--- Kiểm tra @PreAuthorize -------
   |<-- Response --------------|
```

**Backend:**
- **Config:** `SecurityConfig.java`
- **Decoder:** `CustomJWTDecoder.java`
- **Converter:** `JwtAuthenticationConverter` → chuyển roles thành authorities
- **Xử lý:**
  1. `CustomJWTDecoder` giải mã và verify JWT
  2. `JwtAuthenticationConverter` đọc roles từ claims
  3. `@PreAuthorize("hasAuthority('ROLE_ADMIN')")` kiểm tra quyền

### 3.5. Public Endpoints (Không cần xác thực)

```java
// Endpoints công khai (POST, GET đều được)
PUBLIC_ENDPOINTS = {
    "/swagger-ui.html", "/swagger-ui/**",
    "/v3/api-docs/**", "/v2/api-docs",
    "/oauth2/**", "/login/oauth2/**", "/user",
    "/ws/**",
    "/api/chat/**", "/api/staff/chat/**"
};

// Endpoints GET công khai
PUBLIC_GET_ENDPOINT = {
    "/products/**", "/categories/**",
    "/pets/**", "/api/reviews/**"
};
```

## 4. Cấu trúc dữ liệu

### User Entity
```
User {
    id: UUID (PK)
    username: String (unique)
    password: String (BCrypt hashed)
    firstName: String
    lastName: String
    email: String
    phone: String
    address: String
    gender: String
    dateOfBirth: LocalDate
    role: String (USER, STAFF, ADMIN)
    avatar: String
    provider: String (LOCAL, GOOGLE)
    providerId: String
}
```

### Customer Entity
```
Customer {
    id: UUID (PK)
    user: User (1-1)
    loyaltyPoints: Integer
}
```

### Staff Entity
```
Staff {
    id: UUID (PK)
    user: User (1-1)
    position: String
    salary: BigDecimal
    hireDate: LocalDate
}
```

## 5. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/auth/register` | Đăng ký tài khoản | Public |
| POST | `/auth/login` | Đăng nhập | Public |
| POST | `/auth/logout` | Đăng xuất | Authenticated |
| POST | `/auth/refresh` | Refresh token | Public |
| GET | `/oauth2/authorization/google` | Đăng nhập Google | Public |
| GET | `/login/oauth2/code/google` | Callback Google | Public |

## 6. Security Config

- **CSRF:** Disabled
- **CORS:** Cho phép tất cả origins, methods, headers
- **Password Encoder:** BCrypt (strength 12)
- **JWT:** OAuth2 Resource Server với custom decoder
- **Authentication Entry Point:** `CustomAuthenticationEntryPoint` (xử lý lỗi 401)
