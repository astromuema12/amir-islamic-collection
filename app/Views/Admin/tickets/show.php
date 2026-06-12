<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Ticket #<?= htmlspecialchars($ticket->ticket_number) ?></h4>
<div class="row"><div class="col-md-8">
<div class="card"><div class="card-header"><?= htmlspecialchars($ticket->subject) ?></div>
<div class="card-body"><p><strong>From:</strong> <?= htmlspecialchars($user->getFullName() ?? '') ?> (<?= htmlspecialchars($user->email ?? '') ?>)</p>
<p><strong>Message:</strong></p><p><?= nl2br(htmlspecialchars($ticket->message)) ?></p></div></div>
<?php foreach ($replies as $reply): ?>
<div class="card mt-2"><div class="card-body">
<p><?= nl2br(htmlspecialchars($reply->message)) ?></p>
<small class="text-muted"><?= $reply->admin_id ? 'Admin' : 'Customer' ?> - <?= date('d M Y H:i', strtotime($reply->created_at)) ?></small>
</div></div><?php endforeach; ?>
<div class="card mt-3"><div class="card-body">
<form action="<?= url('admin/tickets/' . $ticket->id . '/reply') ?>" method="POST"><?= csrf_field() ?>
<textarea name="message" class="form-control mb-2" rows="4" placeholder="Type your reply..." required></textarea>
<button type="submit" class="btn btn-primary">Send Reply</button></form></div></div>
</div>
<div class="col-md-4">
<div class="card"><div class="card-body">
<form action="<?= url('admin/tickets/' . $ticket->id . '/status') ?>" method="POST"><?= csrf_field() ?>
<label class="form-label">Status</label><select name="status" class="form-select mb-2">
<option value="open" <?= $ticket->status === 'open' ? 'selected' : '' ?>>Open</option>
<option value="in_progress" <?= $ticket->status === 'in_progress' ? 'selected' : '' ?>>In Progress</option>
<option value="waiting" <?= $ticket->status === 'waiting' ? 'selected' : '' ?>>Waiting</option>
<option value="resolved" <?= $ticket->status === 'resolved' ? 'selected' : '' ?>>Resolved</option>
<option value="closed" <?= $ticket->status === 'closed' ? 'selected' : '' ?>>Closed</option>
</select>
<button type="submit" class="btn btn-primary w-100">Update</button></form></div></div>
<p><strong>Priority:</strong> <span class="badge bg-<?= $ticket->priority === 'urgent' ? 'danger' : ($ticket->priority === 'high' ? 'warning' : 'info') ?>"><?= ucfirst($ticket->priority) ?></span></p>
</div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
