<?php

namespace App\Middleware;

class GuestMiddleware
{
    public function handle(): void
    {
        if (isset($_SESSION['user_id'])) {
            header('Location: ' . url('dashboard'));
            exit;
        }
    }
}
