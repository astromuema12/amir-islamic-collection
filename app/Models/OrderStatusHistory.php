<?php

namespace App\Models;

class OrderStatusHistory extends Model
{
    protected static string $table = 'order_status_history';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'order_id', 'status', 'comment', 'changed_by'
    ];
}
