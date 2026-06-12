<?php

namespace App\Services;

use App\Models\MpesaTransaction;
use App\Models\Order;
use App\Models\Payment;

class MpesaService
{
    private string $consumerKey;
    private string $consumerSecret;
    private string $passkey;
    private string $shortcode;
    private string $callbackUrl;
    private string $env;

    public function __construct()
    {
        $this->consumerKey = $_ENV['MPESA_CONSUMER_KEY'] ?? '';
        $this->consumerSecret = $_ENV['MPESA_CONSUMER_SECRET'] ?? '';
        $this->passkey = $_ENV['MPESA_PASSKEY'] ?? '';
        $this->shortcode = $_ENV['MPESA_SHORTCODE'] ?? '174379';
        $this->callbackUrl = $_ENV['MPESA_CALLBACK_URL'] ?? 'https://yourdomain.com/api/mpesa/callback';
        $this->env = $_ENV['MPESA_ENV'] ?? 'sandbox';
    }

    private function getBaseUrl(): string
    {
        return $this->env === 'production'
            ? 'https://api.safaricom.co.ke'
            : 'https://sandbox.safaricom.co.ke';
    }

    private function getAccessToken(): string
    {
        $url = $this->getBaseUrl() . '/oauth/v1/generate?grant_type=client_credentials';
        $credentials = base64_encode($this->consumerKey . ':' . $this->consumerSecret);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => ['Authorization: Basic ' . $credentials],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \RuntimeException('Failed to get M-Pesa access token');
        }

        $data = json_decode($response, true);
        return $data['access_token'] ?? '';
    }

    public function stkPush(string $phone, float $amount, string $accountReference, string $transactionDesc = 'Payment'): array
    {
        $phone = $this->formatPhone($phone);
        $timestamp = date('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

        $token = $this->getAccessToken();
        $url = $this->getBaseUrl() . '/mpesa/stkpush/v1/processrequest';

        $postData = [
            'BusinessShortCode' => $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => (int) round($amount),
            'PartyA' => $phone,
            'PartyB' => $this->shortcode,
            'PhoneNumber' => $phone,
            'CallBackURL' => $this->callbackUrl,
            'AccountReference' => $accountReference,
            'TransactionDesc' => $transactionDesc
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json'
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($postData),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 60
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true) ?? [];

        $transaction = new MpesaTransaction([
            'merchant_request_id' => $result['MerchantRequestID'] ?? '',
            'checkout_request_id' => $result['CheckoutRequestID'] ?? '',
            'response_code' => $result['ResponseCode'] ?? '',
            'response_description' => $result['ResponseDescription'] ?? '',
            'customer_message' => $result['CustomerMessage'] ?? '',
            'amount' => $amount,
            'phone_number' => $phone,
            'status' => ($result['ResponseCode'] ?? '1') === '0' ? 'processing' : 'failed',
            'raw_request' => json_encode($postData),
            'raw_response' => $response
        ]);
        $transaction->save();

        return [
            'success' => ($result['ResponseCode'] ?? '1') === '0',
            'message' => $result['CustomerMessage'] ?? $result['ResponseDescription'] ?? 'STK push initiated',
            'checkout_request_id' => $result['CheckoutRequestID'] ?? '',
            'transaction_id' => $transaction->id,
            'merchant_request_id' => $result['MerchantRequestID'] ?? ''
        ];
    }

    public function queryStatus(string $checkoutRequestId): array
    {
        $timestamp = date('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);
        $token = $this->getAccessToken();

        $url = $this->getBaseUrl() . '/mpesa/stkpushquery/v1/query';
        $postData = [
            'BusinessShortCode' => $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'CheckoutRequestID' => $checkoutRequestId
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json'
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($postData),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true) ?? [];
    }

    public function handleCallback(array $data): array
    {
        $body = $data['Body'] ?? [];
        $stkCallback = $body['stkCallback'] ?? [];
        $checkoutRequestId = $stkCallback['MerchantRequestID'] ?? '';
        $resultCode = $stkCallback['ResultCode'] ?? '1';
        $resultDesc = $stkCallback['ResultDesc'] ?? '';

        $transaction = MpesaTransaction::findBy('checkout_request_id', $checkoutRequestId);
        if (!$transaction) {
            $transaction = MpesaTransaction::findBy('merchant_request_id', $checkoutRequestId);
        }

        if ($transaction) {
            $transaction->result_code = $resultCode;
            $transaction->result_description = $resultDesc;
            $transaction->raw_callback = json_encode($data);

            if ($resultCode == '0') {
                $callbackMetadata = $stkCallback['CallbackMetadata']['Item'] ?? [];
                $metadata = [];
                foreach ($callbackMetadata as $item) {
                    $metadata[$item['Name']] = $item['Value'] ?? null;
                }

                $transaction->mpesa_receipt_number = $metadata['MpesaReceiptNumber'] ?? '';
                $transaction->transaction_date = $metadata['TransactionDate'] ?? '';
                $transaction->amount = $metadata['Amount'] ?? $transaction->amount;
                $transaction->phone_number = $metadata['PhoneNumber'] ?? $transaction->phone_number;
                $transaction->status = 'completed';

                if ($transaction->order_id) {
                    $order = Order::find($transaction->order_id);
                    if ($order) {
                        $order->payment_status = 'completed';
                        $order->status = 'paid';
                        $order->paid_amount = $transaction->amount;
                        $order->save();

                        $payment = Payment::findBy('order_id', $order->id);
                        if ($payment) {
                            $payment->status = 'completed';
                            $payment->transaction_id = $transaction->mpesa_receipt_number;
                            $payment->receipt_number = $transaction->mpesa_receipt_number;
                            $payment->save();
                        }
                    }
                }
            } else {
                $transaction->status = 'failed';
            }

            $transaction->save();
        }

        return [
            'ResultCode' => 0,
            'ResultDesc' => 'Success'
        ];
    }

    public function initiatePayment(int $orderId, string $phone): array
    {
        $order = Order::find($orderId);
        if (!$order) {
            return ['success' => false, 'message' => 'Order not found'];
        }

        if ($order->payment_status === 'completed') {
            return ['success' => false, 'message' => 'Order already paid'];
        }

        $payment = new Payment([
            'order_id' => $order->id,
            'payment_method' => 'mpesa',
            'amount' => $order->total,
            'phone_number' => $phone,
            'status' => 'pending'
        ]);
        $payment->save();

        $transaction = new MpesaTransaction([
            'order_id' => $order->id,
            'payment_id' => $payment->id,
            'amount' => $order->total,
            'phone_number' => $this->formatPhone($phone),
            'status' => 'pending'
        ]);
        $transaction->save();

        $result = $this->stkPush($phone, $order->total, $order->order_number, 'Payment for order ' . $order->order_number);

        if ($result['success']) {
            $transaction->merchant_request_id = $result['merchant_request_id'] ?? '';
            $transaction->checkout_request_id = $result['checkout_request_id'] ?? '';
            $transaction->status = 'processing';
            $transaction->save();

            $payment->status = 'processing';
            $payment->save();
        } else {
            $transaction->status = 'failed';
            $transaction->save();

            $payment->status = 'failed';
            $payment->save();
        }

        return $result;
    }

    private function formatPhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($phone) === 9) {
            $phone = '254' . $phone;
        } elseif (strlen($phone) === 10 && $phone[0] === '0') {
            $phone = '254' . substr($phone, 1);
        } elseif (strlen($phone) === 12 && substr($phone, 0, 3) === '254') {
            // Already formatted
        } elseif (strlen($phone) === 13 && $phone[0] === '+') {
            $phone = substr($phone, 1);
        }
        return $phone;
    }
}
