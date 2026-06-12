<?php

namespace App\Models;

class NewsletterSubscriber extends Model
{
    protected static string $table = 'newsletter_subscribers';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'email', 'name', 'status', 'subscribed_at'
    ];

    public static function getActive(): array
    {
        return self::query(
            "SELECT * FROM newsletter_subscribers WHERE status = 'active' ORDER BY subscribed_at DESC"
        );
    }

    public static function subscribe(string $email, ?string $name = null): ?self
    {
        $existing = self::findBy('email', $email);
        if ($existing) {
            if ($existing->status === 'unsubscribed') {
                $existing->status = 'active';
                $existing->subscribed_at = date('Y-m-d H:i:s');
                $existing->save();
            }
            return $existing;
        }

        $subscriber = new self([
            'email' => $email,
            'name' => $name,
            'status' => 'active',
            'subscribed_at' => date('Y-m-d H:i:s')
        ]);
        $subscriber->save();
        return $subscriber;
    }

    public static function unsubscribe(string $email): bool
    {
        $subscriber = self::findBy('email', $email);
        if ($subscriber) {
            $subscriber->status = 'unsubscribed';
            return $subscriber->save();
        }
        return false;
    }
}
