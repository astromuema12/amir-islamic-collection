<?php

namespace App\Models;

class User extends Model
{
    protected static string $table = 'users';
    protected static string $primaryKey = 'id';

    protected array $hidden = ['password', 'remember_token', 'email_verification_token'];
    protected array $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'password',
        'avatar', 'email_verified_at', 'email_verification_token',
        'remember_token', 'status', 'last_login_at', 'last_login_ip',
        'referral_code', 'referred_by'
    ];

    public function getFullName(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function orders()
    {
        return Order::where('user_id', '=', $this->id);
    }

    public function reviews()
    {
        return Review::where('user_id', '=', $this->id);
    }

    public function wishlist()
    {
        return Wishlist::where('user_id', '=', $this->id);
    }

    public function addresses()
    {
        return Address::where('user_id', '=', $this->id);
    }

    public function cart()
    {
        return Cart::findBy('user_id', $this->id);
    }

    public static function createUser(array $data): ?self
    {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['referral_code'] = strtoupper(substr(md5(uniqid()), 0, 8));
        $data['email_verification_token'] = bin2hex(random_bytes(32));

        $user = new self($data);
        if ($user->save()) {
            return $user;
        }
        return null;
    }

    public function verifyEmail(): bool
    {
        $this->email_verified_at = date('Y-m-d H:i:s');
        $this->email_verification_token = null;
        return $this->save();
    }

    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified_at !== null;
    }
}
