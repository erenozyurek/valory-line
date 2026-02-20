-- ============================================
-- Admin Password Verification Function (pgcrypto)
-- Run this in Supabase SQL Editor
-- ============================================

-- Function to verify admin password using pgcrypto
CREATE OR REPLACE FUNCTION verify_admin_password(
    p_email TEXT,
    p_password TEXT
)
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    name VARCHAR,
    role VARCHAR,
    avatar_url TEXT,
    is_active BOOLEAN,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        au.email,
        au.name,
        au.role,
        au.avatar_url,
        au.is_active,
        au.last_login_at,
        au.created_at,
        au.updated_at
    FROM admin_users au
    WHERE au.email = p_email
      AND au.is_active = TRUE
      AND au.password_hash = crypt(p_password, au.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to hash a password with pgcrypto (for creating/updating admin users)
CREATE OR REPLACE FUNCTION hash_password(p_password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(p_password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
