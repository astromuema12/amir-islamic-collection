<?php
/**
 * Data Migration Script: MySQL -> Supabase (PostgreSQL)
 * 
 * Run this script locally to export data from your existing MySQL database
 * and import it into your Supabase PostgreSQL database.
 * 
 * Usage: php database/migrate_to_supabase.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// ============================================
// MYSQL CONNECTION (source - your local XAMPP)
// ============================================
$mysqlHost = 'localhost';
$mysqlPort = '3306';
$mysqlDb   = 'amir_islamic_db';
$mysqlUser = 'root';
$mysqlPass = '';

echo "Connecting to MySQL...\n";
$mysqlDsn = "mysql:host={$mysqlHost};port={$mysqlPort};dbname={$mysqlDb};charset=utf8mb4";
$mysql = new PDO($mysqlDsn, $mysqlUser, $mysqlPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

// ============================================
// POSTGRESQL CONNECTION (target - Supabase)
// ============================================
$pgsqlHost = $_ENV['DB_HOST'] ?? 'localhost';
$pgsqlPort = $_ENV['DB_PORT'] ?? '5432';
$pgsqlDb   = $_ENV['DB_NAME'] ?? 'postgres';
$pgsqlUser = $_ENV['DB_USER'] ?? 'postgres';
$pgsqlPass = $_ENV['DB_PASS'] ?? '';

echo "Connecting to PostgreSQL (Supabase)...\n";
$pgsqlDsn = "pgsql:host={$pgsqlHost};port={$pgsqlPort};dbname={$pgsqlDb}";
$pgsql = new PDO($pgsqlDsn, $pgsqlUser, $pgsqlPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

// ============================================
// MIGRATION FUNCTION
// ============================================

function migrateTable(PDO $source, PDO $target, string $table, array $columns, ?string $orderBy = null, int $chunkSize = 500): int
{
    $colList = implode(', ', $columns);
    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
    
    $orderClause = $orderBy ? " ORDER BY {$orderBy}" : '';
    
    // Get total count
    $countStmt = $source->query("SELECT COUNT(*) as cnt FROM {$table}");
    $total = (int)$countStmt->fetch()['cnt'];
    echo "  {$table}: {$total} rows... ";
    
    $insertSQL = "INSERT INTO {$table} ({$colList}) VALUES ({$placeholders}) ON CONFLICT DO NOTHING";
    $insertStmt = $target->prepare($insertSQL);
    
    $offset = 0;
    $migrated = 0;
    
    while ($offset < $total) {
        $selectSQL = "SELECT {$colList} FROM {$table}{$orderClause} LIMIT {$chunkSize} OFFSET {$offset}";
        $rows = $source->query($selectSQL)->fetchAll();
        
        $target->beginTransaction();
        try {
            foreach ($rows as $row) {
                $values = [];
                foreach ($columns as $col) {
                    $values[] = $row[$col];
                }
                $insertStmt->execute($values);
                $migrated++;
            }
            $target->commit();
        } catch (Exception $e) {
            $target->rollBack();
            throw $e;
        }
        
        $offset += $chunkSize;
        echo ".";
    }
    
    echo " done ({$migrated} migrated)\n";
    return $migrated;
}

// ============================================
// RUN MIGRATION
// ============================================

echo "\n=== Starting data migration from MySQL to Supabase ===\n\n";

// Disable triggers temporarily for faster migration
$pgsql->exec("SET session_replication_role = 'replica'");

// Order matters due to foreign keys

$tables = [
    ['table' => 'admins',                'columns' => ['id', 'name', 'email', 'password', 'role', 'avatar', 'status', 'last_login_at', 'last_login_ip', 'created_at', 'updated_at']],
    ['table' => 'roles',                 'columns' => ['id', 'name', 'slug', 'description', 'created_at', 'updated_at']],
    ['table' => 'permissions',           'columns' => ['id', 'name', 'slug', 'description', 'created_at']],
    ['table' => 'role_permissions',      'columns' => ['role_id', 'permission_id']],
    ['table' => 'admin_roles',           'columns' => ['admin_id', 'role_id']],
    ['table' => 'users',                 'columns' => ['id', 'first_name', 'last_name', 'email', 'phone', 'password', 'avatar', 'email_verified_at', 'email_verification_token', 'remember_token', 'status', 'last_login_at', 'last_login_ip', 'referral_code', 'referred_by', 'created_at', 'updated_at']],
    ['table' => 'categories',            'columns' => ['id', 'parent_id', 'name', 'slug', 'description', 'icon', 'image', 'meta_title', 'meta_description', 'sort_order', 'status', 'created_at', 'updated_at']],
    ['table' => 'brands',                'columns' => ['id', 'name', 'slug', 'description', 'logo', 'website', 'status', 'sort_order', 'created_at', 'updated_at']],
    ['table' => 'tags',                  'columns' => ['id', 'name', 'slug', 'created_at']],
    ['table' => 'products',              'columns' => ['id', 'category_id', 'brand_id', 'name', 'slug', 'sku', 'barcode', 'short_description', 'description', 'price', 'sale_price', 'cost_price', 'discount_percent', 'stock_quantity', 'low_stock_threshold', 'weight', 'length', 'width', 'height', 'meta_title', 'meta_description', 'is_featured', 'is_bestseller', 'is_trending', 'is_new', 'is_digital', 'status', 'views_count', 'sales_count', 'avg_rating', 'review_count', 'sort_order', 'published_at', 'created_at', 'updated_at']],
    ['table' => 'product_images',        'columns' => ['id', 'product_id', 'image_path', 'alt_text', 'sort_order', 'is_primary', 'created_at']],
    ['table' => 'product_variants',      'columns' => ['id', 'product_id', 'name', 'sku', 'price', 'stock_quantity', 'weight', 'is_default', 'sort_order', 'created_at', 'updated_at']],
    ['table' => 'product_variant_attributes', 'columns' => ['id', 'variant_id', 'attribute_name', 'attribute_value']],
    ['table' => 'product_tags',          'columns' => ['product_id', 'tag_id']],
    ['table' => 'inventory_log',         'columns' => ['id', 'product_id', 'variant_id', 'quantity_change', 'new_quantity', 'reason', 'reference_type', 'reference_id', 'created_by', 'created_at']],
    ['table' => 'carts',                 'columns' => ['id', 'user_id', 'session_id', 'coupon_id', 'subtotal', 'discount', 'tax', 'shipping', 'total', 'created_at', 'updated_at']],
    ['table' => 'cart_items',            'columns' => ['id', 'cart_id', 'product_id', 'variant_id', 'quantity', 'unit_price', 'total_price', 'created_at']],
    ['table' => 'orders',                'columns' => ['id', 'order_number', 'user_id', 'email', 'phone', 'subtotal', 'discount', 'tax', 'shipping_cost', 'total', 'paid_amount', 'coupon_code', 'discount_type', 'discount_value', 'shipping_method_id', 'shipping_address_id', 'billing_address_id', 'notes', 'status', 'payment_status', 'payment_method', 'tracking_number', 'estimated_delivery', 'delivered_at', 'invoice_number', 'invoice_url', 'ip_address', 'user_agent', 'created_at', 'updated_at']],
    ['table' => 'order_items',           'columns' => ['id', 'order_id', 'product_id', 'product_name', 'product_sku', 'variant_name', 'quantity', 'unit_price', 'total_price', 'created_at']],
    ['table' => 'order_status_history',  'columns' => ['id', 'order_id', 'status', 'comment', 'changed_by', 'created_at']],
    ['table' => 'addresses',             'columns' => ['id', 'user_id', 'label', 'first_name', 'last_name', 'phone', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'is_default', 'created_at', 'updated_at']],
    ['table' => 'payments',              'columns' => ['id', 'order_id', 'payment_method', 'amount', 'transaction_id', 'receipt_number', 'phone_number', 'status', 'notes', 'created_at', 'updated_at']],
    ['table' => 'mpesa_transactions',    'columns' => ['id', 'order_id', 'payment_id', 'merchant_request_id', 'checkout_request_id', 'response_code', 'response_description', 'customer_message', 'result_code', 'result_description', 'amount', 'phone_number', 'mpesa_receipt_number', 'transaction_date', 'balance', 'status', 'raw_request', 'raw_response', 'raw_callback', 'created_at', 'updated_at']],
    ['table' => 'reviews',               'columns' => ['id', 'product_id', 'user_id', 'order_id', 'rating', 'title', 'comment', 'images', 'status', 'is_featured', 'helpful_count', 'created_at', 'updated_at']],
    ['table' => 'review_helpful',        'columns' => ['id', 'review_id', 'user_id', 'created_at']],
    ['table' => 'wishlists',             'columns' => ['id', 'user_id', 'product_id', 'created_at']],
    ['table' => 'recently_viewed',       'columns' => ['id', 'user_id', 'session_id', 'product_id', 'viewed_at']],
    ['table' => 'coupons',               'columns' => ['id', 'code', 'type', 'value', 'min_order_amount', 'max_discount', 'usage_limit', 'used_count', 'per_user_limit', 'applies_to', 'applies_to_id', 'starts_at', 'expires_at', 'is_active', 'created_at', 'updated_at']],
    ['table' => 'coupon_usage',          'columns' => ['id', 'coupon_id', 'user_id', 'order_id', 'discount_amount', 'used_at']],
    ['table' => 'shipping_methods',      'columns' => ['id', 'name', 'description', 'price', 'free_shipping_min', 'estimated_days', 'status', 'sort_order', 'created_at', 'updated_at']],
    ['table' => 'tax_rates',             'columns' => ['id', 'name', 'rate', 'type', 'applies_to', 'status', 'created_at', 'updated_at']],
    ['table' => 'blog_categories',       'columns' => ['id', 'name', 'slug', 'description', 'status', 'created_at', 'updated_at']],
    ['table' => 'blogs',                 'columns' => ['id', 'category_id', 'author_id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'tags', 'meta_title', 'meta_description', 'status', 'is_featured', 'views_count', 'published_at', 'created_at', 'updated_at']],
    ['table' => 'settings',              'columns' => ['id', 'setting_key', 'setting_value', 'setting_group', 'created_at', 'updated_at']],
    ['table' => 'site_content',          'columns' => ['id', 'page', 'section', 'title', 'subtitle', 'content', 'image', 'sort_order', 'status', 'created_at', 'updated_at']],
    ['table' => 'banners',               'columns' => ['id', 'title', 'subtitle', 'description', 'image', 'link', 'btn_text', 'sort_order', 'placement', 'status', 'created_at', 'updated_at']],
    ['table' => 'menus',                 'columns' => ['id', 'name', 'location', 'items', 'status', 'created_at', 'updated_at']],
    ['table' => 'faqs',                  'columns' => ['id', 'question', 'answer', 'category', 'sort_order', 'status', 'created_at', 'updated_at']],
    ['table' => 'contacts',              'columns' => ['id', 'name', 'email', 'phone', 'subject', 'message', 'is_read', 'replied_at', 'created_at']],
    ['table' => 'newsletter_subscribers','columns' => ['id', 'email', 'name', 'status', 'subscribed_at', 'unsubscribed_at']],
    ['table' => 'support_tickets',       'columns' => ['id', 'user_id', 'order_id', 'ticket_number', 'subject', 'message', 'priority', 'status', 'assigned_to', 'created_at', 'updated_at']],
    ['table' => 'ticket_replies',        'columns' => ['id', 'ticket_id', 'user_id', 'admin_id', 'message', 'attachments', 'created_at']],
    ['table' => 'notifications',         'columns' => ['id', 'user_id', 'admin_id', 'type', 'title', 'message', 'link', 'is_read', 'read_at', 'created_at']],
    ['table' => 'activity_logs',         'columns' => ['id', 'user_type', 'user_id', 'action', 'description', 'ip_address', 'user_agent', 'referrer', 'created_at']],
    ['table' => 'audit_logs',            'columns' => ['id', 'admin_id', 'action', 'entity_type', 'entity_id', 'old_values', 'new_values', 'ip_address', 'user_agent', 'created_at']],
    ['table' => 'compare_list',          'columns' => ['id', 'user_id', 'product_id', 'created_at']],
    ['table' => 'returns',               'columns' => ['id', 'order_id', 'user_id', 'return_number', 'reason', 'status', 'admin_notes', 'created_at', 'updated_at']],
    ['table' => 'return_items',          'columns' => ['id', 'return_id', 'order_item_id', 'quantity', 'reason']],
    ['table' => 'refunds',               'columns' => ['id', 'return_id', 'order_id', 'payment_id', 'amount', 'reason', 'status', 'processed_at', 'created_at', 'updated_at']],
];

$totalMigrated = 0;

foreach ($tables as $t) {
    try {
        $count = migrateTable($mysql, $pgsql, $t['table'], $t['columns']);
        $totalMigrated += $count;
    } catch (Exception $e) {
        echo "  ERROR migrating {$t['table']}: " . $e->getMessage() . "\n";
    }
}

// Re-enable triggers
$pgsql->exec("SET session_replication_role = 'origin'");

// Reset sequences
echo "\nResetting sequences...\n";
$seqStmt = $pgsql->query("
    SELECT sequence_name FROM information_schema.sequences 
    WHERE sequence_schema = 'public'
");
while ($seq = $seqStmt->fetch()) {
    $seqName = $seq['sequence_name'];
    $tableName = preg_replace('/_seq$/', '', $seqName);
    $pgsql->exec("SELECT setval('{$seqName}', COALESCE((SELECT MAX(id) FROM {$tableName}), 1))");
    echo "  Reset sequence: {$seqName}\n";
}

echo "\n=== Migration complete! {$totalMigrated} total rows migrated. ===\n";
