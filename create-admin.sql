-- Create admin user for Valory Line
-- Email: admin@valoryline.com
-- Password: admin123
-- 
-- Run this in Supabase SQL Editor AFTER running admin-auth-functions.sql

-- First, make sure pgcrypto is enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert admin user with pgcrypto hashed password
INSERT INTO admin_users (email, password_hash, name, role, is_active) 
VALUES (
    'admin@valoryline.com', 
    crypt('admin123', gen_salt('bf', 10)),  -- Hash with bcrypt via pgcrypto
    'Admin', 
    'super_admin', 
    true
)
ON CONFLICT (email) DO UPDATE 
SET password_hash = crypt('admin123', gen_salt('bf', 10)), is_active = true;

-- To change the password later, run:
-- UPDATE admin_users 
-- SET password_hash = crypt('NEW_PASSWORD_HERE', gen_salt('bf', 10))
-- WHERE email = 'admin@valoryline.com';
