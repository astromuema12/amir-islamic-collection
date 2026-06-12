<?php

namespace App\Models;

use App\Config\Database;

class Notification extends Model
{
    protected static string $table = 'notifications';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'user_id', 'admin_id', 'type', 'title', 'message', 'link', 'is_read', 'read_at'
    ];

    public static function unreadCount(int $userId): int
    {
        $stmt = self::db()->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0");
        $stmt->execute([$userId]);
        return (int) $stmt->fetch()->count;
    }

    public static function markAsRead(int $id): void
    {
        $driver = Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';
        $stmt = self::db()->prepare("UPDATE notifications SET is_read = 1, read_at = {$now} WHERE id = ?");
        $stmt->execute([$id]);
    }

    public static function markAllAsRead(int $userId): void
    {
        $driver = Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';
        $stmt = self::db()->prepare("UPDATE notifications SET is_read = 1, read_at = {$now} WHERE user_id = ? AND is_read = 0");
        $stmt->execute([$userId]);
    }
}
