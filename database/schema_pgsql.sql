-- ============================================
-- AMIR ISLAMIC COLLECTION - PostgreSQL Schema
-- For Supabase / Render PostgreSQL
-- ============================================

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    email_verified_at TIMESTAMP NULL,
    email_verification_token VARCHAR(100),
    remember_token VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    referral_code VARCHAR(50) UNIQUE,
    referred_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_referral ON users (referral_code);
ALTER TABLE users ADD FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'manager', 'support')),
    avatar VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_admins_email ON admins (email);
CREATE INDEX idx_admins_role ON admins (role);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE admin_roles (
    admin_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (admin_id, role_id),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ============================================
-- CATEGORIES & PRODUCTS
-- ============================================

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    image VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_categories_status ON categories (status);
CREATE INDEX idx_categories_parent ON categories (parent_id);
ALTER TABLE categories ADD FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;

CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    logo VARCHAR(255),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_brands_slug ON brands (slug);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tags_slug ON tags (slug);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NULL,
    brand_id BIGINT NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    short_description TEXT,
    description TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(12,2) NULL,
    cost_price NUMERIC(12,2) NULL,
    discount_percent INTEGER DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    weight NUMERIC(10,2) NULL,
    length NUMERIC(10,2) NULL,
    width NUMERIC(10,2) NULL,
    height NUMERIC(10,2) NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_featured SMALLINT DEFAULT 0,
    is_bestseller SMALLINT DEFAULT 0,
    is_trending SMALLINT DEFAULT 0,
    is_new SMALLINT DEFAULT 1,
    is_digital SMALLINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
    views_count BIGINT DEFAULT 0,
    sales_count BIGINT DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_sku ON products (sku);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_brand ON products (brand_id);
CREATE INDEX idx_products_featured ON products (is_featured);
CREATE INDEX idx_products_price ON products (price);
ALTER TABLE products ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;

CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary SMALLINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_product_images_product ON product_images (product_id);
ALTER TABLE product_images ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    price NUMERIC(12,2) NULL,
    stock_quantity INTEGER DEFAULT 0,
    weight NUMERIC(10,2) NULL,
    is_default SMALLINT DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_variants_product ON product_variants (product_id);
ALTER TABLE product_variants ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

CREATE TABLE product_variant_attributes (
    id BIGSERIAL PRIMARY KEY,
    variant_id BIGINT NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE product_tags (
    product_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE inventory_log (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_id BIGINT NULL,
    quantity_change INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    reference_type VARCHAR(100),
    reference_id BIGINT NULL,
    created_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_inventory_product ON inventory_log (product_id);
ALTER TABLE inventory_log ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- ============================================
-- SHOPPING CART
-- ============================================

CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL,
    session_id VARCHAR(100),
    coupon_id BIGINT NULL,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    tax NUMERIC(12,2) DEFAULT 0.00,
    shipping NUMERIC(12,2) DEFAULT 0.00,
    total NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_carts_user ON carts (user_id);
CREATE INDEX idx_carts_session ON carts (session_id);
ALTER TABLE carts ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_id BIGINT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cart_items_cart ON cart_items (cart_id);
CREATE INDEX idx_cart_items_product ON cart_items (product_id);
ALTER TABLE cart_items ADD FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE;
ALTER TABLE cart_items ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- ============================================
-- ORDERS & CHECKOUT
-- ============================================

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    tax NUMERIC(12,2) DEFAULT 0.00,
    shipping_cost NUMERIC(12,2) DEFAULT 0.00,
    total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(12,2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    discount_type VARCHAR(20) NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12,2) DEFAULT 0.00,
    shipping_method_id BIGINT NULL,
    shipping_address_id BIGINT NULL,
    billing_address_id BIGINT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'returned', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    delivered_at TIMESTAMP NULL,
    invoice_number VARCHAR(50),
    invoice_url VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_number ON orders (order_number);
CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_payment ON orders (payment_status);
CREATE INDEX idx_orders_created ON orders (created_at);
ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    product_sku VARCHAR(100),
    variant_name VARCHAR(255),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_product ON order_items (product_id);
ALTER TABLE order_items ADD FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE order_items ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

CREATE TABLE order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    comment TEXT,
    changed_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_status_history_order ON order_status_history (order_id);
ALTER TABLE order_status_history ADD FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- ============================================
-- ADDRESSES
-- ============================================

CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Kenya',
    is_default SMALLINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_addresses_user ON addresses (user_id);
ALTER TABLE addresses ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================
-- PAYMENTS & MPESA
-- ============================================

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    transaction_id VARCHAR(255),
    receipt_number VARCHAR(100),
    phone_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payments_order ON payments (order_id);
CREATE INDEX idx_payments_transaction ON payments (transaction_id);
ALTER TABLE payments ADD FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

CREATE TABLE mpesa_transactions (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NULL,
    payment_id BIGINT NULL,
    merchant_request_id VARCHAR(100),
    checkout_request_id VARCHAR(100) UNIQUE,
    response_code VARCHAR(10),
    response_description TEXT,
    customer_message TEXT,
    result_code VARCHAR(10),
    result_description TEXT,
    amount NUMERIC(12,2),
    phone_number VARCHAR(20),
    mpesa_receipt_number VARCHAR(100),
    transaction_date VARCHAR(20),
    balance NUMERIC(12,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    raw_request TEXT,
    raw_response TEXT,
    raw_callback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_mpesa_order ON mpesa_transactions (order_id);
CREATE INDEX idx_mpesa_checkout ON mpesa_transactions (checkout_request_id);
CREATE INDEX idx_mpesa_receipt ON mpesa_transactions (mpesa_receipt_number);
CREATE INDEX idx_mpesa_phone ON mpesa_transactions (phone_number);
CREATE INDEX idx_mpesa_status ON mpesa_transactions (status);
ALTER TABLE mpesa_transactions ADD FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE mpesa_transactions ADD FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_featured SMALLINT DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reviews_product ON reviews (product_id);
CREATE INDEX idx_reviews_user ON reviews (user_id);
CREATE INDEX idx_reviews_status ON reviews (status);
ALTER TABLE reviews ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE review_helpful (
    id BIGSERIAL PRIMARY KEY,
    review_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (review_id, user_id),
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- WISHLIST & FAVORITES
-- ============================================

CREATE TABLE wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);
CREATE INDEX idx_wishlists_user ON wishlists (user_id);
ALTER TABLE wishlists ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE wishlists ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

CREATE TABLE recently_viewed (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL,
    session_id VARCHAR(100),
    product_id BIGINT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_recent_user ON recently_viewed (user_id);
CREATE INDEX idx_recent_session ON recently_viewed (session_id);
ALTER TABLE recently_viewed ADD FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- ============================================
-- COUPONS
-- ============================================

CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value NUMERIC(12,2) NOT NULL,
    min_order_amount NUMERIC(12,2) DEFAULT 0.00,
    max_discount NUMERIC(12,2) NULL,
    usage_limit INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    applies_to VARCHAR(20) DEFAULT 'all' CHECK (applies_to IN ('all', 'category', 'product')),
    applies_to_id BIGINT NULL,
    starts_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    is_active SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_coupons_code ON coupons (code);
CREATE INDEX idx_coupons_active ON coupons (is_active);

CREATE TABLE coupon_usage (
    id BIGSERIAL PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NULL,
    discount_amount NUMERIC(12,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_coupon_usage_coupon ON coupon_usage (coupon_id);
CREATE INDEX idx_coupon_usage_user ON coupon_usage (user_id);
ALTER TABLE coupon_usage ADD FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE;
ALTER TABLE coupon_usage ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================
-- SHIPPING & TAX
-- ============================================

CREATE TABLE shipping_methods (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    free_shipping_min NUMERIC(12,2) NULL,
    estimated_days VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tax_rates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    rate NUMERIC(5,2) NOT NULL,
    type VARCHAR(20) DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
    applies_to VARCHAR(20) DEFAULT 'all' CHECK (applies_to IN ('all', 'shipping')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BLOG
-- ============================================

CREATE TABLE blog_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_blog_categories_slug ON blog_categories (slug);

CREATE TABLE blogs (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NULL,
    author_id BIGINT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image VARCHAR(255),
    tags VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured SMALLINT DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_blogs_slug ON blogs (slug);
CREATE INDEX idx_blogs_status ON blogs (status);
CREATE INDEX idx_blogs_category ON blogs (category_id);
CREATE INDEX idx_blogs_author ON blogs (author_id);
ALTER TABLE blogs ADD FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;
ALTER TABLE blogs ADD FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE SET NULL;

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_group VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_settings_key ON settings (setting_key);
CREATE INDEX idx_settings_group ON settings (setting_group);

CREATE TABLE site_content (
    id BIGSERIAL PRIMARY KEY,
    page VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT,
    image VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (page, section)
);
CREATE INDEX idx_site_content_page ON site_content (page);

CREATE TABLE banners (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    btn_text VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    placement VARCHAR(20) DEFAULT 'hero' CHECK (placement IN ('hero', 'promo', 'sidebar')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL,
    items TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_menus_location ON menus (location);

CREATE TABLE faqs (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read SMALLINT DEFAULT 0,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_contacts_read ON contacts (is_read);

-- ============================================
-- NEWSLETTER
-- ============================================

CREATE TABLE newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(200),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL
);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers (email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers (status);

-- ============================================
-- SUPPORT TICKETS
-- ============================================

CREATE TABLE support_tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT NULL,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    assigned_to BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tickets_user ON support_tickets (user_id);
CREATE INDEX idx_tickets_status ON support_tickets (status);
ALTER TABLE support_tickets ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE support_tickets ADD FOREIGN KEY (assigned_to) REFERENCES admins(id) ON DELETE SET NULL;

CREATE TABLE ticket_replies (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    user_id BIGINT NULL,
    admin_id BIGINT NULL,
    message TEXT NOT NULL,
    attachments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ticket_replies_ticket ON ticket_replies (ticket_id);
ALTER TABLE ticket_replies ADD FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE;

-- ============================================
-- NOTIFICATIONS & LOGS
-- ============================================

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL,
    admin_id BIGINT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(255),
    is_read SMALLINT DEFAULT 0,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_admin ON notifications (admin_id);
CREATE INDEX idx_notifications_read ON notifications (is_read);
ALTER TABLE notifications ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_type VARCHAR(20) DEFAULT 'user' CHECK (user_type IN ('user', 'admin')),
    user_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_activity_user ON activity_logs (user_type, user_id);
CREATE INDEX idx_activity_action ON activity_logs (action);
CREATE INDEX idx_activity_created ON activity_logs (created_at);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_admin ON audit_logs (admin_id);
CREATE INDEX idx_audit_action ON audit_logs (action);
CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs (created_at);

-- ============================================
-- COMPARE PRODUCTS
-- ============================================

CREATE TABLE compare_list (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- RETURNS & REFUNDS
-- ============================================

CREATE TABLE returns (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    return_number VARCHAR(50) NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_returns_order ON returns (order_id);
ALTER TABLE returns ADD FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE returns ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE return_items (
    id BIGSERIAL PRIMARY KEY,
    return_id BIGINT NOT NULL,
    order_item_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    reason TEXT,
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
);

CREATE TABLE refunds (
    id BIGSERIAL PRIMARY KEY,
    return_id BIGINT NULL,
    order_id BIGINT NOT NULL,
    payment_id BIGINT NULL,
    amount NUMERIC(12,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_refunds_return ON refunds (return_id);
CREATE INDEX idx_refunds_order ON refunds (order_id);
ALTER TABLE refunds ADD FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE SET NULL;
ALTER TABLE refunds ADD FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- ============================================
-- TRIGGERS (PostgreSQL PL/pgSQL)
-- ============================================

CREATE OR REPLACE FUNCTION update_product_rating_fn()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET avg_rating = (
        SELECT ROUND(AVG(rating::numeric), 2)::numeric(3,2)
        FROM reviews
        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND status = 'approved'
    ),
    review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND status = 'approved'
    )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating_fn();

CREATE OR REPLACE FUNCTION update_product_sales_fn()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET sales_count = sales_count + NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_sales_trigger
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_sales_fn();

CREATE OR REPLACE FUNCTION log_order_status_fn()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, status, comment, changed_by)
        VALUES (NEW.id, NEW.status, 'Status updated automatically', NULL);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_order_status_trigger
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_order_status_fn();

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Default Admin
INSERT INTO admins (name, email, password, role) VALUES
('Super Admin', 'admin@amirislaminiccollection.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin');

-- Default Settings
INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'Amir Islamic Collection', 'general'),
('site_tagline', 'Your Trusted Islamic Marketplace', 'general'),
('site_email', 'info@amirislaminiccollection.com', 'general'),
('site_phone', '+254712345678', 'general'),
('site_address', 'Nairobi, Kenya', 'general'),
('site_currency', 'KES', 'general'),
('site_currency_symbol', 'KSh', 'general'),
('site_tax_rate', '16', 'general'),
('site_maintenance', '0', 'general'),
('shipping_free_min', '5000', 'shipping'),
('social_facebook', '#', 'social'),
('social_twitter', '#', 'social'),
('social_instagram', '#', 'social'),
('social_youtube', '#', 'social'),
('social_tiktok', '#', 'social'),
('whatsapp_number', '+254712345678', 'social'),
('footer_description', 'Your trusted source for authentic Islamic products. We provide high-quality Qurans, Islamic books, clothing, attars, and more.', 'content'),
('footer_copyright', '© 2024 Amir Islamic Collection. All rights reserved.', 'content');

-- Default Shipping Methods
INSERT INTO shipping_methods (name, description, price, free_shipping_min, estimated_days, sort_order) VALUES
('Standard Shipping', 'Delivery within 5-7 business days', 200.00, 5000.00, '5-7 days', 1),
('Express Shipping', 'Delivery within 2-3 business days', 500.00, NULL, '2-3 days', 2),
('Same Day Delivery', 'Delivery within Nairobi', 1000.00, NULL, 'Same day', 3),
('Pickup Station', 'Pick up from our Nairobi store', 0.00, NULL, 'Ready in 1 hour', 4);

-- Default Tax Rates
INSERT INTO tax_rates (name, rate, type, applies_to) VALUES
('VAT', 16.00, 'percentage', 'all');

-- Default Blog Categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Islamic Knowledge', 'islamic-knowledge', 'Articles about Islamic teachings and knowledge'),
('Product Guides', 'product-guides', 'Guides to help you choose the right Islamic products'),
('Lifestyle', 'lifestyle', 'Islamic lifestyle and inspiration'),
('News', 'news', 'News and updates from Amir Islamic Collection');

-- Default FAQ
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('What payment methods do you accept?', 'We accept M-Pesa, bank transfers, and cash on delivery within Nairobi.', 'Payments', 1),
('How long does shipping take?', 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.', 'Shipping', 2),
('Can I return a product?', 'Yes, we accept returns within 7 days of delivery for unused products in original packaging.', 'Returns', 3),
('Do you offer international shipping?', 'Currently we ship within Kenya only. International shipping will be available soon.', 'Shipping', 4),
('How can I track my order?', 'You will receive a tracking number via SMS and email once your order is shipped.', 'Orders', 5);

-- Default Menus
INSERT INTO menus (name, location, items) VALUES
('Main Navigation', 'main', '[{"label":"Home","url":"\/","children":[]},{"label":"Shop","url":"\/shop","children":[]},{"label":"Qurans","url":"\/category\/qurans","children":[]},{"label":"Islamic Books","url":"\/category\/islamic-books","children":[]},{"label":"Clothing","url":"\/category\/islamic-clothing","children":[]},{"label":"Attars & Perfumes","url":"\/category\/attars-perfumes","children":[]},{"label":"Blog","url":"\/blog","children":[]},{"label":"Contact","url":"\/contact","children":[]}]'),
('Footer Quick Links', 'footer', '[{"label":"About Us","url":"\/about"},{"label":"Contact Us","url":"\/contact"},{"label":"FAQ","url":"\/faq"},{"label":"Terms & Conditions","url":"\/terms"},{"label":"Privacy Policy","url":"\/privacy-policy"},{"label":"Shipping Policy","url":"\/shipping-policy"},{"label":"Return Policy","url":"\/return-policy"}]');
