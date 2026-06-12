<?php

namespace App\Models;

class SupportTicket extends Model
{
    protected static string $table = 'support_tickets';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'user_id', 'order_id', 'ticket_number', 'subject', 'message',
        'priority', 'status', 'assigned_to'
    ];

    public function user()
    {
        return User::find($this->user_id);
    }

    public function replies()
    {
        return TicketReply::where('ticket_id', '=', $this->id);
    }

    public static function generateTicketNumber(): string
    {
        return 'TKT-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('Ymd');
    }
}
