<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Services\AuthService;
use App\Models\User;

class AuthApiController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            $response->json(['error' => 'Email and password are required'], 400);
            return;
        }

        $result = $this->authService->login($email, $password);

        if (!$result['success']) {
            $response->json(['error' => $result['message']], 401);
            return;
        }

        $response->json([
            'success' => true,
            'user' => $result['user']->toArray(),
            'token' => session_id()
        ]);
    }

    public function register(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $result = $this->authService->register($data);

        if (!$result['success']) {
            $response->json(['error' => $result['message']], 400);
            return;
        }

        $response->json([
            'success' => true,
            'message' => $result['message']
        ]);
    }

    public function logout(Request $request, Response $response): void
    {
        $this->authService->logout();
        $response->json(['success' => true, 'message' => 'Logged out']);
    }

    public function user(Request $request, Response $response): void
    {
        $user = User::find($_SESSION['user_id']);
        if (!$user) {
            $response->json(['error' => 'Not authenticated'], 401);
            return;
        }

        $response->json(['success' => true, 'user' => $user->toArray()]);
    }
}
