<?php

namespace App\Middleware;

class AdminMiddleware
{
    public function handle(): void
    {
        if (!isset($_SESSION['admin_id'])) {
            header('Location: ' . url('admin/login'));
            exit;
        }
    }
}
