<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\SupportTicket;
use App\Models\TicketReply;

class AdminTicketController
{
    public function index(Request $request, Response $response): void
    {
        $status = $request->query('status', '');
        $sql = "SELECT st.*, u.first_name, u.last_name, u.email FROM support_tickets st JOIN users u ON st.user_id = u.id";
        $params = [];

        if ($status) {
            $sql .= " WHERE st.status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY st.created_at DESC";
        $tickets = SupportTicket::query($sql, $params);

        $response->render('Admin/tickets/index', [
            'page_title' => 'Support Tickets - Admin',
            'tickets' => $tickets
        ]);
    }

    public function show(Request $request, Response $response, string $id): void
    {
        $ticket = SupportTicket::find((int)$id);
        if (!$ticket) {
            $response->redirect(url('admin/'));
            return;
        }

        $replies = TicketReply::where('ticket_id', '=', $ticket->id);
        $user = \App\Models\User::find($ticket->user_id);

        $response->render('Admin/tickets/show', [
            'page_title' => 'Ticket #' . $ticket->ticket_number,
            'ticket' => $ticket,
            'replies' => $replies,
            'user' => $user
        ]);
    }

    public function reply(Request $request, Response $response, string $id): void
    {
        $ticket = SupportTicket::find((int)$id);
        if (!$ticket) {
            $response->back();
            return;
        }

        $reply = new TicketReply([
            'ticket_id' => $ticket->id,
            'admin_id' => $_SESSION['admin_id'],
            'message' => $request->input('message')
        ]);
        $reply->save();

        $ticket->status = 'waiting';
        $ticket->save();

        $_SESSION['success'] = 'Reply sent';
        $response->back();
    }

    public function updateStatus(Request $request, Response $response, string $id): void
    {
        $ticket = SupportTicket::find((int)$id);
        if ($ticket) {
            $ticket->status = $request->input('status', 'open');
            $ticket->assigned_to = $request->input('assigned_to') ? (int) $request->input('assigned_to') : null;
            $ticket->save();
            $_SESSION['success'] = 'Ticket status updated';
        }
        $response->back();
    }
}

