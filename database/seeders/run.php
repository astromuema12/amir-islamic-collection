<?php
/**
 * Database Seeder Runner
 * 
 * Run this script to populate the database with sample data:
 * php database/seeders/run.php
 */

require_once __DIR__ . '/../../vendor/autoload.php';

use Database\Seeders\DatabaseSeeder;
use App\Config\App;
use Dotenv\Dotenv;

// Load .env
$envPath = dirname(__DIR__, 2);
if (file_exists($envPath . '/.env')) {
    $dotenv = Dotenv::createImmutable($envPath);
    $dotenv->load();
}

// Initialize database connection
$app = new App();

echo "Starting database seeding...\n\n";

$seeder = new DatabaseSeeder();
$seeder->run();

echo "\nSeeding complete!\n";
