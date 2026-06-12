<?php

namespace App\Models;

class Admin extends Model
{
    protected static string $table = 'admins';
    protected static string $primaryKey = 'id';

    protected array $hidden = ['password'];
    protected array $fillable = [
        'name', 'email', 'password', 'role', 'avatar',
        'status', 'last_login_at', 'last_login_ip'
    ];

    public static function createAdmin(array $data): ?self
    {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $admin = new self($data);
        if ($admin->save()) {
            return $admin;
        }
        return null;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }
        return true;
    }
}
