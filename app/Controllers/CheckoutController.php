<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\MpesaService;
use App\Models\Address;
use App\Models\ShippingMethod;

class CheckoutController
{
    private CartService $cartService;
    private OrderService $orderService;
    private MpesaService $mpesaService;

    public function __construct()
    {
        $this->cartService = new CartService();
        $this->orderService = new OrderService();
        $this->mpesaService = new MpesaService();
    }

    public function index(Request $request, Response $response): void
    {
        $cartItems = $this->cartService->getCartItems();
        $cart = $this->cartService->getCart();

        if (empty($cartItems)) {
            $response->redirect('/cart');
            return;
        }

        $addresses = [];
        $shippingMethods = ShippingMethod::query("SELECT * FROM shipping_methods WHERE status = 'active' ORDER BY sort_order ASC");

        if (isset($_SESSION['user_id'])) {
            $addresses = Address::where('user_id', '=', $_SESSION['user_id']);
        }

        $response->render('Frontend/checkout', [
            'page_title' => 'Checkout - ' . SITE_NAME,
            'cartItems' => $cartItems,
            'cart' => $cart,
            'addresses' => $addresses,
            'shippingMethods' => $shippingMethods
        ]);
    }

    public function process(Request $request, Response $response): void
    {
        $cartItems = $this->cartService->getCartItems();
        if (empty($cartItems)) {
            $response->redirect('/cart');
            return;
        }

        $data = [
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'payment_method' => $request->input('payment_method', 'mpesa'),
            'shipping_method_id' => $request->input('shipping_method'),
            'shipping_address_id' => $request->input('shipping_address_id'),
            'notes' => $request->input('notes'),
            'save_address' => $request->input('save_address'),
        ];

        if (!$data['shipping_address_id']) {
            $address = new Address([
                'user_id' => $_SESSION['user_id'] ?? 0,
                'label' => $request->input('address_label', 'Shipping'),
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'phone' => $request->input('phone'),
                'address_line1' => $request->input('address_line1'),
                'address_line2' => $request->input('address_line2'),
                'city' => $request->input('city'),
                'state' => $request->input('state'),
                'postal_code' => $request->input('postal_code'),
                'country' => $request->input('country', 'Kenya'),
                'is_default' => 0
            ]);
            $address->save();
            $data['shipping_address_id'] = $address->id;
        }

        $orderResult = $this->orderService->createOrder($data);

        if (!$orderResult['success']) {
            $_SESSION['error'] = $orderResult['message'];
            $response->back();
            return;
        }

        $order = $orderResult['order'];

        if ($data['payment_method'] === 'mpesa') {
            $phone = $request->input('mpesa_phone', $request->input('phone'));
            $paymentResult = $this->mpesaService->initiatePayment($order->id, $phone);

            if (!$paymentResult['success']) {
                $_SESSION['error'] = 'Payment initiation failed: ' . ($paymentResult['message'] ?? 'Unknown error');
                $response->redirect('/checkout/cancel/' . $order->id);
                return;
            }

            $_SESSION['checkout_request_id'] = $paymentResult['checkout_request_id'] ?? '';
            $response->redirect('/checkout/success/' . $order->id);
        } else {
            $response->redirect('/checkout/success/' . $order->id);
        }
    }

    public function success(Request $request, Response $response, string $orderId): void
    {
        $order = \App\Models\Order::find((int)$orderId);
        if (!$order) {
            $response->redirect('/');
            return;
        }

        $response->render('Frontend/order-success', [
            'page_title' => 'Order Successful - ' . SITE_NAME,
            'order' => $order
        ]);
    }

    public function cancel(Request $request, Response $response, string $orderId): void
    {
        $order = \App\Models\Order::find((int)$orderId);
        if (!$order) {
            $response->redirect('/');
            return;
        }

        $response->render('Frontend/order-cancel', [
            'page_title' => 'Order Cancelled - ' . SITE_NAME,
            'order' => $order
        ]);
    }
}
