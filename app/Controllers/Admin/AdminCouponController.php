<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Coupon;

class AdminCouponController
{
    public function index(Request $request, Response $response): void
    {
        $coupons = Coupon::query("SELECT * FROM coupons ORDER BY created_at DESC");
        $response->render('Admin/coupons/index', [
            'page_title' => 'Coupons - Admin',
            'coupons' => $coupons
        ]);
    }

    public function store(Request $request, Response $response): void
    {
        $coupon = new Coupon([
            'code' => strtoupper($request->input('code')),
            'type' => $request->input('type', 'percentage'),
            'value' => (float) $request->input('value'),
            'min_order_amount' => (float) ($request->input('min_order_amount', 0)),
            'max_discount' => $request->input('max_discount') ? (float) $request->input('max_discount') : null,
            'usage_limit' => (int) ($request->input('usage_limit', 0)),
            'per_user_limit' => (int) ($request->input('per_user_limit', 1)),
            'starts_at' => $request->input('starts_at'),
            'expires_at' => $request->input('expires_at'),
            'is_active' => $request->input('is_active') ? 1 : 0
        ]);
        $coupon->save();

        $_SESSION['success'] = 'Coupon created';
        $response->back();
    }

    public function update(Request $request, Response $response, string $id): void
    {
        $coupon = Coupon::find((int)$id);
        if ($coupon) {
            $coupon->code = strtoupper($request->input('code'));
            $coupon->type = $request->input('type', 'percentage');
            $coupon->value = (float) $request->input('value');
            $coupon->min_order_amount = (float) ($request->input('min_order_amount', 0));
            $coupon->max_discount = $request->input('max_discount') ? (float) $request->input('max_discount') : null;
            $coupon->usage_limit = (int) ($request->input('usage_limit', 0));
            $coupon->per_user_limit = (int) ($request->input('per_user_limit', 1));
            $coupon->starts_at = $request->input('starts_at');
            $coupon->expires_at = $request->input('expires_at');
            $coupon->is_active = $request->input('is_active') ? 1 : 0;
            $coupon->save();
            $_SESSION['success'] = 'Coupon updated';
        }
        $response->back();
    }

    public function delete(Request $request, Response $response, string $id): void
    {
        $coupon = Coupon::find((int)$id);
        if ($coupon) {
            $coupon->delete();
            $_SESSION['success'] = 'Coupon deleted';
        }
        $response->back();
    }
}
