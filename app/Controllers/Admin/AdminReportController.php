<?php

namespace App\Controllers\Admin;

use App\Config\Database;
use App\Config\Request;
use App\Config\Response;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class AdminReportController
{
    public function index(Request $request, Response $response): void
    {
        $response->redirect(url('admin/reports/sales'));
    }

    public function sales(Request $request, Response $response): void
    {
        $period = $request->query('period', 'month');
        $interval = $period === 'year' ? 12 : 1;
        $months = $period === 'year' ? 12 : 6;

        $driver = \App\Config\Database::getInstance()->getDriver();
        $salesData = Order::raw(
            $driver === 'pgsql'
                ? "SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue
                   FROM orders
                   WHERE payment_status = 'completed' AND created_at >= CURRENT_TIMESTAMP - INTERVAL '{$months} months'
                   GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
                   ORDER BY date ASC"
                : "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue
                   FROM orders
                   WHERE payment_status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL {$months} MONTH)
                   GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
                   ORDER BY date ASC"
        )->fetchAll(\PDO::FETCH_OBJ);

        $topProducts = Product::query("SELECT * FROM products ORDER BY sales_count DESC LIMIT 10");

        $response->render('Admin/reports/sales', [
            'page_title' => 'Sales Reports - Admin',
            'salesData' => $salesData,
            'topProducts' => $topProducts,
            'period' => $period
        ]);
    }

    public function revenue(Request $request, Response $response): void
    {
        $totalRevenue = Order::raw("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'completed'")->fetch()->total;
        $driver = \App\Config\Database::getInstance()->getDriver();
        $monthlyRevenue = Order::raw(
            $driver === 'pgsql'
                ? "SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COALESCE(SUM(total), 0) as revenue
                   FROM orders WHERE payment_status = 'completed' AND created_at >= CURRENT_TIMESTAMP - INTERVAL '12 months'
                   GROUP BY TO_CHAR(created_at, 'YYYY-MM')
                   ORDER BY month ASC"
                : "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COALESCE(SUM(total), 0) as revenue
                   FROM orders WHERE payment_status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                   GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                   ORDER BY month ASC"
        )->fetchAll(\PDO::FETCH_OBJ);

        $response->render('Admin/reports/revenue', [
            'page_title' => 'Revenue Reports - Admin',
            'totalRevenue' => $totalRevenue,
            'monthlyRevenue' => $monthlyRevenue
        ]);
    }
}
