<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\NewsletterSubscriber;

class AdminNewsletterController
{
    public function index(Request $request, Response $response): void
    {
        $subscribers = NewsletterSubscriber::query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC");

        $response->render('Admin/newsletter/index', [
            'page_title' => 'Newsletter - Admin',
            'subscribers' => $subscribers
        ]);
    }

    public function sendCampaign(Request $request, Response $response): void
    {
        $subject = $request->input('subject');
        $message = $request->input('message');

        if (!$subject || !$message) {
            $_SESSION['error'] = 'Subject and message are required';
            $response->back();
            return;
        }

        $subscribers = NewsletterSubscriber::query("SELECT * FROM newsletter_subscribers WHERE status = 'active'");

        $sent = 0;
        foreach ($subscribers as $subscriber) {
            try {
                $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = $_ENV['SMTP_USERNAME'] ?? '';
                $mail->Password = $_ENV['SMTP_PASSWORD'] ?? '';
                $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = (int)($_ENV['SMTP_PORT'] ?? 587);
                $mail->setFrom($_ENV['SMTP_FROM'] ?? 'noreply@amirislaminiccollection.com', SITE_NAME);
                $mail->addAddress($subscriber->email);
                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body = $message;
                $mail->send();
                $sent++;
            } catch (\Exception $e) {
                continue;
            }
        }

        $_SESSION['success'] = "Campaign sent to {$sent} subscribers";
        $response->back();
    }
}
