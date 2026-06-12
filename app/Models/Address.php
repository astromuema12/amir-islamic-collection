<?php

namespace App\Models;

class Address extends Model
{
    protected static string $table = 'addresses';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'user_id', 'label', 'first_name', 'last_name', 'phone',
        'address_line1', 'address_line2', 'city', 'state',
        'postal_code', 'country', 'is_default'
    ];

    public function user()
    {
        return User::find($this->user_id);
    }

    public function getFullAddress(): string
    {
        $parts = [$this->address_line1];
        if ($this->address_line2) $parts[] = $this->address_line2;
        $parts[] = $this->city;
        if ($this->state) $parts[] = $this->state;
        $parts[] = $this->country;
        return implode(', ', $parts);
    }
}
