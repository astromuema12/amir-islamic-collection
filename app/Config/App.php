<?php

namespace App\Config;

class App
{
    public static function init(): void
    {
        self::loadEnvironment();
        self::setErrorHandling();
        self::setSession();
    }

    private static function loadEnvironment(): void
    {
        $envFile = __DIR__ . '/../../.env';
        if (file_exists($envFile)) {
            $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
            $dotenv->safeLoad();
        }
    }

    private static function setErrorHandling(): void
    {
        if (($_ENV['APP_DEBUG'] ?? 'false') === 'true') {
            error_reporting(E_ALL);
            ini_set('display_errors', '1');
        } else {
            error_reporting(0);
            ini_set('display_errors', '0');
        }
        set_error_handler([self::class, 'handleError']);
        set_exception_handler([self::class, 'handleException']);
    }

    private static function setSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.use_strict_mode', 1);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_httponly', 1);
            ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));
            ini_set('session.cookie_samesite', 'Lax');
            ini_set('session.gc_maxlifetime', 86400);
            session_start();
        }
    }

    public static function handleError(int $severity, string $message, string $file, int $line): bool
    {
        if (!(error_reporting() & $severity)) {
            return false;
        }
        throw new \ErrorException($message, 0, $severity, $file, $line);
    }

    public static function handleException(\Throwable $exception): void
    {
        $logFile = __DIR__ . '/../../storage/logs/error-' . date('Y-m-d') . '.log';
        $message = date('Y-m-d H:i:s') . ' - ' . $exception->getMessage() . ' in ' . $exception->getFile() . ':' . $exception->getLine() . "\n" . $exception->getTraceAsString() . "\n\n";
        file_put_contents($logFile, $message, FILE_APPEND);

        if (($_ENV['APP_DEBUG'] ?? 'false') === 'true') {
            echo '<pre>';
            echo 'Error: ' . $exception->getMessage() . "\n";
            echo 'File: ' . $exception->getFile() . ':' . $exception->getLine() . "\n";
            echo 'Trace: ' . $exception->getTraceAsString();
            echo '</pre>';
        } else {
            http_response_code(500);
            require __DIR__ . '/../Views/Frontend/500.php';
        }
        exit;
    }
}
