# Supabase Kurulum Rehberi

Bu rehber, Valory Line projesi için Supabase kurulumunu adım adım açıklar.

## 1. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. "New Project" butonuna tıklayın
3. Proje bilgilerini doldurun:
   - **Name**: valory-line
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: Europe (Frankfurt) veya en yakın bölge
4. "Create new project" butonuna tıklayın
5. Projenin hazırlanmasını bekleyin (1-2 dakika)

## 2. Veritabanı Şemasını Uygulama

1. Supabase Dashboard'da sol menüden **SQL Editor**'ü açın
2. "New query" butonuna tıklayın
3. `database.md` dosyasındaki SQL komutlarını kopyalayın ve SQL Editor'e yapıştırın
4. **Önemli**: Aşağıdaki sırayla SQL komutlarını çalıştırın:

### Adım 1: Extension ve Temel Tablolar

```sql
-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users tablosu
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

-- Categories tablosu
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

-- Products tablosu
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
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Product images tablosu
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact info tablosu
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

-- About content tablosu
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

-- Orders tablosu
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    )),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
    )),
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    tracking_url TEXT,
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255),
    customer_note TEXT,
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Order items tablosu
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID,
    variant_id UUID,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255),
    sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media tablosu
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
```

### Adım 2: İndeksler

```sql
-- Admin users
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Categories
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);

-- Product images
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Orders
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Order items
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Contact info
CREATE INDEX idx_contact_info_key ON contact_info(key);

-- Media
CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_media_created ON media(created_at DESC);
```

### Adım 3: Trigger'lar

```sql
-- Updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları uygula
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Adım 4: Varsayılan Veriler

```sql
-- Kategoriler
INSERT INTO categories (name, slug, description, sort_order) VALUES 
('Kadın', 'kadin', 'Kadınlara özel hediyeler', 1),
('Erkek', 'erkek', 'Erkeklere özel hediyeler', 2),
('Takı', 'taki', 'Kolye, küpe, yüzük', 3),
('Cüzdan', 'cuzdan', 'Deri cüzdan ve kartlıklar', 4),
('Saat', 'saat', 'Premium saat koleksiyonu', 5),
('Çift Setleri', 'cift', 'Sevgililere özel ikili setler', 6),
('Aksesuar', 'aksesuar', 'Kemer, atkı, eldiven', 7);

-- İletişim bilgileri
INSERT INTO contact_info (key, label, value, icon, sort_order) VALUES 
('email', 'E-posta Adresi', 'info@valoryline.com', 'Mail', 1),
('phone', 'Telefon Numarası', '+90 (212) 123 45 67', 'Phone', 2),
('address', 'Adres', 'Nişantaşı, Abdi İpekçi Caddesi No: 42', 'MapPin', 3),
('city', 'Şehir / Posta Kodu', 'Şişli, İstanbul 34367', 'MapPin', 4),
('weekday_hours', 'Hafta İçi', 'Pazartesi - Cumartesi: 10:00 - 20:00', 'Clock', 5),
('weekend_hours', 'Hafta Sonu', 'Pazar: 12:00 - 18:00', 'Clock', 6);

-- Hakkımızda içeriği
INSERT INTO about_content (section_key, title, subtitle, content, stats_data, sort_order) VALUES 
('hero', 'Her An Özel, Her Hediye Benzersiz', 'Hikayemiz', '2018 yılında kurulan Valory Line, özel anları unutulmaz kılmak için yola çıktı. Kadın ve erkek için tasarladığımız her ürün, sevgi ve özenle hazırlanmış bir hediyedir.', NULL, 1),
('vision', 'Vizyonumuz', NULL, 'Valory Line olarak inanıyoruz ki hediye vermek bir sanattır. Doğru hediye, karşınızdaki kişiye ne kadar değer verdiğinizi gösterir.', NULL, 2),
('values', 'Değerlerimiz', NULL, 'Koleksiyonumuz, kadın ve erkek için özenle seçilmiş takılar, cüzdanlar, çantalar, saatler ve aksesuarlardan oluşur. Her ürün, hem kalitesi hem de estetiğiyle dikkat çeker.', NULL, 3),
('stats', 'İstatistikler', NULL, NULL, '{"experience": "7", "customers": "10000", "products": "500", "cities": "81"}'::jsonb, 4);
```

## 3. Environment Variables Ayarlama

1. Supabase Dashboard'da **Settings** > **API** bölümüne gidin
2. Aşağıdaki bilgileri kopyalayın:
   - **Project URL**
   - **anon public** key
   - **service_role** key (güvenli tutun!)

3. Projenizin ana dizininde `.env.local` dosyası oluşturun:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. `.env.local` dosyasını `.gitignore`'a ekleyin (zaten ekli olmalı)

## 4. Supabase Storage Kurulumu

1. Supabase Dashboard'da **Storage** bölümüne gidin
2. "Create a new bucket" butonuna tıklayın
3. Bucket bilgilerini doldurun:
   - **Name**: `product-images`
   - **Public bucket**: ✅ (işaretleyin)
4. "Create bucket" butonuna tıklayın
5. Aynı işlemi tekrarlayarak `category-images` bucket'ı oluşturun

## 5. Admin Kullanıcısı Oluşturma

Admin kullanıcısı için şifre hash'i oluşturmak gerekiyor. Aşağıdaki Node.js script'ini kullanabilirsiniz:

```javascript
// scripts/hash-password.js
const bcrypt = require('bcrypt');

const password = 'admin123'; // İstediğiniz şifreyi girin
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) throw err;
    console.log('Password hash:', hash);
});
```

Çalıştırma:
```bash
npm install bcrypt
node scripts/hash-password.js
```

Oluşan hash'i SQL Editor'de kullanın:

```sql
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@valoryline.com', 'BURAYA_HASH_YAPISTIRIN', 'Admin', 'super_admin');
```

## 6. Row Level Security (RLS) - Opsiyonel

Güvenlik için RLS politikaları ekleyebilirsiniz:

```sql
-- Admin users tablosu için RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read their own data" ON admin_users
    FOR SELECT USING (auth.uid() = id);

-- Diğer tablolar için admin erişimi
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to products" ON products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
    );

CREATE POLICY "Admins have full access to categories" ON categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
    );

CREATE POLICY "Admins have full access to orders" ON orders
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
    );
```

## 7. Kurulum Doğrulama

1. Supabase Dashboard'da **Table Editor**'ü açın
2. Tüm tabloların oluşturulduğunu kontrol edin
3. `categories` tablosunda 7 kategori olduğunu kontrol edin
4. `contact_info` tablosunda 6 kayıt olduğunu kontrol edin
5. `about_content` tablosunda 4 kayıt olduğunu kontrol edin

## Sonraki Adımlar

Kurulum tamamlandıktan sonra:
1. Projeyi yeniden başlatın: `npm run dev`
2. Admin paneline giriş yapmayı deneyin
3. Kategori ekleme/düzenleme işlemlerini test edin
