<?php

namespace App\Models;

class MpesaTransaction extends Model
{
    protected static string $table = 'mpesa_transactions';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'order_id', 'payment_id', 'merchant_request_id', 'checkout_request_id',
        'response_code', 'response_description', 'customer_message',
        'result_code', 'result_description', 'amount', 'phone_number',
        'mpesa_receipt_number', 'transaction_date', 'balance',
        'status', 'raw_request', 'raw_response', 'raw_callback'
    ];

    public function order()
    {
        return Order::find($this->order_id);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }
}
