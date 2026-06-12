# Amir Islamic Collection - Installation Guide

## Prerequisites
- XAMPP (PHP 8.1+, Apache, MySQL 8+)
- Composer (latest)
- Node.js (optional, for Tailwind/Bootstrap build)
- Git (optional)

## Step 1: Setup Project
```bash
# Clone or copy the project to your XAMPP htdocs directory
# The project should be at: C:\xampp\htdocs\amir_islamic_collection

# Install PHP dependencies via Composer
cd C:\xampp\htdocs\amir_islamic_collection
composer install
```

## Step 2: Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database: `amir_islamic_db`
3. Import `database/schema.sql` into the database
4. (Optional) Run the seeder for sample data:
   ```bash
   php database/seeders/run.php
   ```

## Step 3: Environment Configuration
1. Copy `.env.example` to `.env` (or edit the existing `.env`)
2. Update the following values:

```env
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost/amir_islamic_collection

DB_HOST=localhost
DB_NAME=amir_islamic_db
DB_USER=root
DB_PASS=

MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_ENCRYPTION=tls
```

## Step 4: Enable Apache Rewrite Module
1. Open XAMPP Control Panel
2. Click "Config" for Apache → "httpd.conf"
3. Uncomment: `LoadModule rewrite_module modules/mod_rewrite.so`
4. Ensure `<Directory>` has `AllowOverride All`
5. Restart Apache

## Step 5: Set Directory Permissions
Ensure the following directories are writable:
- `public/uploads/` — for product images, banners
- `vendor/` — Composer packages

## Step 6: Access the Application
- **Frontend:** http://localhost/amir_islamic_collection/
- **Admin Panel:** http://localhost/amir_islamic_collection/admin
- **Admin Login:**
  - Email: `admin@amirislaminiccollection.com`
  - Password: `password`

## M-Pesa Configuration (Sandbox)

1. Register at https://developer.safaricom.co.ke/
2. Create an app to get Consumer Key and Consumer Secret
3. Generate a Passkey from the API playground
4. Update `.env` with your M-Pesa credentials
5. The default Shortcode for sandbox is `174379`

### M-Pesa Callback URLs
The application exposes callback endpoints at:
- `POST /api/mpesa/callback` — Payment callback
- `POST /api/mpesa/confirm` — Confirmation
- `POST /api/mpesa/validate` — Validation

These must be accessible from the internet. For local testing, use ngrok:
```bash
ngrok http 80
```

## Troubleshooting

### 404 on all pages except home
- Ensure Apache mod_rewrite is enabled
- Check `.htaccess` files exist in root and `public/` directories

### Database connection error
- Verify MySQL is running in XAMPP
- Check `.env` database credentials
- Ensure `amir_islamic_db` database exists

### Composer autoload not found
- Run `composer dump-autoload` to regenerate the autoloader

### White screen / PHP errors
- Set `APP_DEBUG=true` in `.env` to see error details
- Check PHP error log at `C:\xampp\php\logs\php_error_log`

## Architecture Overview

```
amir_islamic_collection/
├── app/
│   ├── Config/        # Core framework (App, Database, Router, etc.)
│   ├── Controllers/   # Frontend, Admin, and API controllers
│   ├── Helpers/       # Helper functions
│   ├── Middleware/     # Auth, CSRF, Rate limiting
│   ├── Models/        # Database models (Active Record pattern)
│   ├── Routes/        # Route definitions (web.php, api.php)
│   ├── Services/      # Business logic (Auth, Cart, Order, M-Pesa)
│   └── Views/         # Frontend and Admin Blade-like templates
├── database/
│   ├── schema.sql     # Complete database schema
│   └── seeders/       # Demo data seeders
├── public/
│   ├── assets/        # CSS, JS, images
│   ├── uploads/       # User-uploaded files
│   └── index.php      # Front controller
├── vendor/            # Composer dependencies
├── .env               # Environment configuration
└── composer.json      # PHP dependencies
```
