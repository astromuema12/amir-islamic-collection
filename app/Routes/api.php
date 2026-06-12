<?php

use App\Config\Router;
use App\Controllers\Api\AuthApiController;
use App\Controllers\Api\ProductApiController;
use App\Controllers\Api\CartApiController;
use App\Controllers\Api\OrderApiController;
use App\Controllers\Api\MpesaApiController;
use App\Controllers\Api\WishlistApiController;
use App\Controllers\Api\ReviewApiController;
use App\Controllers\Api\CategoryApiController;
use App\Middleware\AuthMiddleware;

// API Routes - M-Pesa
Router::post('/api/mpesa/callback', MpesaApiController::class, 'callback');
Router::post('/api/mpesa/confirm', MpesaApiController::class, 'confirm');
Router::post('/api/mpesa/validate', MpesaApiController::class, 'validate');

// API Routes - Products
Router::get('/api/products', ProductApiController::class, 'index');
Router::get('/api/products/{id}', ProductApiController::class, 'show');
Router::get('/api/products/search', ProductApiController::class, 'search');
Router::get('/api/products/featured', ProductApiController::class, 'featured');
Router::get('/api/products/bestsellers', ProductApiController::class, 'bestsellers');

// API Routes - Categories
Router::get('/api/categories', CategoryApiController::class, 'index');
Router::get('/api/categories/{id}/products', CategoryApiController::class, 'products');

// API Routes - Auth
Router::post('/api/auth/login', AuthApiController::class, 'login');
Router::post('/api/auth/register', AuthApiController::class, 'register');
Router::post('/api/auth/logout', AuthApiController::class, 'logout', [AuthMiddleware::class]);
Router::get('/api/auth/user', AuthApiController::class, 'user', [AuthMiddleware::class]);

// API Routes - Cart
Router::get('/api/cart', CartApiController::class, 'index');
Router::post('/api/cart/add', CartApiController::class, 'add');
Router::post('/api/cart/update', CartApiController::class, 'update');
Router::post('/api/cart/remove', CartApiController::class, 'remove');

// API Routes - Orders
Router::post('/api/orders', OrderApiController::class, 'create', [AuthMiddleware::class]);
Router::get('/api/orders', OrderApiController::class, 'index', [AuthMiddleware::class]);
Router::get('/api/orders/{id}', OrderApiController::class, 'show', [AuthMiddleware::class]);

// API Routes - Wishlist
Router::get('/api/wishlist', WishlistApiController::class, 'index', [AuthMiddleware::class]);
Router::post('/api/wishlist/add', WishlistApiController::class, 'add', [AuthMiddleware::class]);
Router::post('/api/wishlist/remove', WishlistApiController::class, 'remove', [AuthMiddleware::class]);

// API Routes - Reviews
Router::get('/api/reviews/{productId}', ReviewApiController::class, 'index');
Router::post('/api/reviews', ReviewApiController::class, 'store', [AuthMiddleware::class]);

// API Routes - M-Pesa Payment
Router::post('/api/mpesa/pay', MpesaApiController::class, 'pay', [AuthMiddleware::class]);
Router::get('/api/mpesa/status/{checkoutRequestId}', MpesaApiController::class, 'status');
