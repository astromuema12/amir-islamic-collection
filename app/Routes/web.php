<?php

use App\Config\Router;
use App\Controllers\HomeController;
use App\Controllers\ShopController;
use App\Controllers\AuthController;
use App\Controllers\CartController;
use App\Controllers\CheckoutController;
use App\Controllers\WishlistController;
use App\Controllers\BlogController;
use App\Controllers\PageController;
use App\Controllers\DashboardController;
use App\Controllers\ProductController;
use App\Controllers\Admin\AdminController;
use App\Controllers\Admin\AdminAuthController;
use App\Controllers\Admin\AdminProductController;
use App\Controllers\Admin\AdminOrderController;
use App\Controllers\Admin\AdminCustomerController;
use App\Controllers\Admin\AdminCategoryController;
use App\Controllers\Admin\AdminBrandController;
use App\Controllers\Admin\AdminBlogController;
use App\Controllers\Admin\AdminCouponController;
use App\Controllers\Admin\AdminReportController;
use App\Controllers\Admin\AdminSettingController;
use App\Controllers\Admin\AdminReviewController;
use App\Controllers\Admin\AdminTicketController;
use App\Controllers\Admin\AdminBannerController;
use App\Controllers\Admin\AdminNewsletterController;
use App\Controllers\Admin\AdminCmsController;
use App\Middleware\AuthMiddleware;
use App\Middleware\AdminMiddleware;
use App\Middleware\GuestMiddleware;

// Public Routes
Router::get('/', HomeController::class, 'index');
Router::get('/shop', ShopController::class, 'index');
Router::get('/shop/{category}', ShopController::class, 'category');
Router::get('/product/{slug}', ProductController::class, 'show');
Router::get('/deals', ShopController::class, 'deals');
Router::get('/search', ShopController::class, 'search');

// Cart Routes (Public)
Router::get('/cart', CartController::class, 'index');
Router::post('/cart/add', CartController::class, 'add');
Router::post('/cart/update', CartController::class, 'update');
Router::post('/cart/remove', CartController::class, 'remove');
Router::post('/cart/apply-coupon', CartController::class, 'applyCoupon');
Router::post('/cart/remove-coupon', CartController::class, 'removeCoupon');

// Auth Routes
Router::get('/login', AuthController::class, 'loginForm', [GuestMiddleware::class]);
Router::post('/login', AuthController::class, 'login', [GuestMiddleware::class]);
Router::get('/register', AuthController::class, 'registerForm', [GuestMiddleware::class]);
Router::post('/register', AuthController::class, 'register', [GuestMiddleware::class]);
Router::get('/verify-email', AuthController::class, 'verifyEmail');
Router::get('/forgot-password', AuthController::class, 'forgotPasswordForm');
Router::post('/forgot-password', AuthController::class, 'forgotPassword');
Router::get('/reset-password', AuthController::class, 'resetPasswordForm');
Router::post('/reset-password', AuthController::class, 'resetPassword');
Router::post('/logout', AuthController::class, 'logout');

// Checkout Routes
Router::get('/checkout', CheckoutController::class, 'index');
Router::post('/checkout/process', CheckoutController::class, 'process');
Router::get('/checkout/success/{orderId}', CheckoutController::class, 'success');
Router::get('/checkout/cancel/{orderId}', CheckoutController::class, 'cancel');

// Wishlist Routes
Router::get('/wishlist', WishlistController::class, 'index', [AuthMiddleware::class]);
Router::post('/wishlist/add', WishlistController::class, 'add', [AuthMiddleware::class]);
Router::post('/wishlist/remove', WishlistController::class, 'remove', [AuthMiddleware::class]);

// User Dashboard Routes
Router::get('/dashboard', DashboardController::class, 'index', [AuthMiddleware::class]);
Router::get('/dashboard/orders', DashboardController::class, 'orders', [AuthMiddleware::class]);
Router::get('/dashboard/orders/{id}', DashboardController::class, 'orderDetail', [AuthMiddleware::class]);
Router::get('/dashboard/profile', DashboardController::class, 'profile', [AuthMiddleware::class]);
Router::post('/dashboard/profile', DashboardController::class, 'updateProfile', [AuthMiddleware::class]);
Router::get('/dashboard/addresses', DashboardController::class, 'addresses', [AuthMiddleware::class]);
Router::post('/dashboard/addresses', DashboardController::class, 'addAddress', [AuthMiddleware::class]);
Router::post('/dashboard/addresses/{id}/delete', DashboardController::class, 'deleteAddress', [AuthMiddleware::class]);
Router::get('/dashboard/wishlist', DashboardController::class, 'wishlist', [AuthMiddleware::class]);
Router::get('/dashboard/reviews', DashboardController::class, 'reviews', [AuthMiddleware::class]);
Router::post('/dashboard/reviews', DashboardController::class, 'addReview', [AuthMiddleware::class]);
Router::get('/dashboard/tickets', DashboardController::class, 'tickets', [AuthMiddleware::class]);
Router::post('/dashboard/tickets', DashboardController::class, 'createTicket', [AuthMiddleware::class]);
Router::get('/dashboard/tickets/{id}', DashboardController::class, 'ticketDetail', [AuthMiddleware::class]);
Router::post('/dashboard/tickets/{id}/reply', DashboardController::class, 'replyTicket', [AuthMiddleware::class]);
Router::get('/dashboard/notifications', DashboardController::class, 'notifications', [AuthMiddleware::class]);
Router::post('/dashboard/notifications/read/{id}', DashboardController::class, 'markNotificationRead', [AuthMiddleware::class]);
Router::post('/dashboard/notifications/read-all', DashboardController::class, 'markAllNotificationsRead', [AuthMiddleware::class]);

// Blog Routes
Router::get('/blog', BlogController::class, 'index');
Router::get('/blog/{slug}', BlogController::class, 'show');
Router::get('/blog/category/{slug}', BlogController::class, 'category');

// Page Routes
Router::get('/about', PageController::class, 'about');
Router::get('/contact', PageController::class, 'contact');
Router::post('/contact', PageController::class, 'sendContact');
Router::get('/faq', PageController::class, 'faq');
Router::get('/terms', PageController::class, 'terms');
Router::get('/privacy-policy', PageController::class, 'privacy');
Router::get('/shipping-policy', PageController::class, 'shipping');
Router::get('/return-policy', PageController::class, 'returns');
Router::post('/newsletter', PageController::class, 'newsletter');
Router::get('/track-order', PageController::class, 'trackOrder');
Router::post('/track-order', PageController::class, 'trackOrderLookup');

// Admin Routes
Router::get('/admin/login', AdminAuthController::class, 'loginForm');
Router::post('/admin/login', AdminAuthController::class, 'login');
Router::post('/admin/logout', AdminAuthController::class, 'logout');

Router::get('/admin', AdminController::class, 'dashboard', [AdminMiddleware::class]);
Router::get('/admin/dashboard', AdminController::class, 'dashboard', [AdminMiddleware::class]);

// Admin Products
Router::get('/admin/products', AdminProductController::class, 'index', [AdminMiddleware::class]);
Router::get('/admin/products/create', AdminProductController::class, 'create', [AdminMiddleware::class]);
Router::post('/admin/products/store', AdminProductController::class, 'store', [AdminMiddleware::class]);
Router::get('/admin/products/edit/{id}', AdminProductController::class, 'edit', [AdminMiddleware::class]);
Router::post('/admin/products/update/{id}', AdminProductController::class, 'update', [AdminMiddleware::class]);
Router::post('/admin/products/delete/{id}', AdminProductController::class, 'delete', [AdminMiddleware::class]);

// Admin Categories
Router::get('/admin/categories', AdminCategoryController::class, 'index', [AdminMiddleware::class]);
Router::get('/admin/categories/create', AdminCategoryController::class, 'create', [AdminMiddleware::class]);
Router::post('/admin/categories/store', AdminCategoryController::class, 'store', [AdminMiddleware::class]);
Router::get('/admin/categories/edit/{id}', AdminCategoryController::class, 'edit', [AdminMiddleware::class]);
Router::post('/admin/categories/update/{id}', AdminCategoryController::class, 'update', [AdminMiddleware::class]);
Router::post('/admin/categories/delete/{id}', AdminCategoryController::class, 'delete', [AdminMiddleware::class]);

// Admin Brands
Router::get('/admin/brands', AdminBrandController::class, 'index', [AdminMiddleware::class]);
Router::post('/admin/brands/store', AdminBrandController::class, 'store', [AdminMiddleware::class]);
Router::post('/admin/brands/update/{id}', AdminBrandController::class, 'update', [AdminMiddleware::class]);
Router::post('/admin/brands/delete/{id}', AdminBrandController::class, 'delete', [AdminMiddleware::class]);

// Admin Orders
Router::get('/admin/orders', AdminOrderController::class, 'index', [AdminMiddleware::class]);
Router::get('/admin/orders/{id}', AdminOrderController::class, 'show', [AdminMiddleware::class]);
Router::post('/admin/orders/{id}/status', AdminOrderController::class, 'updateStatus', [AdminMiddleware::class]);

// Admin Customers
Router::get('/admin/customers', AdminCustomerController::class, 'index', [AdminMiddleware::class]);
Router::get('/admin/customers/{id}', AdminCustomerController::class, 'show', [AdminMiddleware::class]);
Router::post('/admin/customers/{id}/status', AdminCustomerController::class, 'updateStatus', [AdminMiddleware::class]);

// Admin Reviews
Router::get('/admin/reviews', AdminReviewController::class, 'index', [AdminMiddleware::class]);
Router::post('/admin/reviews/{id}/approve', AdminReviewController::class, 'approve', [AdminMiddleware::class]);
Router::post('/admin/reviews/{id}/reject', AdminReviewController::class, 'reject', [AdminMiddleware::class]);
Router::post('/admin/reviews/{id}/delete', AdminReviewController::class, 'delete', [AdminMiddleware::class]);

// Admin Blog
Router::get('/admin/blogs', AdminBlogController::class, 'index', [AdminMiddleware::class]);
Router::get('/admin/blogs/create', AdminBlogController::class, 'create', [AdminMiddleware::class]);
Router::post('/admin/blogs/store', AdminBlogController::class, 'store', [AdminMiddleware::class]);
Router::get('/admin/blogs/edit/{id}', AdminBlogController::class, 'edit', [AdminMiddleware::class]);
Router::post('/admin/blogs/update/{id}', AdminBlogController::class, 'update', [AdminMiddleware::class]);
Router::post('/admin/blogs/delete/{id}', AdminBlogController::class, 'delete', [AdminMiddleware::class]);

// Admin Coupons
Router::get('/admin/coupons', AdminCouponController::class, 'index', [AdminMiddleware::class]);
Router::post('/admin/coupons/store', AdminCouponController::class, 'store', [AdminMiddleware::class]);
Router::post('/admin/coupons/update/{id}', AdminCouponController::class, 'update', [AdminMiddleware::class]);
Router::post('/admin/coupons/delete/{id}', AdminCouponController::class, 'delete', [AdminMiddleware::class]);

// Admin Reports
Router::get('/admin/reports', AdminReportController::class, 'index', [AdminMiddleware::class]);
Router::get('/admin/reports/sales', AdminReportController::class, 'sales', [AdminMiddleware::class]);
Router::get('/admin/reports/revenue', AdminReportController::class, 'revenue', [AdminMiddleware::class]);

// Admin Settings
Router::get('/admin/settings', AdminSettingController::class, 'index', [AdminMiddleware::class]);
Router::post('/admin/settings', AdminSettingController::class, 'update', [AdminMiddleware::class]);

// Admin Tickets
Router::get('/admin/tickets', AdminTicketController::class, 'index', [AdminMiddleware::class]);
Router::get('/admin/tickets/{id}', AdminTicketController::class, 'show', [AdminMiddleware::class]);
Router::post('/admin/tickets/{id}/reply', AdminTicketController::class, 'reply', [AdminMiddleware::class]);
Router::post('/admin/tickets/{id}/status', AdminTicketController::class, 'updateStatus', [AdminMiddleware::class]);

// Admin CMS
Router::get('/admin/banners', AdminBannerController::class, 'index', [AdminMiddleware::class]);
Router::post('/admin/banners/store', AdminBannerController::class, 'store', [AdminMiddleware::class]);
Router::post('/admin/banners/delete/{id}', AdminBannerController::class, 'delete', [AdminMiddleware::class]);

Router::get('/admin/cms', AdminCmsController::class, 'index', [AdminMiddleware::class]);
Router::post('/admin/cms/update', AdminCmsController::class, 'update', [AdminMiddleware::class]);

Router::get('/admin/newsletter', AdminNewsletterController::class, 'index', [AdminMiddleware::class]);
Router::post('/admin/newsletter/send', AdminNewsletterController::class, 'sendCampaign', [AdminMiddleware::class]);

// Admin Maintenance
Router::post('/admin/maintenance', AdminController::class, 'toggleMaintenance', [AdminMiddleware::class]);
