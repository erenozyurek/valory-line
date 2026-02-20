-- ============================================
-- Valory Line E-Commerce Database Schema
-- PostgreSQL Database Structure
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. ADMIN USERS
-- ============================================

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'editor')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active) WHERE is_active = TRUE;

-- ============================================
-- 2. CATEGORIES
-- ============================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = TRUE;

-- ============================================
-- 3. PRODUCTS
-- ============================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    weight DECIMAL(8, 2),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    
    -- Relations
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active ON products(status) WHERE status = 'active';

-- ============================================
-- 4. PRODUCT IMAGES
-- ============================================

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = TRUE;

-- ============================================
-- 5. PRODUCT VARIANTS
-- ============================================

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    option1_name VARCHAR(100),
    option1_value VARCHAR(100),
    option2_name VARCHAR(100),
    option2_value VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- ============================================
-- 6. CUSTOMERS
-- ============================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    default_address_id UUID,
    accepts_marketing BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_order_at TIMESTAMPTZ
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_active ON customers(is_active) WHERE is_active = TRUE;

-- ============================================
-- 7. CUSTOMER ADDRESSES
-- ============================================

CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Türkiye',
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_addresses_customer ON customer_addresses(customer_id);

-- Add foreign key for default address
ALTER TABLE customers 
ADD CONSTRAINT fk_default_address 
FOREIGN KEY (default_address_id) REFERENCES customer_addresses(id) ON DELETE SET NULL;

-- ============================================
-- 8. ORDERS
-- ============================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Guest order info
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_name VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    )),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
    )),
    
    -- Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Currency
    currency VARCHAR(3) DEFAULT 'TRY',
    
    -- Addresses (stored as JSONB)
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    
    -- Shipping
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    tracking_url TEXT,
    
    -- Payment
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255),
    
    -- Notes
    customer_note TEXT,
    admin_note TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ============================================
-- 9. ORDER ITEMS
-- ============================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Snapshot of product at order time
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255),
    sku VARCHAR(100),
    
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Product image at order time
    image_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- 10. ORDER STATUS HISTORY
-- ============================================

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_created ON order_status_history(created_at DESC);

-- ============================================
-- 11. ABOUT CONTENT (CMS)
-- ============================================

CREATE TABLE about_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT,
    image_url TEXT,
    stats_data JSONB,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id)
);

CREATE INDEX idx_about_content_key ON about_content(section_key);
CREATE INDEX idx_about_content_active ON about_content(is_active) WHERE is_active = TRUE;

-- ============================================
-- 12. CONTACT INFO
-- ============================================

CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_info_key ON contact_info(key);
CREATE INDEX idx_contact_info_active ON contact_info(is_active) WHERE is_active = TRUE;

-- ============================================
-- 13. SOCIAL LINKS
-- ============================================

CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_links_active ON social_links(is_active) WHERE is_active = TRUE;

-- ============================================
-- 14. SITE SETTINGS
-- ============================================

CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'text',
    group_name VARCHAR(100),
    label VARCHAR(255),
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_group ON site_settings(group_name);

-- ============================================
-- 15. MEDIA LIBRARY
-- ============================================

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text VARCHAR(255),
    caption TEXT,
    folder VARCHAR(255) DEFAULT 'uploads',
    uploaded_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_media_created ON media(created_at DESC);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number = 'VL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES 
('Kadın', 'kadin', 'Kadınlara özel hediyeler', 1, true),
('Erkek', 'erkek', 'Erkeklere özel hediyeler', 2, true),
('Takı', 'taki', 'Kolye, küpe, yüzük', 3, true),
('Cüzdan', 'cuzdan', 'Deri cüzdan ve kartlıklar', 4, true),
('Saat', 'saat', 'Özel saat koleksiyonu', 5, true),
('Çift Setleri', 'cift', 'Sevgililere özel ikili setler', 6, true),
('Aksesuar', 'aksesuar', 'Kemer, atkı, eldiven', 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Contact Info
INSERT INTO contact_info (key, label, value, icon, sort_order, is_active) VALUES 
('email', 'E-posta Adresi', 'info@valoryline.com', 'Mail', 1, true),
('phone', 'Telefon Numarası', '+90 (212) 123 45 67', 'Phone', 2, true),
('address', 'Adres', 'Nişantaşı, Abdi İpekçi Caddesi No: 42', 'MapPin', 3, true),
('city', 'Şehir / Posta Kodu', 'Şişli, İstanbul 34367', 'MapPin', 4, true),
('weekday_hours', 'Hafta İçi', 'Pazartesi - Cumartesi: 10:00 - 20:00', 'Clock', 5, true),
('weekend_hours', 'Hafta Sonu', 'Pazar: 12:00 - 18:00', 'Clock', 6, true)
ON CONFLICT (key) DO NOTHING;

-- About Content
INSERT INTO about_content (section_key, title, subtitle, content, stats_data, sort_order, is_active) VALUES 
('hero', 'Her An Özel, Her Hediye İçin', 'Hikayemiz', '2018 yılında kurulan Valory Line, özel anları unutulmaz kılmak için yola çıktı. Kadın ve erkek için tasarladığımız her ürün, sevgi ve özenle hazırlanmış bir hediyedir.', NULL, 1, true),
('vision', 'Vizyonumuz', NULL, 'Valory Line olarak inanıyoruz ki hediye vermek bir sanattır. Doğru hediye, karşınızdaki kişiye ne kadar değer verdiğinizi gösterir.', NULL, 2, true),
('values', 'Değerlerimiz', NULL, 'Koleksiyonumuz, kadın ve erkek için özenle seçilmiş takılar, cüzdanlar, çantalar, saatler ve aksesuarlardan oluşur. Her ürün, hem kalitesi hem de estetiğiyle dikkat çeker.', NULL, 3, true),
('stats', 'İstatistikler', NULL, NULL, '{"experience": "7", "customers": "10000", "products": "500", "cities": "81"}'::jsonb, 4, true)
ON CONFLICT (section_key) DO NOTHING;

-- Site Settings
INSERT INTO site_settings (key, value, type, group_name, label) VALUES 
('site_name', 'Valory Line', 'text', 'general', 'Site Adı'),
('site_tagline', 'Özel Tasarım Hediyelik Eşya & Aksesuar', 'text', 'general', 'Slogan'),
('currency', 'TRY', 'text', 'general', 'Para Birimi'),
('currency_symbol', '₺', 'text', 'general', 'Para Birimi Sembolü'),
('free_shipping_threshold', '500', 'number', 'shipping', 'Ücretsiz Kargo Limiti'),
('default_shipping_cost', '29.90', 'number', 'shipping', 'Varsayılan Kargo Ücreti')
ON CONFLICT (key) DO NOTHING;

-- Admin User (password: admin123)
-- Note: You need to generate the bcrypt hash separately
-- Example: $2b$10$YourBcryptHashHere
INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES 
('admin@valoryline.com', '$2b$10$YourBcryptHashHere', 'Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VIEWS (Optional - for easier querying)
-- ============================================

-- Active products with category info
CREATE OR REPLACE VIEW active_products_view AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image_url,
    (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active';

-- Order summary view
CREATE OR REPLACE VIEW order_summary_view AS
SELECT 
    o.*,
    c.email as customer_email,
    c.first_name as customer_first_name,
    c.last_name as customer_last_name,
    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE admin_users IS 'Admin panel kullanıcıları';
COMMENT ON TABLE categories IS 'Ürün kategorileri';
COMMENT ON TABLE products IS 'Ürün bilgileri';
COMMENT ON TABLE product_images IS 'Ürün görselleri';
COMMENT ON TABLE product_variants IS 'Ürün varyantları (beden, renk vb.)';
COMMENT ON TABLE customers IS 'Müşteri bilgileri';
COMMENT ON TABLE customer_addresses IS 'Müşteri adresleri';
COMMENT ON TABLE orders IS 'Siparişler';
COMMENT ON TABLE order_items IS 'Sipariş kalemleri';
COMMENT ON TABLE order_status_history IS 'Sipariş durum geçmişi';
COMMENT ON TABLE about_content IS 'Hakkımızda sayfası içeriği';
COMMENT ON TABLE contact_info IS 'İletişim bilgileri';
COMMENT ON TABLE social_links IS 'Sosyal medya linkleri';
COMMENT ON TABLE site_settings IS 'Site ayarları';
COMMENT ON TABLE media IS 'Medya kütüphanesi';
