<?php

namespace App\Services;

use App\Models\User;
use App\Models\Admin;

class AuthService
{
    public function register(array $data): array
    {
        $existing = User::findBy('email', $data['email']);
        if ($existing) {
            return ['success' => false, 'message' => 'Email already registered'];
        }

        $user = User::createUser($data);
        if (!$user) {
            return ['success' => false, 'message' => 'Registration failed'];
        }

        $this->sendVerificationEmail($user);

        return [
            'success' => true,
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user' => $user
        ];
    }

    public function login(string $email, string $password, bool $remember = false): array
    {
        $user = User::findBy('email', $email);
        if (!$user || !password_verify($password, $user->password)) {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }

        if ($user->status !== 'active') {
            return ['success' => false, 'message' => 'Your account has been ' . $user->status];
        }

        $_SESSION['user_id'] = $user->id;
        $_SESSION['user_name'] = $user->getFullName();
        $_SESSION['user_email'] = $user->email;

        $user->last_login_at = date('Y-m-d H:i:s');
        $user->last_login_ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $user->save();

        if ($remember) {
            $token = bin2hex(random_bytes(32));
            $user->remember_token = $token;
            $user->save();
            setcookie('remember_token', $token, time() + 86400 * 30, '/', '', false, true);
        }

        session_regenerate_id(true);

        return ['success' => true, 'message' => 'Login successful', 'user' => $user];
    }

    public function logout(): void
    {
        unset($_SESSION['user_id']);
        unset($_SESSION['user_name']);
        unset($_SESSION['user_email']);
        setcookie('remember_token', '', time() - 3600, '/');
        session_destroy();
    }

    public function adminLogin(string $email, string $password): array
    {
        $admin = Admin::findBy('email', $email);
        if (!$admin || !password_verify($password, $admin->password)) {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }

        if ($admin->status !== 'active') {
            return ['success' => false, 'message' => 'Account is ' . $admin->status];
        }

        $_SESSION['admin_id'] = $admin->id;
        $_SESSION['admin_name'] = $admin->name;
        $_SESSION['admin_email'] = $admin->email;
        $_SESSION['admin_role'] = $admin->role;

        $admin->last_login_at = date('Y-m-d H:i:s');
        $admin->last_login_ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $admin->save();

        session_regenerate_id(true);

        return ['success' => true, 'message' => 'Login successful', 'admin' => $admin];
    }

    public function adminLogout(): void
    {
        unset($_SESSION['admin_id']);
        unset($_SESSION['admin_name']);
        unset($_SESSION['admin_email']);
        unset($_SESSION['admin_role']);
        session_destroy();
    }

    public function sendVerificationEmail(User $user): bool
    {
        $verificationUrl = url('verify-email?token=' . $user->email_verification_token);

        $subject = 'Verify Your Email - ' . SITE_NAME;
        $message = "
        <html>
        <body>
            <h2>Welcome to " . SITE_NAME . "!</h2>
            <p>Thank you for registering. Please click the link below to verify your email address:</p>
            <p><a href='{$verificationUrl}'>Verify Email</a></p>
            <p>If you did not create an account, please ignore this email.</p>
        </body>
        </html>
        ";

        return $this->sendEmail($user->email, $subject, $message);
    }

    public function sendPasswordResetEmail(string $email): array
    {
        $user = User::findBy('email', $email);
        if (!$user) {
            return ['success' => false, 'message' => 'If this email exists, a reset link has been sent'];
        }

        $token = bin2hex(random_bytes(32));
        $user->email_verification_token = $token;
        $user->save();

        $resetUrl = url('reset-password?token=' . $token);

        $subject = 'Reset Your Password - ' . SITE_NAME;
        $message = "
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <p><a href='{$resetUrl}'>Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
        </body>
        </html>
        ";

        $this->sendEmail($user->email, $subject, $message);

        return ['success' => true, 'message' => 'If this email exists, a reset link has been sent'];
    }

    public function resetPassword(string $token, string $password): array
    {
        $user = User::findBy('email_verification_token', $token);
        if (!$user) {
            return ['success' => false, 'message' => 'Invalid or expired token'];
        }

        $user->password = password_hash($password, PASSWORD_BCRYPT);
        $user->email_verification_token = null;
        $user->save();

        return ['success' => true, 'message' => 'Password reset successful. Please login.'];
    }

    private function sendEmail(string $to, string $subject, string $message): bool
    {
        try {
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $_ENV['SMTP_USERNAME'] ?? '';
            $mail->Password = $_ENV['SMTP_PASSWORD'] ?? '';
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = (int)($_ENV['SMTP_PORT'] ?? 587);

            $mail->setFrom($_ENV['SMTP_FROM'] ?? 'noreply@amirislaminiccollection.com', $_ENV['SMTP_FROM_NAME'] ?? SITE_NAME);
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $message;

            return $mail->send();
        } catch (\Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
            return false;
        }
    }
}
