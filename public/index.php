<?php

/**
 * Front controller — single entry point for all requests.
 * Routes are handled via public/index.php?url=<path> from .htaccess rewrite.
 * Static files in public/ are served directly when they exist.
 */

// ---------------------------------------------------------------------------
// 1. Serve static files from public/ (CSS, JS, images, uploads)
// ---------------------------------------------------------------------------
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Compute the app subdirectory from the script location
$subdir = dirname(dirname($_SERVER['SCRIPT_NAME']));
if ($subdir === '/' || $subdir === '.' || $subdir === '\\') {
    $subdir = '';
}

// Strip subdirectory to get the relative file path
if ($subdir && strpos($requestPath, $subdir) === 0) {
    $relativePath = substr($requestPath, strlen($subdir));
} else {
    $relativePath = $requestPath;
}
$relativePath = ltrim(str_replace('\\', '/', $relativePath), '/');

if ($relativePath !== '' && $relativePath !== 'index.php') {
    $localFile = __DIR__ . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativePath);

    if (file_exists($localFile) && !is_dir($localFile)) {
        $ext = strtolower(pathinfo($localFile, PATHINFO_EXTENSION));
        $mimeMap = [
            'css' => 'text/css', 'js' => 'application/javascript',
            'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
            'gif' => 'image/gif', 'svg' => 'image/svg+xml', 'ico' => 'image/x-icon',
            'webp' => 'image/webp', 'woff' => 'font/woff', 'woff2' => 'font/woff2',
            'ttf' => 'font/ttf', 'eot' => 'application/vnd.ms-fontobject',
            'json' => 'application/json', 'pdf' => 'application/pdf',
            'xml' => 'application/xml',
        ];
        if (isset($mimeMap[$ext])) {
            header('Content-Type: ' . $mimeMap[$ext]);
            header('Cache-Control: public, max-age=2592000');
            readfile($localFile);
            exit;
        }
    }
}

// ---------------------------------------------------------------------------
// 2. Bootstrap the application
// ---------------------------------------------------------------------------
require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\App;
use App\Config\Constants;
use App\Config\Router;
use App\Config\Request;
use App\Config\Response;
use App\Config\Database;

App::init();
Constants::define();

require_once __DIR__ . '/../app/Helpers/functions.php';
require_once __DIR__ . '/../app/Routes/web.php';
require_once __DIR__ . '/../app/Routes/api.php';

$request = new Request();
$response = new Response();

$method = $request->method();
$uri = $request->uri();

// Maintenance mode check
$publicPrefixes = ['/assets', '/uploads', '/admin'];
$isPublic = false;
foreach ($publicPrefixes as $prefix) {
    if (strpos($uri, $prefix) === 0) {
        $isPublic = true;
        break;
    }
}

if (!$isPublic && $uri !== '/') {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM settings WHERE setting_key = 'site_maintenance' AND setting_value = '1'");
    $stmt->execute();
    $maintenance = $stmt->fetch()->count > 0;

    if ($maintenance && !isset($_SESSION['admin_id'])) {
        http_response_code(503);
        require VIEWS_PATH . '/Frontend/maintenance.php';
        exit;
    }
}

Router::dispatch($method, $uri);
