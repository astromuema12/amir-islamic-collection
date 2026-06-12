<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Services\MpesaService;

class MpesaApiController
{
    private MpesaService $mpesaService;

    public function __construct()
    {
        $this->mpesaService = new MpesaService();
    }

    public function callback(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $result = $this->mpesaService->handleCallback($data);
        $response->json($result);
    }

    public function confirm(Request $request, Response $response): void
    {
        $result = ['ResultCode' => 0, 'ResultDesc' => 'Success'];
        $response->json($result);
    }

    public function validate(Request $request, Response $response): void
    {
        $result = ['ResultCode' => 0, 'ResultDesc' => 'Success'];
        $response->json($result);
    }

    public function pay(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $orderId = (int) ($data['order_id'] ?? 0);
        $phone = $data['phone'] ?? '';

        if (!$orderId || !$phone) {
            $response->json(['error' => 'Order ID and phone number are required'], 400);
            return;
        }

        $result = $this->mpesaService->initiatePayment($orderId, $phone);
        $response->json($result);
    }

    public function status(Request $request, Response $response, string $checkoutRequestId): void
    {
        $result = $this->mpesaService->queryStatus($checkoutRequestId);
        $response->json($result);
    }
}
