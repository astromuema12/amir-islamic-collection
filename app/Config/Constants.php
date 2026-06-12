<?php

namespace App\Config;

class Constants
{
    public static function define(): void
    {
        define('BASE_PATH', dirname(__DIR__, 2));
        define('APP_PATH', BASE_PATH . '/app');
        define('PUBLIC_PATH', BASE_PATH . '/public');
        define('STORAGE_PATH', BASE_PATH . '/storage');
        define('VIEWS_PATH', APP_PATH . '/Views');
        define('UPLOADS_PATH', PUBLIC_PATH . '/uploads');
        define('ASSETS_PATH', PUBLIC_PATH . '/assets');

        define('SITE_NAME', $_ENV['SITE_NAME'] ?? 'Amir Islamic Collection');
        define('SITE_EMAIL', $_ENV['SITE_EMAIL'] ?? 'info@amirislaminiccollection.com');
        define('SITE_PHONE', $_ENV['SITE_PHONE'] ?? '+254712345678');
        define('SITE_ADDRESS', $_ENV['SITE_ADDRESS'] ?? 'Nairobi, Kenya');
        define('SITE_CURRENCY', $_ENV['SITE_CURRENCY'] ?? 'KES');
        define('SITE_TAX', (float)($_ENV['SITE_TAX'] ?? 16));
        define('SITE_URL', $_ENV['APP_URL'] ?? 'http://localhost/amir_islamic_collection');

        define('CSRF_TOKEN_NAME', '_csrf_token');
        define('CSRF_TOKEN_EXPIRY', 3600);
    }
}
