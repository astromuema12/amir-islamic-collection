<?php

namespace App\Models;

class Payment extends Model
{
    protected static string $table = 'payments';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'order_id', 'payment_method', 'amount', 'transaction_id',
        'receipt_number', 'phone_number', 'status', 'notes'
    ];

    public function order()
    {
        return Order::find($this->order_id);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
