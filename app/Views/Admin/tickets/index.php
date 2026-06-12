<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Support Tickets</h4>
<div class="card"><div class="card-body p-0"><table class="table"><thead><tr><th>Ticket #</th><th>Subject</th><th>Customer</th><th>Priority</th><th>Status</th><th>Date</th><th></th></tr></thead>
<tbody><?php foreach ($tickets as $t): ?><tr><td><?= htmlspecialchars($t->ticket_number) ?></td><td><?= htmlspecialchars(truncate($t->subject, 40)) ?></td><td><?= htmlspecialchars(($t->first_name ?? '') . ' ' . ($t->last_name ?? '')) ?></td>
<td><span class="badge bg-<?= $t->priority === 'urgent' ? 'danger' : ($t->priority === 'high' ? 'warning' : 'info') ?>"><?= ucfirst($t->priority) ?></span></td>
<td><span class="badge bg-<?= $t->status === 'open' ? 'primary' : ($t->status === 'resolved' ? 'success' : ($t->status === 'closed' ? 'secondary' : 'warning')) ?>"><?= str_replace('_', ' ', ucfirst($t->status)) ?></span></td>
<td><?= date('d M Y', strtotime($t->created_at)) ?></td>
<td><a href="<?= url('admin/tickets/' . $t->id) ?>" class="btn btn-sm btn-outline-primary">View</a></td></tr><?php endforeach; ?></tbody></table></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
