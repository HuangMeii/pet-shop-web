-- ============================================================
-- V2__seed_data.sql
-- Happy Pet Shop - Seed Data
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
('9ee96200-d65b-4b52-a70d-037c48958b60', '0999999999', 'Du', 'Tran', 'trandinhkhanhdu222@gmail.com', '0999999999', 'dia chi nhan vien', 'ACTIVATED', '$2a$12$IP.wYsr7a0ly5hrRqGAu8eKjF9uD4asi1iC.BslS4nETi5OWcho0.', '2026-03-27 00:57:45.751355', '2026-03-27 00:57:45.751355', NULL);

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
('9ee96200-d65b-4b52-a70d-037c48958b60', 'USER');

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
('8ff07c2b-c18c-475c-985b-f6fa4b4967f6', 'testCategory', 'test');

-- ==================== PRODUCTS ====================
INSERT INTO products (id, name, description, price, category_id, brand, origin, unit, quantity, image_url, expiry_date, available, created_at, updated_at) VALUES
('c3aaf119-9794-4891-a80b-680cf14b658e', 'Royal Canin Mini Adult 2kg', 'Dry food for small breed adult dogs (1-10kg), supports digestion and coat health.', 285000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'Royal Canin', 'France', 'KG', 50, 'https://example.com/images/royal-canin-mini-adult-2kg.jpg', NULL, true, '2026-03-04 19:23:19.327568', NULL),
('29cb5511-7db7-43c5-8ae3-550f362c57f6', 'dien thoai cho cho', 'dien thoai cho cho', 200000.00, '5ac9671b-6fcb-49e0-93da-9951e15467e5', 'china', 'china', 'BOX', 11308, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774371478/lydci47lq2n3sudyjo4d.png', NULL, true, '2026-03-24 16:58:03.018043', '2026-03-27 09:22:56.564885'),
('96933adb-6487-4899-8872-da4e7cec6c05', 'Lavender Clumping Cat Litter 10L', 'Clumping cat litter with lavender scent, strong odor control.', 165000.00, '5206051c-a497-46ba-856a-a84f55963cfc', 'Catsan', 'Germany', 'KG', 123173, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1773047013/vfxxtauixyhmifv1vube.jpg', NULL, true, '2026-03-04 19:23:39.367907', '2026-03-27 09:22:56.565414'),
('0fee9909-5030-4653-89d9-ef00dcb62cec', 'Whiskas Adult Tuna 1.2kg', 'Dry food with tuna flavor for adult cats over 1 year old.', 135000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'Whiskas', 'Thailand', 'KG', 78, 'https://example.com/images/whiskas-tuna-1-2kg.jpg', NULL, true, '2026-03-04 19:23:27.089305', '2026-03-23 18:15:36.030239'),
('57752647-1d1f-4914-8bd4-12d994c09bb5', 'Royal Canin Mini Adult 2kg', 'Thức ăn hạt cao cấp dành cho chó trưởng thành giống nhỏ (1-10kg), hỗ trợ tiêu hóa và lông bóng mượt.', 285000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'Royal Canin', 'France', 'G', 283047, 'https://example.com/images/royal-canin-mini-adult-2kg.jpg', NULL, true, '2026-03-04 19:21:15.355216', '2026-03-27 09:22:56.565414'),
('0b231149-7ee5-441c-bd6c-be71c74f8a30', 'Test product', 'test', 111111.00, '5ac9671b-6fcb-49e0-93da-9951e15467e5', 'china', 'china', 'BOX', 109, 'https://goofytails.com/cdn/shop/collections/dog-toy.jpg?v=1678779839', NULL, true, '2026-03-08 08:01:31.307346', '2026-03-24 16:53:00.872574'),
('0efbf7b4-fe1b-4564-885e-25d05cdcfed8', 'Rubber Bone Dog Toy11', 'Durable rubber bone toy for medium and large dogs.', 75000.00, '8fa2381a-b84e-44e3-9fe0-a4b8377bd210', 'PetFun', 'Vietnam', 'PHAN', 93, 'https://example.com/images/rubber-bone-toy.jpg', NULL, true, '2026-03-04 19:23:33.368042', '2026-05-08 04:09:41.868943');

-- ==================== PETS ====================
INSERT INTO pets (id, name, species, breed, birth, gender, price, vaccinated, image_url, available, sold, created_at, updated_at) VALUES
('761192c2-3c73-417f-8969-9e08adb308db', 'Milo', 'Dog', 'Poodle', '2023-08-12', 'Male', 4500000.00, true, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:27.614382', '2026-03-06 10:41:27.614382'),
('49fd5894-31fe-4065-a832-981c53a29150', 'Luna', 'Cat', 'British Shorthair', '2024-01-05', 'Female', 7000000.00, true, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:44.104497', '2026-03-06 10:41:44.104497'),
('51c3e164-40bc-4686-8495-962b2c9072a7', 'Snowy', 'Rabbit', 'Mini Lop', '2024-06-18', 'Female', 900000.00, false, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:51.886186', '2026-03-06 10:41:51.886186'),
('268597cc-5fd4-47f3-a540-57768b482bc5', 'Nemo', 'Fish', 'Clownfish', '2025-03-10', 'Male', 150000.00, false, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:41:55.97797', '2026-03-06 10:41:55.97797'),
('fafbeff5-28cf-472b-bea5-e0693845a281', 'Cookie', 'Hamster', 'Syrian Hamster', '2025-07-21', 'Male', 120000.00, false, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-06 10:42:00.442633', '2026-03-06 10:42:00.442633'),
('f14c6692-9787-4721-824f-b066ce46b22c', 'Nguyen Hai Dang', 'Humanity', 'Asia', '2005-07-11', 'Đực', 12000.00, true, 'https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png', true, false, '2026-03-23 18:20:39.453841', '2026-03-23 18:29:21.276573');

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
('9454a904-6fb5-4298-9f12-8eb6e9740c1a', '9ee96200-d65b-4b52-a70d-037c48958b60', 0.00);

-- ==================== STAFFS ====================
INSERT INTO staffs (id, user_id, shift) VALUES
('cfdc91f6-83ae-4d67-89b0-2453e60f2c59', '36b2d0fd-dfa8-4619-a993-67f2655cfd56', 3),
('88045899-3d9f-453f-a185-0478ebe0a432', '6998e255-c20a-4d4a-bc33-b4f2aefe738c', 3),
('3dccc516-cf7b-4319-92c4-8f14abec427b', 'c7da6b04-c5d9-4170-850d-ed34ae26a739', 3),
('b6445ab3-970a-4dbe-ac64-487ed698b852', 'a2052e0c-2a09-4b77-b1c8-28c16881db62', 1),
('2de8aaff-b942-46c5-b9f2-81cb56fbb79c', 'ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3', 1),
('7bcc2326-d73d-467f-808c-0b2f05ed5b9b', '9ee96200-d65b-4b52-a70d-037c48958b60', 1);

-- ==================== CARTS ====================
INSERT INTO carts (id, customer_id, created_at, updated_at) VALUES
('97b495ca-130e-4786-a57a-a49d61be0c44', 'ba5df993-5e43-4c10-9faf-6c0b63f1ead2', '2026-03-05 06:28:03.209121', '2026-03-05 06:28:03.209121'),
('597f4718-1c87-4b39-914d-600a8e508512', '0cf0c9a3-3410-492a-802c-4efe708fd478', '2026-03-09 01:24:48.525024', '2026-03-09 01:24:48.525024'),
('1f9cf106-9ebd-4922-ac0c-d03383aecea0', '7a449c4f-3251-4282-974d-8ea2e0cce313', '2026-03-10 12:03:13.68584', '2026-03-10 12:03:13.68584'),
('e6ff76dd-9625-4ad4-b030-3c4b9870e73c', '5c61e765-bbb3-4860-ac4b-c3a0cd672d95', '2026-03-10 12:15:38.729196', '2026-03-10 12:15:38.729196'),
('51945365-297e-441b-8c30-2d99634d3aa4', 'f1abd538-90a4-4774-8aca-494de63f132c', '2026-03-10 12:19:11.24909', '2026-03-10 12:19:11.24909'),
('11dcb3d9-15f4-402c-ad7b-4e2142ad97b6', '3cda06e7-1055-4da2-9864-5c392bee3c4c', '2026-03-21 22:58:06.659866', '2026-03-21 22:58:06.659866'),
('ceecbd89-3fb4-43ec-946a-6c7b7745b39b', '9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b', '2026-03-21 23:10:42.236273', '2026-03-21 23:10:42.236273'),
('4bc4be2c-c851-4d4b-9278-387e4be893f2', '62b0466e-1623-4b8e-ba4f-ea01f33e477b', '2026-03-24 18:39:20.213681', '2026-03-24 18:39:20.213681'),
('1fabbb2d-462e-4f59-939d-e1a30ca4fe49', '9454a904-6fb5-4298-9f12-8eb6e9740c1a', '2026-03-27 00:57:45.797744', '2026-03-27 00:57:45.806997');

-- ==================== CART_ITEMS ====================
INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES
('a3e7372c-67d0-4fc0-9dc6-d880c3e7cfcf', '597f4718-1c87-4b39-914d-600a8e508512', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', 3),
('900862e6-3356-49bd-8f0c-2fcfda254961', 'ceecbd89-3fb4-43ec-946a-6c7b7745b39b', '0fee9909-5030-4653-89d9-ef00dcb62cec', 1),
('6f94135c-4031-44c8-be76-d3c51b64d22d', 'ceecbd89-3fb4-43ec-946a-6c7b7745b39b', '0b231149-7ee5-441c-bd6c-be71c74f8a30', 1);

-- ==================== PROMOTIONS ====================
INSERT INTO promotions (id, code, description, discount_type, discount_value, max_discount_value, start_date, end_date, status, created_at, updated_at) VALUES
('823fcf04-8249-484f-bf05-39a0c39babb8', 'RC15', 'Giảm 15% cho Royal Canin Mini Adult', 'PERCENT', 15.00, 50000.00, '2026-03-05', '2026-03-31', 'ACTIVE', '2026-03-04 19:27:52.952885', '2026-03-04 19:27:52.952885'),
('3776605f-8862-43c0-bf40-d571cbd3ea03', 'WHISKAS10', 'Giảm 10% cho thức ăn mèo Whiskas', 'PERCENT', 10.00, 30000.00, '2026-03-05', '2026-03-20', 'ACTIVE', '2026-03-04 19:28:03.283392', '2026-03-04 19:28:03.283392'),
('80cc7a85-9c5d-4edf-ba67-d5a7f40efeda', 'TOY20K', 'Giảm trực tiếp 20.000đ cho đồ chơi thú cưng', 'FIXED', 20000.00, 20000.00, '2026-03-05', '2026-03-25', 'ACTIVE', '2026-03-04 19:28:10.575953', '2026-03-04 19:28:10.575953'),
('521467db-f0be-46a8-a67f-3370d1bd83a8', 'LITTER25', 'Flash Sale giảm 25% cát vệ sinh Lavender', 'PERCENT', 25.00, 60000.00, '2026-03-05', '2026-03-10', 'ACTIVE', '2026-03-04 19:28:17.161632', '2026-03-04 19:28:17.161632'),
('202a16e7-617c-4697-89c0-148f7b3216ef', 'asdfasdf', 'giam sap sang', 'PERCENT', 70.01, 300000.01, '2025-06-01', '2027-04-24', 'ACTIVE', '2026-03-24 17:46:44.278318', '2026-03-24 17:46:44.278318');

-- ==================== PROMOTION_DETAILS ====================
INSERT INTO promotion_details (id, promotion_id, product_id) VALUES
('3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9', '823fcf04-8249-484f-bf05-39a0c39babb8', '57752647-1d1f-4914-8bd4-12d994c09bb5'),
('a32f0a76-697d-4218-aee2-eef7df2b996c', '823fcf04-8249-484f-bf05-39a0c39babb8', 'c3aaf119-9794-4891-a80b-680cf14b658e'),
('88910f5b-b207-42ed-9ba6-9840bf2d0d50', '3776605f-8862-43c0-bf40-d571cbd3ea03', '0fee9909-5030-4653-89d9-ef00dcb62cec'),
('19dc20f9-22c8-4f41-b606-ffb07f54547f', '80cc7a85-9c5d-4edf-ba67-d5a7f40efeda', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8'),
('5565c8aa-8d46-4696-88a8-475bee2751a0', '521467db-f0be-46a8-a67f-3370d1bd83a8', '96933adb-6487-4899-8872-da4e7cec6c05'),
('8a879987-2914-40d3-960a-7e9961d240af', '202a16e7-617c-4697-89c0-148f7b3216ef', '29cb5511-7db7-43c5-8ae3-550f362c57f6');

-- ==================== SUPPLIERS ====================
INSERT INTO suppliers (id, name, email, phone, address, status, created_at, updated_at) VALUES
('8ad7061c-081c-48a6-bb29-cfd762323e1b', 'Pet Food Vietnam Co., Ltd', 'contact@petfoodvn.com', '0498765432', '120 Nguyen Thi Minh Khai, District 3, Ho Chi Minh City', 'ACTIVATED', '2026-03-05 06:29:13.332221', '2026-03-05 06:29:13.332221'),
('b7108eed-10c6-440e-a6c0-0756c67f2f0d', 'Dư Trần', 'trandinhkhanhdu2005@gmail.com', '0916114531', '25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh', 'ACTIVATED', '2026-03-09 08:26:04.892329', '2026-03-09 08:26:04.892329');

-- ==================== PURCHASES ====================
INSERT INTO purchases (id, staff_id, supplier_id, total_amount, status, created_at) VALUES
('ffa848ca-c2df-4671-abdc-7662c419733f', 'cfdc91f6-83ae-4d67-89b0-2453e60f2c59', '8ad7061c-081c-48a6-bb29-cfd762323e1b', 28300000.00, 'PENDING', '2026-03-05 06:38:05.614306'),
('dd030e05-c290-4e51-a151-9e8e644b17ff', 'b6445ab3-970a-4dbe-ac64-487ed698b852', '8ad7061c-081c-48a6-bb29-cfd762323e1b', 15159273129.00, 'PENDING', '2026-03-24 17:13:25.392076'),
('9dd6c797-55a9-4124-9547-6b40ba86c33c', '88045899-3d9f-453f-a185-0478ebe0a432', '8ad7061c-081c-48a6-bb29-cfd762323e1b', 40000000.00, 'PENDING', '2026-03-24 17:19:13.934688');

-- ==================== PURCHASE_DETAILS ====================
INSERT INTO purchase_details (id, purchase_id, product_id, unit_price, quantity, total_price) VALUES
('1f4161d2-b8cd-4512-ab08-16085618a882', 'ffa848ca-c2df-4671-abdc-7662c419733f', '57752647-1d1f-4914-8bd4-12d994c09bb5', 100.00, 283000, 28300000.00),
('2e2e8b3f-63df-4096-9c8e-303bf19257f8', 'dd030e05-c290-4e51-a151-9e8e644b17ff', '96933adb-6487-4899-8872-da4e7cec6c05', 123123.00, 123123, 15159273129.00),
('42b2bad8-e7ac-46ce-a7cf-6dd8cda3c1b7', '9dd6c797-55a9-4124-9547-6b40ba86c33c', '29cb5511-7db7-43c5-8ae3-550f362c57f6', 200000.00, 200, 40000000.00);

-- ==================== INVOICES ====================
INSERT INTO invoices (id, staff_id, customer_id, shipping_address, total_amount, real_amount, payment_method, status, created_at) VALUES
('c92771fe-c572-4eb3-b754-68559abbcc77', 'cfdc91f6-83ae-4d67-89b0-2453e60f2c59', 'ba5df993-5e43-4c10-9faf-6c0b63f1ead2', '25 Nguyen Trai, District 5, Ho Chi Minh City', 0.00, 242250.00, 'QR_Scanning', 'PENDING', '2026-03-05 07:09:16.275423'),
('e0d3a99f-0f29-40a0-b483-700bca01990c', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'Ho Chi Minh city', 0.00, 330000.00, 'COD', 'PENDING', '2026-03-23 22:29:30.401897'),
('763e65d0-283b-4fb1-91ae-7286188597f4', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'Ho Chi Minh city', 0.00, 441111.00, 'COD', 'PENDING', '2026-03-24 16:53:00.802951'),
('459ad6e4-6e55-492b-9aac-36b3f1384d01', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'Ho Chi Minh city', 0.00, 330000.00, 'COD', 'PENDING', '2026-03-24 16:55:56.441789'),
('26654a3d-0cf6-4991-a1f2-ad4dc916e9d9', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'Ho Chi Minh city', 0.00, 59980.00, 'COD', 'PENDING', '2026-03-24 18:37:30.988809'),
('f4393667-e770-4ec1-b5b6-397292440157', '7bcc2326-d73d-467f-808c-0b2f05ed5b9b', '7a449c4f-3251-4282-974d-8ea2e0cce313', NULL, 165000.00, 165000.00, 'COD', 'PENDING', '2026-03-27 09:09:24.096758'),
('8f7f5ef8-2a82-48c7-9dda-7b0abede8c5d', '7bcc2326-d73d-467f-808c-0b2f05ed5b9b', '9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b', '25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh', 200000.00, 59980.00, 'COD', 'PENDING', '2026-03-27 09:14:25.73104'),
('67bcfb0b-2a37-4f45-a41e-1915d958af64', '7bcc2326-d73d-467f-808c-0b2f05ed5b9b', 'f1abd538-90a4-4774-8aca-494de63f132c', 'string', 165000.00, 165000.00, 'COD', 'PENDING', '2026-03-27 09:16:22.860882'),
('349e2c7a-428b-49f0-98b2-fd1de7d0e5b2', '7bcc2326-d73d-467f-808c-0b2f05ed5b9b', '9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b', '25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh', 650000.00, 467230.00, 'COD', 'PENDING', '2026-03-27 09:22:56.558626'),
('3a99d162-9c19-41b9-bb21-27dcbc04af94', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'dia chi giao hang moi', 0.00, 546111.00, 'COD', 'PAID', '2026-03-23 18:15:35.998463'),
('e33124bd-0582-4867-8d9e-aca2042889db', '7bcc2326-d73d-467f-808c-0b2f05ed5b9b', 'f1abd538-90a4-4774-8aca-494de63f132c', 'string', 285000.00, 242250.00, 'COD', 'PAID', '2026-03-27 09:17:56.852356'),
('0a1916d6-06da-42d7-9085-bcbbf1a0da9b', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'Ho Chi Minh city', 75000.00, 75000.00, 'COD', 'PENDING', '2026-05-08 03:03:30.175656'),
('4f01d517-1e03-45ad-8d73-d0d23b2dcfde', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'Ho Chi Minh city', 225000.00, 225000.00, 'COD', 'PAID', '2026-05-08 03:16:26.015475'),
('9565cc12-5e71-43e5-8fdc-1dfb2ccba432', NULL, '0cf0c9a3-3410-492a-802c-4efe708fd478', 'Ho Chi Minh city', 225000.00, 225000.00, 'COD', 'PAID', '2026-05-08 04:09:41.83653');

-- ==================== INVOICE_DETAILS ====================
INSERT INTO invoice_details (id, invoice_id, product_id, pet_id, promotion_detail_id, discount_amount, unit_price, quantity, total_price) VALUES
('f0539e11-0c39-4a5f-8165-479e2b28ec66', 'c92771fe-c572-4eb3-b754-68559abbcc77', '57752647-1d1f-4914-8bd4-12d994c09bb5', NULL, '3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9', 42750.00, 285000.00, 1, 285000.00),
('bd3e2d0d-929c-47e5-8485-8227c0ffe102', '3a99d162-9c19-41b9-bb21-27dcbc04af94', '96933adb-6487-4899-8872-da4e7cec6c05', NULL, NULL, NULL, 165000.00, 1, 165000.00),
('d8b7a514-03aa-4678-8c55-1bdb145be04a', '3a99d162-9c19-41b9-bb21-27dcbc04af94', '0fee9909-5030-4653-89d9-ef00dcb62cec', NULL, NULL, NULL, 135000.00, 2, 270000.00),
('8f37bae3-2242-4c82-95ca-ea4d7c8c6d73', '3a99d162-9c19-41b9-bb21-27dcbc04af94', '0b231149-7ee5-441c-bd6c-be71c74f8a30', NULL, NULL, NULL, 111111.00, 1, 111111.00),
('f6de7601-7c95-49a4-97c0-d8ee5e3622a5', 'e0d3a99f-0f29-40a0-b483-700bca01990c', '96933adb-6487-4899-8872-da4e7cec6c05', NULL, NULL, NULL, 165000.00, 2, 330000.00),
('1d289b0b-4ae8-481c-9952-2b67c1042488', '763e65d0-283b-4fb1-91ae-7286188597f4', '96933adb-6487-4899-8872-da4e7cec6c05', NULL, NULL, NULL, 165000.00, 2, 330000.00),
('08031d7d-81f4-48fe-ae1b-a04cf92a755c', '763e65d0-283b-4fb1-91ae-7286188597f4', '0b231149-7ee5-441c-bd6c-be71c74f8a30', NULL, NULL, NULL, 111111.00, 1, 111111.00),
('b3f6b1a6-fcff-4540-9b03-c64b1283c1c8', '459ad6e4-6e55-492b-9aac-36b3f1384d01', '96933adb-6487-4899-8872-da4e7cec6c05', NULL, NULL, NULL, 165000.00, 2, 330000.00),
('952f9e8c-3074-4b49-a2bc-6b416d5c0b42', '26654a3d-0cf6-4991-a1f2-ad4dc916e9d9', '29cb5511-7db7-43c5-8ae3-550f362c57f6', NULL, '8a879987-2914-40d3-960a-7e9961d240af', 140020.00, 200000.00, 1, 200000.00),
('452e48dd-bc78-4667-aae8-f9d19446364a', 'f4393667-e770-4ec1-b5b6-397292440157', '96933adb-6487-4899-8872-da4e7cec6c05', NULL, NULL, NULL, 165000.00, 1, 165000.00),
('2362205c-3b02-4bd6-b4d5-51cae46e0cb7', '8f7f5ef8-2a82-48c7-9dda-7b0abede8c5d', '29cb5511-7db7-43c5-8ae3-550f362c57f6', NULL, '8a879987-2914-40d3-960a-7e9961d240af', 140020.00, 200000.00, 1, 200000.00),
('2d6d9aac-e152-4032-9060-9a61e9f8745d', '67bcfb0b-2a37-4f45-a41e-1915d958af64', '96933adb-6487-4899-8872-da4e7cec6c05', NULL, NULL, NULL, 165000.00, 1, 165000.00),
('96bb10d1-18f1-42da-a18c-6b09206bc4c0', 'e33124bd-0582-4867-8d9e-aca2042889db', '57752647-1d1f-4914-8bd4-12d994c09bb5', NULL, '3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9', 42750.00, 285000.00, 1, 285000.00),
('62ce6457-7f35-4f3c-90f0-9087117d4521', '349e2c7a-428b-49f0-98b2-fd1de7d0e5b2', '57752647-1d1f-4914-8bd4-12d994c09bb5', NULL, '3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9', 42750.00, 285000.00, 1, 285000.00),
('1a382e99-6368-40d0-b848-781e0072b957', '349e2c7a-428b-49f0-98b2-fd1de7d0e5b2', '96933adb-6487-4899-8872-da4e7cec6c05', NULL, NULL, NULL, 165000.00, 1, 165000.00),
('2ebcedc7-4aa7-43db-86cf-0f2c30adc273', '349e2c7a-428b-49f0-98b2-fd1de7d0e5b2', '29cb5511-7db7-43c5-8ae3-550f362c57f6', NULL, '8a879987-2914-40d3-960a-7e9961d240af', 140020.00, 200000.00, 1, 200000.00),
('dfd31891-0a9a-41ac-ba00-efbd33cb220f', '0a1916d6-06da-42d7-9085-bcbbf1a0da9b', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', NULL, NULL, NULL, 75000.00, 1, 75000.00),
('9e505966-ce17-4752-bdc8-d7bfce232922', '4f01d517-1e03-45ad-8d73-d0d23b2dcfde', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', NULL, NULL, NULL, 75000.00, 3, 225000.00),
('12919329-1a76-4cd7-9a3f-d6af6b760d83', '9565cc12-5e71-43e5-8fdc-1dfb2ccba432', '0efbf7b4-fe1b-4564-885e-25d05cdcfed8', NULL, NULL, NULL, 75000.00, 3, 225000.00);

-- ==================== INVALIDATED_TOKENS ====================
INSERT INTO invalidated_token (id, expiry_time) VALUES
('2167ebfb-b87f-4e44-9b13-971ff9fe7e6a', '2026-03-11 03:47:23'),
('c151c7c0-78a2-4d4c-8834-a0a8761bf290', '2026-03-17 15:04:37'),
('cef20b2c-ea35-401b-b5e7-4c009ca421dc', '2026-03-21 12:59:58'),
('60205e36-2361-4e1d-9a44-9fc9b150ccc2', '2026-03-21 23:58:06');
