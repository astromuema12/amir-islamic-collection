<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Newsletter</h4>
<div class="row"><div class="col-md-8">
<div class="card"><div class="card-header">Subscribers (<?= count($subscribers) ?>)</div>
<div class="card-body p-0"><table class="table"><thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Subscribed</th></tr></thead>
<tbody><?php foreach ($subscribers as $s): ?><tr><td><?= htmlspecialchars($s->email) ?></td><td><?= htmlspecialchars($s->name ?? '-') ?></td>
<td><span class="badge bg-<?= $s->status === 'active' ? 'success' : 'danger' ?>"><?= ucfirst($s->status) ?></span></td><td><?= date('d M Y', strtotime($s->subscribed_at)) ?></td></tr><?php endforeach; ?></tbody></table></div></div>
</div>
<div class="col-md-4">
<div class="card"><div class="card-header">Send Campaign</div>
<div class="card-body">
<form action="<?= url('admin/newsletter/send') ?>" method="POST"><?= csrf_field() ?>
<div class="mb-3"><label class="form-label">Subject</label><input type="text" name="subject" class="form-control" required></div>
<div class="mb-3"><label class="form-label">Message (HTML)</label><textarea name="message" class="form-control" rows="10" required></textarea></div>
<button type="submit" class="btn btn-primary w-100" onclick="return confirm('Send email to all active subscribers?')"><i class="fas fa-paper-plane"></i> Send Campaign</button>
</form></div></div></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
