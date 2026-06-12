<?php

namespace App\Models;

class Setting extends Model
{
    protected static string $table = 'settings';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'setting_key', 'setting_value', 'setting_group', 'type'
    ];

    private static array $cache = [];

    public static function get(string $key, mixed $default = null): mixed
    {
        if (isset(self::$cache[$key])) {
            return self::$cache[$key];
        }

        $setting = self::findBy('setting_key', $key);
        $value = $setting ? $setting->setting_value : $default;
        self::$cache[$key] = $value;
        return $value;
    }

    public static function set(string $key, string $value): bool
    {
        $setting = self::findBy('setting_key', $key);
        if ($setting) {
            $setting->setting_value = $value;
            $result = $setting->save();
        } else {
            $setting = new self(['setting_key' => $key, 'setting_value' => $value]);
            $result = $setting->save();
        }
        self::$cache[$key] = $value;
        return $result;
    }

    public static function getGroup(string $group): array
    {
        $results = self::db()->prepare("SELECT * FROM settings WHERE setting_group = ?");
        $results->execute([$group]);
        return array_map(fn($r) => new static($r), $results->fetchAll());
    }

    public static function getAllAsArray(): array
    {
        $results = self::db()->query("SELECT setting_key, setting_value FROM settings")->fetchAll();
        $data = [];
        foreach ($results as $row) {
            $data[$row['setting_key']] = $row['setting_value'];
        }
        return $data;
    }

    public static function clearCache(): void
    {
        self::$cache = [];
    }
}
