<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\User;

class AdminCustomerController
{
    public function index(Request $request, Response $response): void
    {
        $search = $request->query('search', '');
        $page = (int)($request->query('page', 1));
        $limit = 20;
        $offset = ($page - 1) * $limit;

        if ($search) {
            $customers = User::query(
                "SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
                ["%{$search}%", "%{$search}%", "%{$search}%", $limit, $offset]
            );
            $countStmt = User::raw(
                "SELECT COUNT(*) as total FROM users WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?",
                ["%{$search}%", "%{$search}%", "%{$search}%"]
            );
        } else {
            $customers = User::query("SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?", [$limit, $offset]);
            $countStmt = User::raw("SELECT COUNT(*) as total FROM users");
        }

        $total = (int) $countStmt->fetch()->total;

        $response->render('Admin/customers/index', [
            'page_title' => 'Customers - Admin',
            'customers' => $customers,
            'currentPage' => $page,
            'totalPages' => (int) ceil($total / $limit),
            'search' => $search
        ]);
    }

    public function show(Request $request, Response $response, string $id): void
    {
        $customer = User::find((int)$id);
        if (!$customer) {
            $response->redirect(url('admin/'));
            return;
        }

        $orders = \App\Models\Order::getByUser($customer->id);

        $response->render('Admin/customers/show', [
            'page_title' => 'Customer: ' . $customer->getFullName(),
            'customer' => $customer,
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, Response $response, string $id): void
    {
        $customer = User::find((int)$id);
        if (!$customer) {
            $response->back();
            return;
        }

        $customer->status = $request->input('status', 'active');
        $customer->save();

        $_SESSION['success'] = 'Customer status updated';
        $response->back();
    }
}

