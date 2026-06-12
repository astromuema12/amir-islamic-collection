<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Services\AuthService;

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function loginForm(Request $request, Response $response): void
    {
        $response->render('Frontend/login', [
            'page_title' => 'Login - ' . SITE_NAME
        ]);
        clear_old_input();
    }

    public function login(Request $request, Response $response): void
    {
        $email = $request->input('email');
        $password = $request->input('password');
        $remember = (bool) $request->input('remember');

        if (!$email || !$password) {
            $response->withErrors(['auth' => 'Please fill in all fields'])->withInput()->back();
            return;
        }

        $result = $this->authService->login($email, $password, $remember);

        if (!$result['success']) {
            $response->withErrors(['auth' => $result['message']])->withInput()->back();
            return;
        }

        $redirect = $_SESSION['redirect_after_login'] ?? '/dashboard';
        unset($_SESSION['redirect_after_login']);
        $response->redirect($redirect);
    }

    public function registerForm(Request $request, Response $response): void
    {
        $response->render('Frontend/register', [
            'page_title' => 'Register - ' . SITE_NAME
        ]);
        clear_old_input();
    }

    public function register(Request $request, Response $response): void
    {
        $data = [
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'password' => $request->input('password'),
            'password_confirmation' => $request->input('password_confirmation'),
        ];

        $errors = [];

        if (empty($data['first_name']) || empty($data['last_name'])) {
            $errors['name'] = 'Name is required';
        }
        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Valid email is required';
        }
        if (empty($data['password']) || strlen($data['password']) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        }
        if ($data['password'] !== $data['password_confirmation']) {
            $errors['password'] = 'Passwords do not match';
        }

        if (!empty($errors)) {
            $response->withErrors($errors)->withInput()->back();
            return;
        }

        $result = $this->authService->register($data);

        if (!$result['success']) {
            $response->withErrors(['auth' => $result['message']])->withInput()->back();
            return;
        }

        $_SESSION['success'] = $result['message'];
        $response->redirect('/login');
    }

    public function logout(Request $request, Response $response): void
    {
        $this->authService->logout();
        $response->redirect('/');
    }

    public function verifyEmail(Request $request, Response $response): void
    {
        $token = $request->query('token');

        $user = \App\Models\User::findBy('email_verification_token', $token);
        if (!$user) {
            $_SESSION['error'] = 'Invalid verification token';
            $response->redirect('/login');
            return;
        }

        $user->verifyEmail();
        $_SESSION['success'] = 'Email verified successfully. You can now login.';
        $response->redirect('/login');
    }

    public function forgotPasswordForm(Request $request, Response $response): void
    {
        $response->render('Frontend/forgot-password', [
            'page_title' => 'Forgot Password - ' . SITE_NAME
        ]);
        clear_old_input();
    }

    public function forgotPassword(Request $request, Response $response): void
    {
        $email = $request->input('email');
        $result = $this->authService->sendPasswordResetEmail($email);
        $_SESSION['message'] = $result['message'];
        $response->back();
    }

    public function resetPasswordForm(Request $request, Response $response): void
    {
        $token = $request->query('token');
        if (!$token) {
            $response->redirect('/login');
            return;
        }

        $response->render('Frontend/reset-password', [
            'page_title' => 'Reset Password - ' . SITE_NAME,
            'token' => $token
        ]);
        clear_old_input();
    }

    public function resetPassword(Request $request, Response $response): void
    {
        $token = $request->input('token');
        $password = $request->input('password');

        if (strlen($password) < 8) {
            $response->withErrors(['password' => 'Password must be at least 8 characters'])->back();
            return;
        }

        $result = $this->authService->resetPassword($token, $password);

        if ($result['success']) {
            $_SESSION['success'] = $result['message'];
            $response->redirect('/login');
        } else {
            $response->withErrors(['auth' => $result['message']])->back();
        }
    }
}
