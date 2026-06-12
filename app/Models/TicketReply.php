<?php

namespace App\Models;

class TicketReply extends Model
{
    protected static string $table = 'ticket_replies';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'ticket_id', 'user_id', 'admin_id', 'message', 'attachments'
    ];

    public function ticket()
    {
        return SupportTicket::find($this->ticket_id);
    }
}
