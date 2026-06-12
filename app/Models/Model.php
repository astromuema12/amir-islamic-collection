<?php

namespace App\Models;

use App\Config\Database;
use PDO;
use PDOException;

abstract class Model
{
    protected static string $table;
    protected static string $primaryKey = 'id';
    protected array $attributes = [];
    protected array $fillable = [];
    protected array $hidden = ['password'];
    protected array $casts = [];

    public function __construct(array $attributes = [])
    {
        $this->fill($attributes);
    }

    public function fill(array $attributes): void
    {
        foreach ($attributes as $key => $value) {
            $this->attributes[$key] = $value;
        }
    }

    public function __get(string $name)
    {
        return $this->attributes[$name] ?? null;
    }

    public function __set(string $name, $value): void
    {
        $this->attributes[$name] = $value;
    }

    public function toArray(): array
    {
        $data = $this->attributes;
        foreach ($this->hidden as $field) {
            unset($data[$field]);
        }
        return $data;
    }

    protected static function db(): PDO
    {
        return Database::getInstance()->getConnection();
    }

    public static function find(int $id): ?static
    {
        $table = static::$table;
        $stmt = self::db()->prepare("SELECT * FROM {$table} WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? new static($result) : null;
    }

    public static function findBy(string $column, $value): ?static
    {
        $table = static::$table;
        $stmt = self::db()->prepare("SELECT * FROM {$table} WHERE {$column} = ? LIMIT 1");
        $stmt->execute([$value]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? new static($result) : null;
    }

    public static function where(string $column, string $operator = '=', $value = null): array
    {
        $table = static::$table;
        if ($value === null) {
            $value = $operator;
            $operator = '=';
        }
        $stmt = self::db()->prepare("SELECT * FROM {$table} WHERE {$column} {$operator} ?");
        $stmt->execute([$value]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(fn($r) => new static($r), $results);
    }

    public static function all(): array
    {
        $table = static::$table;
        $stmt = self::db()->query("SELECT * FROM {$table}");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(fn($r) => new static($r), $results);
    }

    public static function paginate(int $perPage = 15, int $page = 1): array
    {
        $table = static::$table;
        $countStmt = self::db()->query("SELECT COUNT(*) as total FROM {$table}");
        $total = (int) $countStmt->fetch()->total;
        $offset = ($page - 1) * $perPage;
        $stmt = self::db()->prepare("SELECT * FROM {$table} LIMIT ? OFFSET ?");
        $stmt->execute([$perPage, $offset]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'data' => array_map(fn($r) => new static($r), $results),
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => (int) ceil($total / $perPage)
        ];
    }

    public function save(): bool
    {
        $table = static::$table;
        $pk = static::$primaryKey;

        if (isset($this->attributes[$pk])) {
            $sets = [];
            $params = [];
            foreach ($this->attributes as $key => $value) {
                if ($key === $pk) continue;
                $sets[] = "{$key} = ?";
                $params[] = $value;
            }
            $params[] = $this->attributes[$pk];
            $sql = "UPDATE {$table} SET " . implode(', ', $sets) . " WHERE {$pk} = ?";
            $stmt = self::db()->prepare($sql);
            return $stmt->execute($params);
        } else {
            $columns = implode(', ', array_keys($this->attributes));
            $placeholders = implode(', ', array_fill(0, count($this->attributes), '?'));
            $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
            $stmt = self::db()->prepare($sql);
            $result = $stmt->execute(array_values($this->attributes));
            if ($result) {
                $driver = \App\Config\Database::getInstance()->getDriver();
                if ($driver === 'pgsql') {
                    $table = static::$table;
                    $seqName = "{$table}_{$pk}_seq";
                    $this->attributes[$pk] = (int) self::db()->lastInsertId($seqName);
                } else {
                    $this->attributes[$pk] = (int) self::db()->lastInsertId();
                }
            }
            return $result;
        }
    }

    public function delete(): bool
    {
        $table = static::$table;
        $pk = static::$primaryKey;
        if (!isset($this->attributes[$pk])) {
            return false;
        }
        $stmt = self::db()->prepare("DELETE FROM {$table} WHERE {$pk} = ?");
        return $stmt->execute([$this->attributes[$pk]]);
    }

    public static function count(): int
    {
        $table = static::$table;
        $stmt = self::db()->query("SELECT COUNT(*) as count FROM {$table}");
        return (int) $stmt->fetch()->count;
    }

    public static function query(string $sql, array $params = []): array
    {
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(fn($r) => new static($r), $results);
    }

    public static function raw(string $sql, array $params = []): \PDOStatement
    {
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
}
