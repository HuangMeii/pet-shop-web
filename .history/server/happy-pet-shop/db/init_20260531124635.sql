-- ============================================================
-- Happy Pet Shop - Database Initialization Script
-- ============================================================

-- ==================== 1. ROLES ====================
CREATE TABLE IF NOT EXISTS roles (
    role_name VARCHAR(50) NOT NULL,
    description TEXT,
    PRIMARY KEY (role_name)
);

-- ==================== 2. USERS ====================
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(10) NOT NULL,
    address VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    delete_at TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==================== 3. USER_ROLES ====================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(role_name)
);

-- ==================== 4. CATEGORIES ====================
CREATE TABLE IF NOT EXISTS categories (
    id UUID NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_category_name ON categories(name);

-- ==================== 5. PRODUCTS ====================
CREATE TABLE IF NOT EXISTS products (
    id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    category_id UUID NOT NULL,
    brand VARCHAR(100),
    origin VARCHAR(100),
    unit VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    image_url VARCHAR(255),
    expiry_date DATE,
    available BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ==================== 6. PETS ====================
CREATE TABLE IF NOT EXISTS pets (
    id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    vaccinated BOOLEAN NOT NULL,
    image_url VARCHAR(500),
    available BOOLEAN NOT NULL,
    sold BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_pet_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pet_breed ON pets(breed);
CREATE INDEX IF NOT EXISTS idx_pet_available ON pets(available);
CREATE INDEX IF NOT EXISTS idx_pet_created_at ON pets(created_at);

-- ==================== 7. CUSTOMERS ====================
CREATE TABLE IF NOT EXISTS customers (
    id UUID NOT NULL,
    user_id UUID NOT NULL UNIQUE,
    points DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_user ON customers(user_id);

-- ==================== 8. STAFFS ====================
CREATE TABLE IF NOT EXISTS staffs (
    id UUID NOT NULL,
    user_id UUID NOT NULL UNIQUE,
    shift INTEGER NOT NULL CHECK (shift >= 1 AND shift <= 3),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_staff_user ON staffs(user_id);

-- ==================== 9. CARTS ====================
CREATE TABLE IF NOT EXISTS carts (
    id UUID NOT NULL,
    customer_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_cart_customer ON carts(customer_id);

-- ==================== 10. CART_ITEMS ====================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID NOT NULL,
    cart_id UUID NOT NULL,
    product_id UUID,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_cart_product ON cart_items(cart_id, product_id);

-- ==================== 11. PROMOTIONS ====================
CREATE TABLE IF NOT EXISTS promotions (
    id UUID NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(15,2) NOT NULL,
    max_discount_value DECIMAL(15,2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_promotion_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotion_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotion_date ON promotions(start_date, end_date);

-- ==================== 12. PROMOTION_DETAILS ====================
CREATE TABLE IF NOT EXISTS promotion_details (
    id UUID NOT NULL,
    promotion_id UUID NOT NULL,
    product_id UUID NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_promotion_product ON promotion_details(promotion_id, product_id);
CREATE INDEX IF NOT EXISTS idx_pd_promotion ON promotion_details(promotion_id);
CREATE INDEX IF NOT EXISTS idx_pd_product ON promotion_details(product_id);

-- ==================== 13. SUPPLIERS ====================
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE,
    address VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_supplier_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_supplier_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_supplier_phone ON suppliers(phone);

-- ==================== 14. PURCHASES ====================
CREATE TABLE IF NOT EXISTS purchases (
    id UUID NOT NULL,
    staff_id UUID NOT NULL,
    supplier_id UUID NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE INDEX IF NOT EXISTS idx_purchase_staff ON purchases(staff_id);
CREATE INDEX IF NOT EXISTS idx_purchase_supplier ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_created_at ON purchases(created_at);

-- ==================== 15. PURCHASE_DETAILS ====================
CREATE TABLE IF NOT EXISTS purchase_details (
    id UUID NOT NULL,
    purchase_id UUID NOT NULL,
    product_id UUID NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_purchase_product ON purchase_details(purchase_id, product_id);
CREATE INDEX IF NOT EXISTS idx_purchase_detail_purchase ON purchase_details(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_detail_product ON purchase_details(product_id);

-- ==================== 16. INVOICES ====================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID NOT NULL,
    staff_id UUID,
    customer_id UUID NOT NULL,
    shipping_address VARCHAR(255),
    total_amount DECIMAL(15,2) NOT NULL,
    real_amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_invoice_staff ON invoices(staff_id);
CREATE INDEX IF NOT EXISTS idx_invoice_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoice_created_at ON invoices(created_at);

-- ==================== 17. INVOICE_DETAILS ====================
CREATE TABLE IF NOT EXISTS invoice_details (
    id UUID NOT NULL,
    invoice_id UUID NOT NULL,
    product_id UUID,
    pet_id UUID UNIQUE,
    promotion_detail_id UUID,
    discount_amount DECIMAL(19,2),
    unit_price DECIMAL(19,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(19,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id),
    FOREIGN KEY (promotion_detail_id) REFERENCES promotion_details(id),
    CONSTRAINT chk_invoice_detail_item CHECK (
        (product_id IS NOT NULL AND pet_id IS NULL)
        OR
        (pet_id IS NOT NULL AND product_id IS NULL)
    )
);

-- ==================== 18. INVALIDATED_TOKEN ====================
CREATE TABLE IF NOT EXISTS invalidated_token (
    id VARCHAR(255) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

-- ==================== 19. MESSAGES ====================
CREATE TABLE IF NOT EXISTS messages (
    id UUID NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_message_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_message_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_message_created_at ON messages(created_at);

-- ============================================================
-- SEED DATA
-- ============================================================

-- ==================== ROLES ====================
INSERT INTO roles (role_name, description) VALUES
('USER', 'Customers'),
('STAFF', 'Staffs'),
('ADMIN', 'Administrator')
ON CONFLICT (role_name) DO NOTHING;

-- ==================== USERS ====================
INSERT INTO users (id, username, first_name, last_name, email, phone, address, status, password, created_at, updated_at, delete_at) VALUES
('028e57b3-aa0b-40d5-b3e1-76c81f850fb8', 'admin', NULL, NULL, NULL, '0911111111', NULL, 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-04 18:53:26.192806', '2026-03-04 18:53:26.192806', NULL),
('36b2d0fd-dfa8-4619-a993-67f2655cfd56', '0901234567', 'Nguyen', 'Test', 'nguyen.an@petshop.com', '0901234567', '123 Le Loi, District 1, Ho Chi Minh City', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-05 06:16:11.749093', '2026-03-09 01:17:55.898769', NULL),
('6998e255-c20a-4d4a-bc33-b4f2aefe738c', '0912345678', 'Tran', 'Minh', 'tran.minh@petshop.com', '0912345678', '45 Nguyen Hue, District 1, Ho Chi Minh City', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-05 06:23:12.21264', '2026-03-05 06:23:12.21264', NULL),
('c7da6b04-c5d9-4170-850d-ed34ae26a739', '0912345679', 'Tran', 'Minh', 'nhanvien@gmail.com', '0912345679', '45 Nguyen Hue, District 1, Ho Chi Minh City', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-05 06:24:32.411509', '2026-03-05 06:24:32.411509', NULL),
('492fcb82-efc7-485f-ab49-fb5d45d37734', '0901234565', 'Tran', 'Du', 'tranduc@example1.com', '0901234565', '25 Nguyen Trai, District 5, Ho Chi Minh City', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-05 06:28:03.209121', '2026-03-09 07:59:01.030687', NULL),
('a2052e0c-2a09-4b77-b1c8-28c16881db62', '0916114536', 'Dư', 'Trần', 'trandinhkhanhdu2005@gmail.com', '0916114536', '25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-09 00:20:23.204943', '2026-03-09 00:20:23.204943', NULL),
('1816c561-2de1-4421-b3d8-007af8023cb9', '0916114537', 'Tran', 'Test123', 'customer123@gmail.com', '0916114537', 'Ho Chi Minh city', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-09 01:24:48.412381', '2026-03-11 03:52:42.597466', NULL),
('8771f0ce-99d6-464c-8c02-0b48e99fc953', '0911111111', 'Du', 'Tran', 'string', '0911111111', 'trandinhkhanhdu2005@gmail.com', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-10 12:03:13.684661', '2026-03-10 12:03:13.684661', NULL),
('38fdcb1b-cd5a-40ad-841a-094df8b4eb47', '0161304968', 'Du', 'Tran', 'trandinhkhanhdu2000@gmail.com', '0161304968', 'string', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-10 12:15:38.703543', '2026-03-10 12:15:38.703543', NULL),
('357f6ad8-0555-446a-8ef3-282ae864d37e', '0161304961', 'Du', 'Tran', 'trandinhkhanhdu2001@gmail.com', '0161304961', 'string', 'ACTIVATED', '$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu', '2026-03-10 12:19:11.24909', '2026-03-10 12:19:11.24909', NULL),
('aca96a40-d02d-4296-877b-e660c2f2b69f', '0933333333', NULL, NULL, 'trandinhkhanhdu1@gmail.com', '0933333333', '25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh', 'ACTIVATED', '$2a$12$EnrVnD9bC7p0CtDeWUAIOuRLiMhroCjUORepmmd0jdIrbXlP0wUkC', '2026-03-21 22:58:06.657848', '2026-03-21 22:58:06.657848', NULL),
('baf5ae7d-7b2a-480a-8010-6225bb85f0b3', '0944444444', 'Dư', 'Trần', 'trandinhkhanhdu2@gmail.com', '0944444444', '25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh', 'ACTIVATED', '$2a$12$D0qbgWguH65b.sSTt.qhZug.shNUbfTzaJvONGMM2xlRYAC5Sh2O2', '2026-03-21 23:10:42.236273', '2026-03-21 23:10:42.236273', NULL),
('ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3', '0955555555', 'Staff', 'New', 'newstaff@gmail.com', '0955555555', 'New staff''s address', 'ACTIVATED', '$2a$12$EUSESCYJz4Bp5jQMAT/HzuVerSlbj8293WLbFiGnAuSdVUT4gLuGq', '2026-03-24 18:39:20.213681', '2026-03-24 18:39:20.213681', NULL),
('9ee96200-d65b-4b52-a70d-037c48958b60', '0999999999', 'Du', 'Tran', 'trandinhkhanhdu222@gmail.com', '0999999999', 'dia chi nhan vien', 'ACTIVATED', '$2a$12$IP.wYsr7a0ly5hrRqGAu8eKjF9uD4asi1iC.BslS4nETi5OWcho0.', '2026-03-27 00:57:45.751355', '2026-03-27 00:57:45.751355', NULL)
ON CONFLICT (id) DO NOTHING;

-- ==================== USER_ROLES ====================
INSERT INTO user_roles (user_id, role_id) VALUES
('028e57b3-aa0b-40d5-b3e1-76c81f850fb8', 'ADMIN'),
('36b2d0fd-dfa8-4619-a993-67f2655cfd56', 'STAFF'),
('6998e255-c20a-4d4a-bc33-b4f2aefe738c', 'STAFF'),
('c7da6b04-c5d9-4170-850d-ed34ae26a739', 'STAFF'),
('a2052e0c-2a09-4b77-b1c8-28c16881db62', 'STAFF'),
('492fcb82-efc7-485f-ab49-fb5d45d37734', 'USER'),
('1816c561-2de1-4421-b3d8-007af8023cb9', 'USER'),
('8771f0ce-99d6-464c-8c02-0b48e99fc953', 'USER'),
('38fdcb1b-cd5a-40ad-841a-094df8b4eb47', 'USER'),
('357f6ad8-0555-446a-8ef3-282ae864d37e', 'USER'),
('aca96a40-d02d-4296-877b-e660c2f2b69f', 'USER'),
('baf5ae7d-7b2a-480a-8010-6225bb85f0b3', 'USER'),
('ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3', 'USER'),
('ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3', 'STAFF'),
('9ee96200-d65b-4b52-a70d-037c48958b60', 'STAFF'),
('9ee96200-d65b-4b52-a70d-037c48958b60', 'USER')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- ==================== CATEGORIES ====================
INSERT INTO categories (id, name, description) VALUES
('8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'Food & Treats', 'Dry food, wet food, treats and supplements for pets'),
('5ac9671b-6fcb-49e0-93da-9951e15467e5', 'Toys', 'Toys and play items for dogs, cats and small animals'),
('350e8854-0d84-45aa-9aa0-4d1c4aa21964', 'Accessories', 'Collars, leashes, harnesses, bowls and travel gear'),
('60c77645-51ac-483a-9734-5d1c921ba397', 'Grooming', 'Shampoos, brushes, nail clippers and grooming kits'),
('8196e945-2a4f-427d-bb57-41e29164f376', 'Health & Wellness', 'Vitamins, flea & tick control, and health care products'),
('8853dc1f-fca0-44b4-98c5-3b72b958f3a5', 'Beds & Furniture', 'Pet beds, crates, carriers and furniture'),
('5206051c-a497-46ba-856a-a84f55963cfc', 'Litter & Hygiene', 'Litter, litter boxes, waste bags and cleaning supplies'),
('f4800e3a-3d23-4041-acaf-d72bc7f0f12a', 'Aquarium & Fish', 'Fish food, tanks, filters and aquarium supplies'),
('8ff07c2b-c18c-475c-985b-f6fa4b4967f6', 'testCategory', 'test')
ON CONFLICT (id) DO NOTHING;

-- ==================== PRODUCTS ====================
INSERT INTO products (id, name, description, price, category_id, brand, origin, unit, quantity, image_url, expiry_date, available, created_at, updated_at) VALUES
('c3aaf119-9794-4891-a80b-680cf14b658e', 'Royal Canin Mini Adult 2kg', 'Dry food for small breed adult dogs (1-10kg), supports digestion and coat health.', 285000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'Royal Canin', 'France', 'KG', 50, 'https://example.com/images/royal-canin-mini-adult-2kg.jpg', NULL, true, '2026-03-04 19:23:19.327568', NULL),
('29cb5511-7db7-43c5-8ae3-550f362c57f6', 'dien thoai cho cho', 'dien thoai cho cho', 200000.00, '5ac9671b-6fcb-49e0-93da-9951e15467e5', 'china', 'china', 'BOX', 11308, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774371478/lydci47lq2n3sudyjo4d.png', NULL, true, '2026-03-24 16:58:03.018043', '2026-03-27 09:22:56.564885'),
('96933adb-6487-4899-8872-da4e7cec6c05', 'Lavender Clumping Cat Litter 10L', 'Clumping cat litter with lavender scent, strong odor control.', 165000.00, '5206051c-a497-46ba-856a-a84f55963cfc', 'Catsan', 'Germany', 'KG', 123173, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1773047013/vfxxtauixyhmifv1vube.jpg', NULL, true, '2026-03-04 19:23:39.367907', '2026-03-27 09:22:56.565414'),
('0fee9909-5030-4653-89d9-ef00dcb62cec', 'Whiskas Adult Tuna 1.2kg', 'Dry food with tuna flavor for adult cats over 1 year old.', 135000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'Whiskas', 'Thailand', 'KG', 78, 'https://example.com/images/whiskas-tuna-1-2kg.jpg', NULL, true, '2026-03-04 19:23:27.089305', '2026-03-23 18:15:36.030239'),
('57752647-1d1f-4914-8bd4-12d994c09bb5', 'Royal Canin Mini Adult 2kg', 'Thức ăn hạt cao cấp dành cho chó trưởng thành giống nhỏ (1-10kg), hỗ trợ tiêu hóa và lông bóng mượt.', 285000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'Royal Canin', 'France', 'G', 283047, 'https://example.com/images/royal-canin-mini-adult-2kg.jpg', NULL, true, '2026-03-04 19:21:15.355216', '2026-03-27 09:22:56.565414'),
('0b231149-7ee5-441c-bd6c-be71c74f8a30', 'Test product', 'test', 111111.00, '5ac9671b-6fcb-49e0-93da-9951e15467e5', 'china', 'china', 'BOX', 109, 'https://goofytails.com/cdn/shop/collections/dog-toy.jpg?v=1678779839', NULL, true, '2026-03-08 08:01:31.307346', '2026-03-24 16:53:00.872574'),
('0efbf7b4-fe1b-4564-885e-25d05cdcfed8', 'Rubber Bone Dog Toy11', 'Durable rubber bone toy for medium and large dogs.', 75000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'PetFun', 'Vietnam', 'PHAN', 93, 'https://example.com/images/rubber-bone-toy.jpg', NULL, true, '2026-03-04 19:23:33.368042', '2026-05-08 04:09:41.868943')
ON CONFLICT (id) DO NOTHING;

-- ==================== PETS ====================
INSERT INTO pets (id, name, species, breed, birth, gender, price, vaccinated, image_url, available, sold, created_at, updated_at) VALUES
('761192c2-3c73-417f-8969-9e08adb308db', 'Milo', 'Dog', 'Poodle', '2023-08-12', 'Male', 4500000.00, true, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:27.614382', '2026-03-06 10:41:27.614382'),
('49fd5894-31fe-4065-a832-981c53a29150', 'Luna', 'Cat', 'British Shorthair', '2024-01-05', 'Female', 7000000.00, true, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:44.104497', '2026-03-06 10:41:44.104497'),
('51c3e164-40bc-4686-8495-962b2c9072a7', 'Snowy', 'Rabbit', 'Mini Lop', '2024-06-18', 'Female', 900000.00, false, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:51.886186', '2026-03-06 10:41:51.886186'),
('268597cc-5fd4-47f3-a540-57768b482bc5', 'Nemo', 'Fish', 'Clownfish', '2025-03-10', 'Male', 150000.00, false, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:55.97797', '2026-03-06 10:41:55.97797'),
('fafbeff5-28cf-472b-bea5-e0693845a281', 'Cookie', 'Hamster', 'Syrian Hamster', '2025-07-21', 'Male', 120000.00, false, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:42:00.442633', '2026-03-06 10:42:00.442633'),
('f14c6692-9787-4721-824f-b066ce46b22c', 'Nguyen Hai Dang', 'Humanity', 'Asia', '2005-07-11', 'Đực', 12000.00, true, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-23 18:20:39.453841', '2026-03-23 18:29:21.276573')
ON CONFLICT (id) DO NOTHING;

-- ==================== CUSTOMERS ====================
INSERT INTO customers (id, user_id, points) VALUES
('ba5df993-5e43-4c10-9faf-6c0b63f1ead2', '492fcb82-efc7-485f-ab49-fb5d45d37734', 0.00),
('0cf0c9a3-3410-492a-802c-4efe708fd478', '1816c561-2de1-4421-b3d8-007af8023cb9', 6.00),
('7a449c4f-3251-4282-974d-8ea2e0cce313', '8771f0ce-99d6-464c-8c02-0b48e99fc953', 0.00),
('5c61e765-bbb3-4860-ac4b-c3a0cd672d95', '38fdcb1b-cd5a-40ad-841a-094df8b4eb47', 0.00),
('f1abd538-90a4-4774-8aca-494de63f132c', '357f6ad8-0555-446a-8ef3-282ae864d37e', 0.00),
('3cda06e7-1055-4da2-9864-5c392bee3c4c', 'aca96a40-d02d-4296-877b-e660c2f2b69f', 0.00),
('9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b', 'baf5ae7d-7b2a-480a-8010-6225bb85f0b3', 0.00),
('62b0466e-1623-4b8e-ba4f-ea01f33e477b', 'ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3', 0.00),
('9454a904-6fb5-4298-9f12-8eb6e9740c1a', '9ee96200-d65b-4b52-a70d-037c48958b60', 0.00)
ON CONFLICT (id) DO NOTHING;

-- ==================== STAFFS