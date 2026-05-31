-- ============================================================
-- V3__fix_passwords.sql
-- Happy Pet Shop - Fix Passwords
-- 
-- Cập nhật password cho tất cả user:
-- - Admin: Asdf1234!
-- - Staff & Users: 123456
-- ============================================================

-- Enable pgcrypto extension for crypt function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==================== UPDATE PASSWORDS ====================

-- Admin password: Asdf1234!
UPDATE users
SET password = crypt('Asdf1234!', gen_salt('bf', 12))
WHERE username = 'admin';

-- Staff & Users password: 123456
UPDATE users
SET password = crypt('123456', gen_salt('bf', 12))
WHERE username != 'admin';
