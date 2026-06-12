<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Models\Order;
use App\Models\Wishlist;
use App\Models\Address;
use App\Models\Review;
use App\Models\Notification;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use App\Models\User;

class DashboardController
{
    private function getUser()
    {
        return User::find($_SESSION['user_id']);
    }

    public function index(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $recentOrders = Order::getByUser($user->id, 5, 0);
        $wishlistCount = Wishlist::raw("SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?", [$user->id])->fetch()->count;
        $orderCount = Order::raw("SELECT COUNT(*) as count FROM orders WHERE user_id = ?", [$user->id])->fetch()->count;
        $notificationCount = Notification::unreadCount($user->id);

        $response->render('Frontend/dashboard/index', [
            'page_title' => 'Dashboard - ' . SITE_NAME,
            'user' => $user,
            'recentOrders' => $recentOrders,
            'wishlistCount' => $wishlistCount,
            'orderCount' => $orderCount,
            'notificationCount' => $notificationCount
        ]);
    }

    public function orders(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $orders = Order::getByUser($user->id, 20, 0);

        $response->render('Frontend/dashboard/orders', [
            'page_title' => 'My Orders - ' . SITE_NAME,
            'orders' => $orders
        ]);
    }

    public function orderDetail(Request $request, Response $response, string $id): void
    {
        $user = $this->getUser();
        $order = Order::find((int)$id);

        if (!$order || $order->user_id != $user->id) {
            $response->setStatusCode(404);
            $response->render('Frontend/404');
            return;
        }

        $response->render('Frontend/dashboard/order-detail', [
            'page_title' => 'Order #' . $order->order_number,
            'order' => $order
        ]);
    }

    public function profile(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $response->render('Frontend/dashboard/profile', [
            'page_title' => 'My Profile - ' . SITE_NAME,
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $user->first_name = $request->input('first_name');
        $user->last_name = $request->input('last_name');
        $user->phone = $request->input('phone');

        if ($request->input('password')) {
            if (strlen($request->input('password')) >= 8) {
                $user->password = password_hash($request->input('password'), PASSWORD_BCRYPT);
            }
        }

        $user->save();
        $_SESSION['user_name'] = $user->getFullName();
        $_SESSION['success'] = 'Profile updated successfully';
        $response->back();
    }

    public function addresses(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $addresses = Address::where('user_id', '=', $user->id);

        $response->render('Frontend/dashboard/addresses', [
            'page_title' => 'My Addresses - ' . SITE_NAME,
            'addresses' => $addresses
        ]);
    }

    public function addAddress(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $address = new Address([
            'user_id' => $user->id,
            'label' => $request->input('label'),
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'phone' => $request->input('phone'),
            'address_line1' => $request->input('address_line1'),
            'address_line2' => $request->input('address_line2'),
            'city' => $request->input('city'),
            'state' => $request->input('state'),
            'postal_code' => $request->input('postal_code'),
            'country' => $request->input('country', 'Kenya'),
            'is_default' => $request->input('is_default') ? 1 : 0
        ]);
        $address->save();

        $_SESSION['success'] = 'Address added successfully';
        $response->back();
    }

    public function deleteAddress(Request $request, Response $response, string $id): void
    {
        $address = Address::find((int)$id);
        if ($address && $address->user_id == $_SESSION['user_id']) {
            $address->delete();
            $_SESSION['success'] = 'Address deleted';
        }
        $response->back();
    }

    public function wishlist(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $items = Wishlist::getUserWishlist($user->id);

        $response->render('Frontend/dashboard/wishlist', [
            'page_title' => 'My Wishlist - ' . SITE_NAME,
            'wishlistItems' => $items
        ]);
    }

    public function reviews(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $reviews = Review::query(
            "SELECT r.*, p.name as product_name, p.slug as product_slug
             FROM reviews r
             JOIN products p ON r.product_id = p.id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC",
            [$user->id]
        );

        $response->render('Frontend/dashboard/reviews', [
            'page_title' => 'My Reviews - ' . SITE_NAME,
            'reviews' => $reviews
        ]);
    }

    public function addReview(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $review = new Review([
            'product_id' => (int) $request->input('product_id'),
            'user_id' => $user->id,
            'order_id' => (int) $request->input('order_id'),
            'rating' => (int) $request->input('rating'),
            'title' => $request->input('title'),
            'comment' => $request->input('comment'),
            'status' => 'pending'
        ]);
        $review->save();

        $_SESSION['success'] = 'Review submitted for approval. Thank you!';
        $response->back();
    }

    public function tickets(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $tickets = SupportTicket::where('user_id', '=', $user->id);

        $response->render('Frontend/dashboard/tickets', [
            'page_title' => 'Support Tickets - ' . SITE_NAME,
            'tickets' => $tickets
        ]);
    }

    public function createTicket(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $ticket = new SupportTicket([
            'user_id' => $user->id,
            'order_id' => $request->input('order_id') ? (int) $request->input('order_id') : null,
            'ticket_number' => SupportTicket::generateTicketNumber(),
            'subject' => $request->input('subject'),
            'message' => $request->input('message'),
            'priority' => $request->input('priority', 'medium'),
            'status' => 'open'
        ]);
        $ticket->save();

        $_SESSION['success'] = 'Ticket created successfully. Ticket #: ' . $ticket->ticket_number;
        $response->back();
    }

    public function ticketDetail(Request $request, Response $response, string $id): void
    {
        $user = $this->getUser();
        $ticket = SupportTicket::find((int)$id);

        if (!$ticket || $ticket->user_id != $user->id) {
            $response->setStatusCode(404);
            $response->render('Frontend/404');
            return;
        }

        $replies = TicketReply::where('ticket_id', '=', $ticket->id);

        $response->render('Frontend/dashboard/ticket-detail', [
            'page_title' => 'Ticket #' . $ticket->ticket_number,
            'ticket' => $ticket,
            'replies' => $replies
        ]);
    }

    public function replyTicket(Request $request, Response $response, string $id): void
    {
        $ticket = SupportTicket::find((int)$id);
        if (!$ticket || $ticket->user_id != $_SESSION['user_id']) {
            $response->back();
            return;
        }

        $reply = new TicketReply([
            'ticket_id' => $ticket->id,
            'user_id' => $_SESSION['user_id'],
            'message' => $request->input('message')
        ]);
        $reply->save();

        $ticket->status = 'in_progress';
        $ticket->save();

        $_SESSION['success'] = 'Reply sent';
        $response->back();
    }

    public function notifications(Request $request, Response $response): void
    {
        $user = $this->getUser();
        $notifications = Notification::query(
            "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
            [$user->id]
        );

        $response->render('Frontend/dashboard/notifications', [
            'page_title' => 'Notifications - ' . SITE_NAME,
            'notifications' => $notifications
        ]);
    }

    public function markNotificationRead(Request $request, Response $response, string $id): void
    {
        Notification::markAsRead((int)$id);
        $response->back();
    }

    public function markAllNotificationsRead(Request $request, Response $response): void
    {
        Notification::markAllAsRead($_SESSION['user_id']);
        $response->back();
    }
}
