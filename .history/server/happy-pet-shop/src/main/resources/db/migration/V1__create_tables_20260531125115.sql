-- ============================================================
-- V1__create_tables.sql
-- Happy Pet Shop - Database Schema Version 1
-- ============================================================

-- 1. ROLES
CREATE TABLE roles (
    role_name VARCHAR(50) NOT NULL,
    description TEXT,
    PRIMARY KEY (role_name)
);

-- 2. USERS
CREATE TABLE users (
    id UUID NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
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

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 3. USER_ROLES (junction table)
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(role_name)
);

-- 4. CATEGORIES
CREATE TABLE categories (
    id UUID NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    PRIMARY KEY (id)
);

CREATE INDEX idx_category_name ON categories(name);

-- 5. PRODUCTS
CREATE TABLE products (
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

-- 6. PETS
CREATE TABLE pets (
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

CREATE INDEX idx_pet_species ON pets(species);
CREATE INDEX idx_pet_breed ON pets(breed);
CREATE INDEX idx_pet_available ON pets(available);
CREATE INDEX idx_pet_created_at ON pets(created_at);

-- 7. CUSTOMERS
CREATE TABLE customers (
    id UUID NOT NULL,
    user_id UUID NOT NULL UNIQUE,
    points DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_customer_user ON customers(user_id);

-- 8. STAFFS
CREATE TABLE staffs (
    id UUID NOT NULL,
    user_id UUID NOT NULL UNIQUE,
    shift INTEGER NOT NULL CHECK (shift >= 1 AND shift <= 3),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_staff_user ON staffs(user_id);

-- 9. CARTS
CREATE TABLE carts (
    id UUID NOT NULL,
    customer_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX idx_cart_customer ON carts(customer_id);

-- 10. CART_ITEMS
CREATE TABLE cart_items (
    id UUID NOT NULL,
    cart_id UUID NOT NULL,
    product_id UUID,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE UNIQUE INDEX uk_cart_product ON cart_items(cart_id, product_id);

-- 11. PROMOTIONS
CREATE TABLE promotions (
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

CREATE INDEX idx_promotion_code ON promotions(code);
CREATE INDEX idx_promotion_status ON promotions(status);
CREATE INDEX idx_promotion_date ON promotions(start_date, end_date);

-- 12. PROMOTION_DETAILS
CREATE TABLE promotion_details (
    id UUID NOT NULL,
    promotion_id UUID NOT NULL,
    product_id UUID NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE UNIQUE INDEX uk_promotion_product ON promotion_details(promotion_id, product_id);
CREATE INDEX idx_pd_promotion ON promotion_details(promotion_id);
CREATE INDEX idx_pd_product ON promotion_details(product_id);

-- 13. SUPPLIERS
CREATE TABLE suppliers (
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

CREATE INDEX idx_supplier_name ON suppliers(name);
CREATE INDEX idx_supplier_email ON suppliers(email);
CREATE INDEX idx_supplier_phone ON suppliers(phone);

-- 14. PURCHASES
CREATE TABLE purchases (
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

CREATE INDEX idx_purchase_staff ON purchases(staff_id);
CREATE INDEX idx_purchase_supplier ON purchases(supplier_id);
CREATE INDEX idx_purchase_created_at ON purchases(created_at);

-- 15. PURCHASE_DETAILS
CREATE TABLE purchase_details (
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

CREATE UNIQUE INDEX uk_purchase_product ON purchase_details(purchase_id, product_id);
CREATE INDEX idx_purchase_detail_purchase ON purchase_details(purchase_id);
CREATE INDEX idx_purchase_detail_product ON purchase_details(product_id);

-- 16. INVOICES
CREATE TABLE invoices (
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

CREATE INDEX idx_invoice_staff ON invoices(staff_id);
CREATE INDEX idx_invoice_customer ON invoices(customer_id);
CREATE INDEX idx_invoice_created_at ON invoices(created_at);

-- 17. INVOICE_DETAILS
CREATE TABLE invoice_details (
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

-- 18. INVALIDATED_TOKEN
CREATE TABLE invalidated_token (
    id VARCHAR(255) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

-- 19. MESSAGES
CREATE TABLE messages (
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

CREATE INDEX idx_message_sender ON messages(sender_id);
CREATE INDEX idx_message_receiver ON messages(receiver_id);
CREATE INDEX idx_message_created_at ON messages(created_at);
