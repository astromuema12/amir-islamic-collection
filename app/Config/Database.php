<?php

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    private static ?Database $instance = null;
    private ?PDO $connection = null;

    private string $host;
    private string $port;
    private string $dbName;
    private string $user;
    private string $pass;
    private string $driver;

    private function __construct()
    {
        $this->driver = $_ENV['DB_DRIVER'] ?? 'pgsql';
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->port = $_ENV['DB_PORT'] ?? ($this->driver === 'pgsql' ? '5432' : '3306');
        $this->dbName = $_ENV['DB_NAME'] ?? 'amir_islamic_db';
        $this->user = $_ENV['DB_USER'] ?? 'postgres';
        $this->pass = $_ENV['DB_PASS'] ?? '';
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): PDO
    {
        if ($this->connection === null) {
            try {
                if ($this->driver === 'pgsql') {
                    $dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->dbName}";
                    $options = [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ];
                } else {
                    $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbName};charset=utf8mb4";
                    $options = [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                        PDO::ATTR_EMULATE_PREPARES => false,
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                    ];
                }
                $this->connection = new PDO($dsn, $this->user, $this->pass, $options);
            } catch (PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }
        return $this->connection;
    }

    public function beginTransaction(): void
    {
        $this->getConnection()->beginTransaction();
    }

    public function commit(): void
    {
        $this->getConnection()->commit();
    }

    public function rollback(): void
    {
        $this->getConnection()->rollback();
    }

    public function getDriver(): string
    {
        return $this->driver;
    }
}
