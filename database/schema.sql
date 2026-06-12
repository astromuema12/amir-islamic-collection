-- ============================================
-- AMIR ISLAMIC COLLECTION - Database Schema
-- Your Trusted Islamic Marketplace
-- ============================================

CREATE DATABASE IF NOT EXISTS amir_islamic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE amir_islamic_db;

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    email_verified_at TIMESTAMP NULL,
    email_verification_token VARCHAR(100),
    remember_token VARCHAR(100),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    referral_code VARCHAR(50) UNIQUE,
    referred_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_status (status),
    INDEX idx_users_referral (referral_code),
    FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE admins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin', 'manager', 'support') DEFAULT 'admin',
    avatar VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admins_email (email),
    INDEX idx_admins_role (role)
) ENGINE=InnoDB;

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admin_roles (
    admin_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (admin_id, role_id),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- CATEGORIES & PRODUCTS
-- ============================================

CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    image VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_status (status),
    INDEX idx_categories_parent (parent_id),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE brands (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    logo VARCHAR(255),
    website VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_brands_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tags_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NULL,
    brand_id BIGINT UNSIGNED NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    short_description TEXT,
    description LONGTEXT,
    price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    sale_price DECIMAL(12,2) NULL,
    cost_price DECIMAL(12,2) NULL,
    discount_percent INT DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    weight DECIMAL(10,2) NULL,
    length DECIMAL(10,2) NULL,
    width DECIMAL(10,2) NULL,
    height DECIMAL(10,2) NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_featured TINYINT(1) DEFAULT 0,
    is_bestseller TINYINT(1) DEFAULT 0,
    is_trending TINYINT(1) DEFAULT 0,
    is_new TINYINT(1) DEFAULT 1,
    is_digital TINYINT(1) DEFAULT 0,
    status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
    views_count BIGINT UNSIGNED DEFAULT 0,
    sales_count BIGINT UNSIGNED DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_slug (slug),
    INDEX idx_products_sku (sku),
    INDEX idx_products_status (status),
    INDEX idx_products_category (category_id),
    INDEX idx_products_brand (brand_id),
    INDEX idx_products_featured (is_featured),
    INDEX idx_products_price (price),
    FULLTEXT idx_products_search (name, short_description, description),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE product_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_images_product (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_variants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    price DECIMAL(12,2) NULL,
    stock_quantity INT DEFAULT 0,
    weight DECIMAL(10,2) NULL,
    is_default TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_variants_product (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_variant_attributes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id BIGINT UNSIGNED NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_tags (
    product_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE inventory_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NULL,
    quantity_change INT NOT NULL,
    new_quantity INT NOT NULL,
    reason VARCHAR(255),
    reference_type VARCHAR(100),
    reference_id BIGINT UNSIGNED NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inventory_product (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- SHOPPING CART
-- ============================================

CREATE TABLE carts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    session_id VARCHAR(100),
    coupon_id BIGINT UNSIGNED NULL,
    subtotal DECIMAL(12,2) DEFAULT 0.00,
    discount DECIMAL(12,2) DEFAULT 0.00,
    tax DECIMAL(12,2) DEFAULT 0.00,
    shipping DECIMAL(12,2) DEFAULT 0.00,
    total DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_carts_user (user_id),
    INDEX idx_carts_session (session_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cart_items_cart (cart_id),
    INDEX idx_cart_items_product (product_id),
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- ORDERS & CHECKOUT
-- ============================================

CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(12,2) DEFAULT 0.00,
    tax DECIMAL(12,2) DEFAULT 0.00,
    shipping_cost DECIMAL(12,2) DEFAULT 0.00,
    total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    discount_type ENUM('percentage', 'fixed') NULL,
    discount_value DECIMAL(12,2) DEFAULT 0.00,
    shipping_method_id BIGINT UNSIGNED NULL,
    shipping_address_id BIGINT UNSIGNED NULL,
    billing_address_id BIGINT UNSIGNED NULL,
    notes TEXT,
    status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'returned', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    delivered_at TIMESTAMP NULL,
    invoice_number VARCHAR(50),
    invoice_url VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_number (order_number),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_payment (payment_status),
    INDEX idx_orders_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    product_sku VARCHAR(100),
    variant_name VARCHAR(255),
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE order_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(50) NOT NULL,
    comment TEXT,
    changed_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status_history_order (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- ADDRESSES
-- ============================================

CREATE TABLE addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
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
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_addresses_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- PAYMENTS & MPESA
-- ============================================

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_id VARCHAR(255),
    receipt_number VARCHAR(100),
    phone_number VARCHAR(20),
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_transaction (transaction_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE mpesa_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NULL,
    payment_id BIGINT UNSIGNED NULL,
    merchant_request_id VARCHAR(100),
    checkout_request_id VARCHAR(100) UNIQUE,
    response_code VARCHAR(10),
    response_description TEXT,
    customer_message TEXT,
    result_code VARCHAR(10),
    result_description TEXT,
    amount DECIMAL(12,2),
    phone_number VARCHAR(20),
    mpesa_receipt_number VARCHAR(100),
    transaction_date VARCHAR(20),
    balance DECIMAL(12,2),
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    raw_request TEXT,
    raw_response TEXT,
    raw_callback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mpesa_order (order_id),
    INDEX idx_mpesa_checkout (checkout_request_id),
    INDEX idx_mpesa_receipt (mpesa_receipt_number),
    INDEX idx_mpesa_phone (phone_number),
    INDEX idx_mpesa_status (status),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_featured TINYINT(1) DEFAULT 0,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reviews_product (product_id),
    INDEX idx_reviews_user (user_id),
    INDEX idx_reviews_status (status),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE review_helpful (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_review_user (review_id, user_id),
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- WISHLIST & FAVORITES
-- ============================================

CREATE TABLE wishlists (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_wishlist_user_product (user_id, product_id),
    INDEX idx_wishlists_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE recently_viewed (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    session_id VARCHAR(100),
    product_id BIGINT UNSIGNED NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recent_user (user_id),
    INDEX idx_recent_session (session_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- COUPONS
-- ============================================

CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    min_order_amount DECIMAL(12,2) DEFAULT 0.00,
    max_discount DECIMAL(12,2) NULL,
    usage_limit INT DEFAULT 0,
    used_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1,
    applies_to ENUM('all', 'category', 'product') DEFAULT 'all',
    applies_to_id BIGINT UNSIGNED NULL,
    starts_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE coupon_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    discount_amount DECIMAL(12,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coupon_usage_coupon (coupon_id),
    INDEX idx_coupon_usage_user (user_id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- SHIPPING & TAX
-- ============================================

CREATE TABLE shipping_methods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    free_shipping_min DECIMAL(12,2) NULL,
    estimated_days VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tax_rates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    applies_to ENUM('all', 'shipping') DEFAULT 'all',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- BLOG
-- ============================================

CREATE TABLE blog_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blog_categories_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE blogs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NULL,
    author_id BIGINT UNSIGNED NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(255),
    tags VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured TINYINT(1) DEFAULT 0,
    views_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blogs_slug (slug),
    INDEX idx_blogs_status (status),
    INDEX idx_blogs_category (category_id),
    INDEX idx_blogs_author (author_id),
    FULLTEXT idx_blogs_search (title, excerpt, content),
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

CREATE TABLE settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_group VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_settings_key (setting_key),
    INDEX idx_settings_group (setting_group)
) ENGINE=InnoDB;

CREATE TABLE site_content (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content LONGTEXT,
    image VARCHAR(255),
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_page_section (page, section),
    INDEX idx_site_content_page (page)
) ENGINE=InnoDB;

CREATE TABLE banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    btn_text VARCHAR(100),
    sort_order INT DEFAULT 0,
    placement ENUM('hero', 'promo', 'sidebar') DEFAULT 'hero',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE menus (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL,
    items LONGTEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_menus_location (location)
) ENGINE=InnoDB;

CREATE TABLE faqs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer LONGTEXT NOT NULL,
    category VARCHAR(100),
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE contacts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contacts_read (is_read)
) ENGINE=InnoDB;

-- ============================================
-- NEWSLETTER
-- ============================================

CREATE TABLE newsletter_subscribers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(200),
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    INDEX idx_newsletter_email (email),
    INDEX idx_newsletter_status (status)
) ENGINE=InnoDB;

-- ============================================
-- SUPPORT TICKETS
-- ============================================

CREATE TABLE support_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'waiting', 'resolved', 'closed') DEFAULT 'open',
    assigned_to BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tickets_user (user_id),
    INDEX idx_tickets_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE ticket_replies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    admin_id BIGINT UNSIGNED NULL,
    message TEXT NOT NULL,
    attachments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket_replies_ticket (ticket_id),
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- NOTIFICATIONS & LOGS
-- ============================================

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    admin_id BIGINT UNSIGNED NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(255),
    is_read TINYINT(1) DEFAULT 0,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_admin (admin_id),
    INDEX idx_notifications_read (is_read),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('user', 'admin') DEFAULT 'user',
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_user (user_type, user_id),
    INDEX idx_activity_action (action),
    INDEX idx_activity_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT UNSIGNED NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_admin (admin_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- COMPARE PRODUCTS
-- ============================================

CREATE TABLE compare_list (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_compare_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- RETURNS & REFUNDS
-- ============================================

CREATE TABLE returns (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    return_number VARCHAR(50) NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'processing', 'completed') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_returns_order (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE return_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    return_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    reason TEXT,
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE refunds (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    return_id BIGINT UNSIGNED NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    payment_id BIGINT UNSIGNED NULL,
    amount DECIMAL(12,2) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_refunds_return (return_id),
    INDEX idx_refunds_order (order_id),
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- INDEXES & TRIGGERS
-- ============================================

DELIMITER //

CREATE TRIGGER update_product_rating AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products p
    SET p.avg_rating = (
        SELECT ROUND(AVG(rating), 2)
        FROM reviews
        WHERE product_id = NEW.product_id AND status = 'approved'
    ),
    p.review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = NEW.product_id AND status = 'approved'
    )
    WHERE p.id = NEW.product_id;
END//

CREATE TRIGGER update_product_rating_update AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products p
    SET p.avg_rating = (
        SELECT ROUND(AVG(rating), 2)
        FROM reviews
        WHERE product_id = NEW.product_id AND status = 'approved'
    ),
    p.review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = NEW.product_id AND status = 'approved'
    )
    WHERE p.id = NEW.product_id;
END//

CREATE TRIGGER update_product_sales AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET sales_count = sales_count + NEW.quantity
    WHERE id = NEW.product_id;
END//

CREATE TRIGGER log_order_status AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO order_status_history (order_id, status, comment, changed_by)
        VALUES (NEW.id, NEW.status, 'Status updated automatically', NULL);
    END IF;
END//

DELIMITER ;

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

-- Default FAQ Categories
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('What payment methods do you accept?', 'We accept M-Pesa, bank transfers, and cash on delivery within Nairobi.', 'Payments', 1),
('How long does shipping take?', 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.', 'Shipping', 2),
('Can I return a product?', 'Yes, we accept returns within 7 days of delivery for unused products in original packaging.', 'Returns', 3),
('Do you offer international shipping?', 'Currently we ship within Kenya only. International shipping will be available soon.', 'Shipping', 4),
('How can I track my order?', 'You will receive a tracking number via SMS and email once your order is shipped.', 'Orders', 5);

-- Default Blog Categories
INSERT INTO blog_categories (name, slug) VALUES
('Islamic Knowledge', 'islamic-knowledge'),
('Product Guides', 'product-guides'),
('Lifestyle', 'lifestyle'),
('News & Updates', 'news-updates');

-- Default Menus
INSERT INTO menus (name, location, items) VALUES
('Main Navigation', 'main', '[{"label":"Home","url":"\/","children":[]},{"label":"Shop","url":"\/shop","children":[]},{"label":"Qurans","url":"\/category\/qurans","children":[]},{"label":"Islamic Books","url":"\/category\/islamic-books","children":[]},{"label":"Clothing","url":"\/category\/islamic-clothing","children":[]},{"label":"Attars & Perfumes","url":"\/category\/attars-perfumes","children":[]},{"label":"Blog","url":"\/blog","children":[]},{"label":"Contact","url":"\/contact","children":[]}]'),
('Footer Quick Links', 'footer', '[{"label":"About Us","url":"\/about"},{"label":"Contact Us","url":"\/contact"},{"label":"FAQ","url":"\/faq"},{"label":"Terms & Conditions","url":"\/terms"},{"label":"Privacy Policy","url":"\/privacy-policy"},{"label":"Shipping Policy","url":"\/shipping-policy"},{"label":"Return Policy","url":"\/return-policy"}]');
