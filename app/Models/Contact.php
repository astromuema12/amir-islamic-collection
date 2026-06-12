<?php

namespace App\Models;

class Contact extends Model
{
    protected static string $table = 'contacts';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'name', 'email', 'phone', 'subject', 'message', 'is_read', 'replied_at'
    ];

    public static function getUnread(): int
    {
        return self::db()->query("SELECT COUNT(*) as count FROM contacts WHERE is_read = 0")->fetch()->count;
    }

    public function markAsRead(): bool
    {
        $this->is_read = 1;
        return $this->save();
    }
}
