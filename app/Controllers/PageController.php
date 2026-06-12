<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Models\Faq;
use App\Models\Contact;
use App\Models\NewsletterSubscriber;
use App\Models\Order;

class PageController
{
    public function about(Request $request, Response $response): void
    {
        $response->render('Frontend/about', [
            'page_title' => 'About Us - ' . SITE_NAME,
            'meta_description' => 'Learn about ' . SITE_NAME . ' - Your Trusted Islamic Marketplace'
        ]);
    }

    public function contact(Request $request, Response $response): void
    {
        $response->render('Frontend/contact', [
            'page_title' => 'Contact Us - ' . SITE_NAME
        ]);
    }

    public function sendContact(Request $request, Response $response): void
    {
        $contact = new Contact([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'subject' => $request->input('subject'),
            'message' => $request->input('message')
        ]);
        $contact->save();

        $_SESSION['success'] = 'Thank you for your message. We will get back to you soon.';
        $response->back();
    }

    public function faq(Request $request, Response $response): void
    {
        $faqs = Faq::query("SELECT * FROM faqs WHERE status = 'active' ORDER BY sort_order ASC, created_at ASC");
        $categories = Faq::raw("SELECT DISTINCT category FROM faqs WHERE status = 'active' AND category IS NOT NULL ORDER BY category")->fetchAll(\PDO::FETCH_COLUMN);

        $response->render('Frontend/faq', [
            'page_title' => 'FAQ - ' . SITE_NAME,
            'faqs' => $faqs,
            'categories' => $categories
        ]);
    }

    public function terms(Request $request, Response $response): void
    {
        $content = get_setting('terms_content', '');
        $response->render('Frontend/terms', [
            'page_title' => 'Terms & Conditions - ' . SITE_NAME,
            'content' => $content
        ]);
    }

    public function privacy(Request $request, Response $response): void
    {
        $content = get_setting('privacy_content', '');
        $response->render('Frontend/privacy', [
            'page_title' => 'Privacy Policy - ' . SITE_NAME,
            'content' => $content
        ]);
    }

    public function shipping(Request $request, Response $response): void
    {
        $content = get_setting('shipping_content', '');
        $response->render('Frontend/shipping-policy', [
            'page_title' => 'Shipping Policy - ' . SITE_NAME,
            'content' => $content
        ]);
    }

    public function returns(Request $request, Response $response): void
    {
        $content = get_setting('return_content', '');
        $response->render('Frontend/return-policy', [
            'page_title' => 'Return Policy - ' . SITE_NAME,
            'content' => $content
        ]);
    }

    public function newsletter(Request $request, Response $response): void
    {
        $email = $request->input('email');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $request->isAjax() ? $response->json(['success' => false, 'message' => 'Invalid email']) : null;
            $_SESSION['error'] = 'Invalid email';
            $response->back();
            return;
        }

        $existing = NewsletterSubscriber::findBy('email', $email);
        if (!$existing) {
            $subscriber = new NewsletterSubscriber(['email' => $email]);
            $subscriber->save();
        }

        if ($request->isAjax()) {
            $response->json(['success' => true, 'message' => 'Subscribed successfully']);
        }

        $_SESSION['success'] = 'Thank you for subscribing!';
        $response->back();
    }

    public function trackOrder(Request $request, Response $response): void
    {
        $response->render('Frontend/track-order', [
            'page_title' => 'Track Order - ' . SITE_NAME
        ]);
    }

    public function trackOrderLookup(Request $request, Response $response): void
    {
        $orderNumber = $request->input('order_number');
        $email = $request->input('email');

        $order = Order::findBy('order_number', $orderNumber);

        if (!$order || $order->email !== $email) {
            $_SESSION['error'] = 'Order not found. Please check your order number and email.';
            $response->back();
            return;
        }

        $response->render('Frontend/track-order', [
            'page_title' => 'Track Order - ' . SITE_NAME,
            'order' => $order
        ]);
    }

    public function deals(Request $request, Response $response): void
    {
        $products = \App\Models\Product::query(
            "SELECT * FROM products WHERE status = 'active' AND sale_price IS NOT NULL AND sale_price < price ORDER BY discount_percent DESC LIMIT 20"
        );

        $response->render('Frontend/deals', [
            'page_title' => 'Deals - ' . SITE_NAME,
            'products' => $products
        ]);
    }
}
