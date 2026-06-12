<?php

namespace App\Controllers\Admin;

use App\Config\Database;
use App\Config\Request;
use App\Config\Response;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Setting;

class AdminController
{
    public function dashboard(Request $request, Response $response): void
    {
        $totalRevenue = Order::raw("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'completed'")->fetch()->total;
        $totalOrders = Order::count();
        $totalCustomers = User::count();
        $totalProducts = Product::count();
        $pendingOrders = Order::raw("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")->fetch()->count;
        $lowStockProducts = Product::raw("SELECT COUNT(*) as count FROM products WHERE stock_quantity <= low_stock_threshold AND stock_quantity > 0")->fetch()->count;

        $recentOrders = Order::query("SELECT o.*, u.first_name, u.last_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10");
        $driver = \App\Config\Database::getInstance()->getDriver();
        $monthlyRevenue = Order::raw(
            $driver === 'pgsql'
                ? "SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COALESCE(SUM(total), 0) as revenue
                   FROM orders WHERE payment_status = 'completed' AND created_at >= CURRENT_TIMESTAMP - INTERVAL '6 months'
                   GROUP BY TO_CHAR(created_at, 'YYYY-MM')
                   ORDER BY month ASC"
                : "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COALESCE(SUM(total), 0) as revenue
                   FROM orders WHERE payment_status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                   GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                   ORDER BY month ASC"
        )->fetchAll(\PDO::FETCH_OBJ);

        $response->render('Admin/dashboard', [
            'page_title' => 'Dashboard - Admin',
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'totalCustomers' => $totalCustomers,
            'totalProducts' => $totalProducts,
            'pendingOrders' => $pendingOrders,
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
            'monthlyRevenue' => $monthlyRevenue
        ]);
    }

    public function toggleMaintenance(Request $request, Response $response): void
    {
        $current = get_setting('site_maintenance', '0');
        $stmt = \App\Config\Database::getInstance()->getConnection()->prepare(
            "UPDATE settings SET setting_value = ? WHERE setting_key = 'site_maintenance'"
        );
        $stmt->execute([$current === '1' ? '0' : '1']);

        $_SESSION['success'] = 'Maintenance mode ' . ($current === '1' ? 'disabled' : 'enabled');
        $response->back();
    }
}
