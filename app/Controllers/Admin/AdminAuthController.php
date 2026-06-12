<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Services\AuthService;

class AdminAuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function loginForm(Request $request, Response $response): void
    {
        if (isset($_SESSION['admin_id'])) {
            $response->redirect(url('admin'));
            return;
        }

        $response->render('Admin/login', [
            'page_title' => 'Admin Login - ' . SITE_NAME
        ]);
    }

    public function login(Request $request, Response $response): void
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $result = $this->authService->adminLogin($email, $password);

        if ($result['success']) {
            $response->redirect(url('admin'));
        } else {
            $_SESSION['error'] = $result['message'];
            $response->back();
        }
    }

    public function logout(Request $request, Response $response): void
    {
        $this->authService->adminLogout();
        $response->redirect(url('admin/'));
    }
}

