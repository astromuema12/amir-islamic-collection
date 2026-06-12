<?php

namespace App\Middleware;

use App\Config\Request;

class CsrfMiddleware
{
    public function handle(): void
    {
        $request = new Request();
        if ($request->isPost()) {
            $token = $request->input(CSRF_TOKEN_NAME);
            if (!$token || !verify_csrf($token)) {
                $_SESSION['_errors']['csrf'] = 'Invalid or expired token. Please try again.';
                $request->isAjax()
                    ? die(json_encode(['error' => 'Invalid CSRF token']))
                    : header('Location: ' . $_SERVER['HTTP_REFERER'] ?? SITE_URL);
                exit;
            }
        }
    }
}
