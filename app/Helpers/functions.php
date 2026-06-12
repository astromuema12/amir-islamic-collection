<?php

if (!function_exists('view')) {
    function view(string $view, array $data = []): void
    {
        extract($data);
        $viewFile = VIEWS_PATH . '/' . $view . '.php';
        if (file_exists($viewFile)) {
            require $viewFile;
        } else {
            throw new \RuntimeException("View not found: {$view}");
        }
    }
}

if (!function_exists('csrf_token')) {
    function csrf_token(): string
    {
        if (empty($_SESSION[CSRF_TOKEN_NAME])) {
            $_SESSION[CSRF_TOKEN_NAME] = bin2hex(random_bytes(32));
            $_SESSION[CSRF_TOKEN_NAME . '_time'] = time();
        }
        return $_SESSION[CSRF_TOKEN_NAME];
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string
    {
        return '<input type="hidden" name="' . CSRF_TOKEN_NAME . '" value="' . csrf_token() . '">';
    }
}

if (!function_exists('verify_csrf')) {
    function verify_csrf(string $token): bool
    {
        if (empty($_SESSION[CSRF_TOKEN_NAME])) {
            return false;
        }
        $time = $_SESSION[CSRF_TOKEN_NAME . '_time'] ?? 0;
        if (time() - $time > CSRF_TOKEN_EXPIRY) {
            return false;
        }
        return hash_equals($_SESSION[CSRF_TOKEN_NAME], $token);
    }
}

if (!function_exists('old')) {
    function old(string $key, $default = '')
    {
        return $_SESSION['_old_input'][$key] ?? $default;
    }
}

if (!function_exists('error')) {
    function error(string $key): string
    {
        return $_SESSION['_errors'][$key] ?? '';
    }
}

if (!function_exists('has_error')) {
    function has_error(string $key): bool
    {
        return isset($_SESSION['_errors'][$key]);
    }
}

if (!function_exists('clear_old_input')) {
    function clear_old_input(): void
    {
        unset($_SESSION['_old_input']);
        unset($_SESSION['_errors']);
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string
    {
        return SITE_URL . '/assets/' . ltrim($path, '/');
    }
}

if (!function_exists('upload_url')) {
    function upload_url(string $path): string
    {
        return SITE_URL . '/uploads/' . ltrim($path, '/');
    }
}

if (!function_exists('url')) {
    function url(string $path = ''): string
    {
        return SITE_URL . '/' . ltrim($path, '/');
    }
}

if (!function_exists('route')) {
    function route(string $name, array $params = []): string
    {
        $routes = [
            'home' => '/',
            'shop' => '/shop',
            'cart' => '/cart',
            'checkout' => '/checkout',
            'login' => '/login',
            'register' => '/register',
            'dashboard' => '/dashboard',
            'wishlist' => '/wishlist',
            'contact' => '/contact',
            'about' => '/about',
            'faq' => '/faq',
            'blog' => '/blog',
        ];

        $route = $routes[$name] ?? '/';
        foreach ($params as $key => $value) {
            $route = str_replace('{' . $key . '}', $value, $route);
        }
        return url($route);
    }
}

if (!function_exists('format_price')) {
    function format_price(float $amount): string
    {
        return SITE_CURRENCY . ' ' . number_format($amount, 2);
    }
}

if (!function_exists('slugify')) {
    function slugify(string $text): string
    {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\w]+~', '', $text);
        $text = trim($text, '-');
        $text = preg_replace('~-+~', '-', $text);
        $text = strtolower($text);
        return empty($text) ? 'n-a' : $text;
    }
}

if (!function_exists('truncate')) {
    function truncate(string $text, int $length = 100, string $suffix = '...'): string
    {
        if (mb_strlen($text) <= $length) {
            return $text;
        }
        return mb_substr($text, 0, $length) . $suffix;
    }
}

if (!function_exists('time_ago')) {
    function time_ago(string $datetime): string
    {
        $timestamp = strtotime($datetime);
        $diff = time() - $timestamp;

        $intervals = [
            31536000 => 'year',
            2592000 => 'month',
            604800 => 'week',
            86400 => 'day',
            3600 => 'hour',
            60 => 'minute',
            1 => 'second'
        ];

        foreach ($intervals as $seconds => $label) {
            $count = floor($diff / $seconds);
            if ($count >= 1) {
                return $count . ' ' . $label . ($count > 1 ? 's' : '') . ' ago';
            }
        }
        return 'just now';
    }
}

if (!function_exists('generate_order_number')) {
    function generate_order_number(): string
    {
        return 'AIC-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('Ymd');
    }
}

if (!function_exists('generate_invoice_number')) {
    function generate_invoice_number(): string
    {
        return 'INV-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    }
}

if (!function_exists('is_admin')) {
function is_admin(): bool
{
    return isset($_SESSION['admin_id']) && in_array($_SESSION['admin_role'] ?? '', ['admin', 'superadmin', 'manager', 'support']);
}
}

if (!function_exists('is_logged_in')) {
    function is_logged_in(): bool
    {
        return isset($_SESSION['user_id']);
    }
}

if (!function_exists('get_cart_count')) {
    function get_cart_count(): int
    {
        if (isset($_SESSION['user_id'])) {
            try {
                $db = \App\Config\Database::getInstance()->getConnection();
                $stmt = $db->prepare("SELECT COUNT(*) as count FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?");
                $stmt->execute([$_SESSION['user_id']]);
                return (int) $stmt->fetch()->count;
            } catch (\Exception $e) {
                return 0;
            }
        }
        return count($_SESSION['guest_cart'] ?? []);
    }
}

if (!function_exists('get_wishlist_count')) {
    function get_wishlist_count(): int
    {
        if (isset($_SESSION['user_id'])) {
            try {
                $db = \App\Config\Database::getInstance()->getConnection();
                $stmt = $db->prepare("SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?");
                $stmt->execute([$_SESSION['user_id']]);
                return (int) $stmt->fetch()->count;
            } catch (\Exception $e) {
                return 0;
            }
        }
        return 0;
    }
}

if (!function_exists('get_setting')) {
    function get_setting(string $key, $default = ''): string
    {
        try {
            $db = \App\Config\Database::getInstance()->getConnection();
            $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
            $stmt->execute([$key]);
            $result = $stmt->fetch();
            return $result ? $result->setting_value : $default;
        } catch (\Exception $e) {
            return $default;
        }
    }
}

if (!function_exists('get_categories')) {
    function get_categories(): array
    {
        try {
            $db = \App\Config\Database::getInstance()->getConnection();
            $stmt = $db->query("SELECT * FROM categories WHERE status = 'active' ORDER BY sort_order ASC");
            return $stmt->fetchAll(\PDO::FETCH_OBJ);
        } catch (\Exception $e) {
            return [];
        }
    }
}

if (!function_exists('generate_meta_tags')) {
    function generate_meta_tags(array $data = []): string
    {
        $title = $data['title'] ?? SITE_NAME;
        $description = $data['description'] ?? 'Your Trusted Islamic Marketplace';
        $image = $data['image'] ?? asset('images/og-default.jpg');
        $url = $data['url'] ?? SITE_URL;

        $html = '<title>' . htmlspecialchars($title) . '</title>' . "\n";
        $html .= '<meta name="description" content="' . htmlspecialchars($description) . '">' . "\n";
        $html .= '<meta property="og:title" content="' . htmlspecialchars($title) . '">' . "\n";
        $html .= '<meta property="og:description" content="' . htmlspecialchars($description) . '">' . "\n";
        $html .= '<meta property="og:image" content="' . htmlspecialchars($image) . '">' . "\n";
        $html .= '<meta property="og:url" content="' . htmlspecialchars($url) . '">' . "\n";
        $html .= '<meta property="og:type" content="website">' . "\n";
        $html .= '<meta name="twitter:card" content="summary_large_image">' . "\n";
        $html .= '<meta name="twitter:title" content="' . htmlspecialchars($title) . '">' . "\n";
        $html .= '<meta name="twitter:description" content="' . htmlspecialchars($description) . '">' . "\n";
        $html .= '<meta name="twitter:image" content="' . htmlspecialchars($image) . '">' . "\n";

        return $html;
    }
}
