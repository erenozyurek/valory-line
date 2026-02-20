# Valory Line - PostgreSQL Veritabanı Yapısı

Bu doküman, Valory Line projesinin mock verilerden gerçek veritabanına geçişi için gerekli PostgreSQL veritabanı yapısını içermektedir.

## 📋 İçindekiler

1. [Admin Kullanıcıları](#1-admin-kullanıcıları)
2. [Kategoriler](#2-kategoriler)
3. [Ürünler](#3-ürünler)
4. [Siparişler](#4-siparişler)
5. [Müşteriler](#5-müşteriler)
6. [Site İçeriği (CMS)](#6-site-içeriği-cms)
7. [Medya Kütüphanesi](#7-medya-kütüphanesi)
8. [İndeksler ve Performans](#8-indeksler-ve-performans)
9. [Varsayılan Veriler](#9-varsayılan-veriler)

---

## 1. Admin Kullanıcıları

Admin paneline giriş yapan kullanıcılar için tablo.

```sql
-- UUID extension'ı aktifleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin kullanıcıları tablosu
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

-- İndeks
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active) WHERE is_active = TRUE;
```

**Kullanım Alanları:**
- Admin paneli giriş/çıkış
- Yetki kontrolü
- Admin aktivite takibi

---

## 2. Kategoriler

Ürün kategorileri için tablo. Admin panelinden kategori ekleme, düzenleme, silme işlemleri.

```sql
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

-- İndeksler
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = TRUE;
```

**Kullanım Alanları:**
- `/admin/kategoriler` - Kategori yönetimi
- Kategori ekleme, düzenleme, silme
- Kategori sıralama
- Alt kategori desteği

---

## 3. Ürünler

Ürün bilgileri ve görselleri için tablolar.

### 3.1 Ana Ürün Tablosu

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2), -- İndirimli fiyat gösterimi için
    cost_price DECIMAL(10, 2), -- Maliyet fiyatı
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    weight DECIMAL(8, 2), -- gram cinsinden
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Durum
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    
    -- İlişkiler
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Zaman damgaları
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- İndeksler
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active ON products(status) WHERE status = 'active';
```

### 3.2 Ürün Görselleri

Admin panelinden yüklenen ürün görselleri için tablo.

```sql
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE, -- Ana görsel
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id) WHERE is_primary = TRUE;
```

### 3.3 Ürün Varyantları

Beden, renk gibi varyantlar için tablo.

```sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- örn: "M / Kırmızı"
    sku VARCHAR(100),
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    option1_name VARCHAR(100), -- örn: "Beden"
    option1_value VARCHAR(100), -- örn: "M"
    option2_name VARCHAR(100), -- örn: "Renk"
    option2_value VARCHAR(100), -- örn: "Kırmızı"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeks
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
```

**Kullanım Alanları:**
- `/admin/urunler` - Ürün yönetimi
- Ürün ekleme, düzenleme, silme
- Çoklu görsel yükleme
- Stok takibi
- Fiyat yönetimi

---

## 4. Siparişler

Sipariş yönetimi için tablolar.

### 4.1 Ana Sipariş Tablosu

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Misafir sipariş bilgileri
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_name VARCHAR(255),
    
    -- Durum
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    )),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
    )),
    
    -- Tutarlar
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Para birimi
    currency VARCHAR(3) DEFAULT 'TRY',
    
    -- Adres bilgileri (JSONB olarak saklanır)
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    
    -- Kargo
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    tracking_url TEXT,
    
    -- Ödeme
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255),
    
    -- Notlar
    customer_note TEXT,
    admin_note TEXT,
    
    -- Zaman damgaları
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- İndeksler
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
```

### 4.2 Sipariş Kalemleri

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Sipariş anındaki ürün bilgileri (snapshot)
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255),
    sku VARCHAR(100),
    
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Sipariş anındaki ürün görseli
    image_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

### 4.3 Sipariş Durum Geçmişi

```sql
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeks
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
```

**Kullanım Alanları:**
- `/admin/siparisler` - Aktif siparişler
- `/admin/gecmis-siparisler` - Tamamlanmış siparişler
- Sipariş durumu güncelleme
- Sipariş detayları görüntüleme
- Kargo takibi

---

## 5. Müşteriler

Müşteri bilgileri için tablolar.

### 5.1 Müşteri Tablosu

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    
    -- Varsayılan adres
    default_address_id UUID,
    
    -- Pazarlama
    accepts_marketing BOOLEAN DEFAULT FALSE,
    
    -- Durum
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Zaman damgaları
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_order_at TIMESTAMPTZ
);

-- İndeks
CREATE INDEX idx_customers_email ON customers(email);
```

### 5.2 Müşteri Adresleri

```sql
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

-- Varsayılan adres foreign key
ALTER TABLE customers 
ADD CONSTRAINT fk_default_address 
FOREIGN KEY (default_address_id) REFERENCES customer_addresses(id) ON DELETE SET NULL;

-- İndeks
CREATE INDEX idx_customer_addresses_customer ON customer_addresses(customer_id);
```

---

## 6. Site İçeriği (CMS)

Admin panelinden düzenlenebilen site içerikleri.

### 6.1 Hakkımızda İçeriği

```sql
CREATE TABLE about_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) UNIQUE NOT NULL, -- 'hero', 'story', 'mission', 'vision', 'values', 'stats'
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT,
    image_url TEXT,
    
    -- İstatistikler için (JSONB)
    stats_data JSONB, -- { "experience": "7", "customers": "10000", "products": "500", "cities": "81" }
    
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id)
);

-- İndeks
CREATE INDEX idx_about_content_key ON about_content(section_key);
```

### 6.2 İletişim Bilgileri

```sql
CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL, -- 'email', 'phone', 'address', 'city', 'weekday_hours', 'weekend_hours'
    label VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    icon VARCHAR(50), -- Lucide icon adı
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeks
CREATE INDEX idx_contact_info_key ON contact_info(key);
```

### 6.3 Sosyal Medya Linkleri

```sql
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'twitter', 'linkedin'
    url TEXT NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.4 Genel Site Ayarları

```sql
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'text', -- 'text', 'number', 'boolean', 'json', 'image'
    group_name VARCHAR(100), -- 'general', 'shipping', 'payment', 'seo'
    label VARCHAR(255),
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeks
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_group ON site_settings(group_name);
```

**Kullanım Alanları:**
- `/admin/hakkimizda` - Hakkımızda sayfası düzenleme
- `/admin/iletisim` - İletişim bilgileri düzenleme
- Site genelinde kullanılan bilgilerin merkezi yönetimi

---

## 7. Medya Kütüphanesi

Admin panelinden yüklenen tüm medya dosyaları için tablo.

```sql
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL, -- byte cinsinden
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text VARCHAR(255),
    caption TEXT,
    folder VARCHAR(255) DEFAULT 'uploads',
    uploaded_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_media_created ON media(created_at DESC);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
```

**Kullanım Alanları:**
- Ürün görselleri
- Kategori görselleri
- Hakkımızda sayfası görselleri
- Genel site görselleri

---

## 8. İndeksler ve Performans

### 8.1 Otomatik Güncelleme Trigger'ı

```sql
-- updated_at otomatik güncelleme fonksiyonu
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

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 8.2 Sipariş Numarası Oluşturma

```sql
-- Sipariş numarası oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'VL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

---

## 9. Varsayılan Veriler

### 9.1 Admin Kullanıcısı

```sql
-- Varsayılan admin kullanıcısı (şifre: admin123)
-- Not: Gerçek uygulamada bcrypt hash kullanılmalı
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@valoryline.com', '$2b$10$YourBcryptHashHere', 'Admin', 'super_admin');
```

### 9.2 Kategoriler

```sql
INSERT INTO categories (name, slug, description, sort_order) VALUES 
('Kadın', 'kadin', 'Kadınlara özel hediyeler', 1),
('Erkek', 'erkek', 'Erkeklere özel hediyeler', 2),
('Takı', 'taki', 'Kolye, küpe, yüzük', 3),
('Cüzdan', 'cuzdan', 'Deri cüzdan ve kartlıklar', 4),
('Saat', 'saat', 'Premium saat koleksiyonu', 5),
('Çift Setleri', 'cift', 'Sevgililere özel ikili setler', 6),
('Aksesuar', 'aksesuar', 'Kemer, atkı, eldiven', 7);
```

### 9.3 İletişim Bilgileri

```sql
INSERT INTO contact_info (key, label, value, icon, sort_order) VALUES 
('email', 'E-posta Adresi', 'info@valoryline.com', 'Mail', 1),
('phone', 'Telefon Numarası', '+90 (212) 123 45 67', 'Phone', 2),
('address', 'Adres', 'Nişantaşı, Abdi İpekçi Caddesi No: 42', 'MapPin', 3),
('city', 'Şehir / Posta Kodu', 'Şişli, İstanbul 34367', 'MapPin', 4),
('weekday_hours', 'Hafta İçi', 'Pazartesi - Cumartesi: 10:00 - 20:00', 'Clock', 5),
('weekend_hours', 'Hafta Sonu', 'Pazar: 12:00 - 18:00', 'Clock', 6);
```

### 9.4 Hakkımızda İçeriği

```sql
INSERT INTO about_content (section_key, title, subtitle, content, stats_data, sort_order) VALUES 
('hero', 'Her An Özel, Her Hediye Benzersiz', 'Hikayemiz', '2018 yılında kurulan Valory Line, özel anları unutulmaz kılmak için yola çıktı. Kadın ve erkek için tasarladığımız her ürün, sevgi ve özenle hazırlanmış bir hediyedir.', NULL, 1),
('vision', 'Vizyonumuz', NULL, 'Valory Line olarak inanıyoruz ki hediye vermek bir sanattır. Doğru hediye, karşınızdaki kişiye ne kadar değer verdiğinizi gösterir.', NULL, 2),
('values', 'Değerlerimiz', NULL, 'Koleksiyonumuz, kadın ve erkek için özenle seçilmiş takılar, cüzdanlar, çantalar, saatler ve aksesuarlardan oluşur. Her ürün, hem kalitesi hem de estetiğiyle dikkat çeker.', NULL, 3),
('stats', 'İstatistikler', NULL, NULL, '{"experience": "7", "customers": "10000", "products": "500", "cities": "81"}', 4);
```

### 9.5 Site Ayarları

```sql
INSERT INTO site_settings (key, value, type, group_name, label) VALUES 
('site_name', 'Valory Line', 'text', 'general', 'Site Adı'),
('site_tagline', 'Lüks Hediyelik Eşya & Aksesuar', 'text', 'general', 'Slogan'),
('currency', 'TRY', 'text', 'general', 'Para Birimi'),
('currency_symbol', '₺', 'text', 'general', 'Para Birimi Sembolü'),
('free_shipping_threshold', '500', 'number', 'shipping', 'Ücretsiz Kargo Limiti'),
('default_shipping_cost', '29.90', 'number', 'shipping', 'Varsayılan Kargo Ücreti');
```

---

## 📊 Admin Panel İşlemleri ve Karşılık Gelen Tablolar

| Admin Sayfası | Tablo(lar) | İşlemler |
|--------------|-----------|----------|
| `/admin/urunler` | `products`, `product_images`, `product_variants` | CRUD, Görsel yükleme |
| `/admin/kategoriler` | `categories` | CRUD, Sıralama |
| `/admin/siparisler` | `orders`, `order_items`, `order_status_history` | Görüntüleme, Durum güncelleme |
| `/admin/gecmis-siparisler` | `orders`, `order_items` | Görüntüleme, Raporlama |
| `/admin/iletisim` | `contact_info` | Güncelleme |
| `/admin/hakkimizda` | `about_content` | Güncelleme |
| Admin Login | `admin_users` | Kimlik doğrulama |

---

## 🔄 Sonraki Adımlar

1. **Veritabanı Oluşturma**: PostgreSQL veritabanı oluştur ve bu şemayı uygula
2. **API Endpoint'leri**: Her admin işlemi için API endpoint'leri oluştur
3. **Dosya Yükleme**: Görsel yükleme için storage sistemi kur (Supabase Storage, AWS S3, vb.)
4. **Admin Store Güncelleme**: `adminStore.ts` dosyasını gerçek API çağrıları yapacak şekilde güncelle
5. **Form Validasyonu**: Tüm formlara validasyon ekle
6. **Hata Yönetimi**: API hataları için merkezi hata yönetimi ekle
7. **Test**: Tüm CRUD işlemlerini test et

---

## 🔐 Güvenlik Notları

- Tüm şifreler bcrypt ile hashlenmelidir
- Admin paneli için JWT veya session tabanlı kimlik doğrulama kullanılmalıdır
- SQL injection saldırılarına karşı parametreli sorgular kullanılmalıdır
- Dosya yüklemelerinde dosya tipi ve boyut kontrolü yapılmalıdır
- CORS ayarları doğru yapılandırılmalıdır
