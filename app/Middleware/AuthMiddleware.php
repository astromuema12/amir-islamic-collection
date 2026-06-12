<?php

namespace App\Middleware;

class AuthMiddleware
{
    public function handle(): void
    {
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['_errors']['auth'] = 'Please login to continue';
            header('Location: ' . url('login'));
            exit;
        }
    }
}
