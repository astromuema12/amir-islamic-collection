<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Reviews</h4>
<div class="card"><div class="card-body p-0"><table class="table"><thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($reviews as $r): ?><tr>
<td><?= htmlspecialchars(truncate($r->product_name, 30)) ?></td><td><?= htmlspecialchars(($r->first_name ?? '') . ' ' . ($r->last_name ?? '')) ?></td>
<td><?php for ($i=1;$i<=5;$i++): ?><i class="fas fa-star<?= $i<=$r->rating ? '' : '-o' ?>" style="color:#D4AF37;font-size:12px"></i><?php endfor; ?></td>
<td><?= htmlspecialchars(truncate($r->comment, 60)) ?></td>
<td><span class="badge bg-<?= $r->status === 'approved' ? 'success' : ($r->status === 'rejected' ? 'danger' : 'warning') ?>"><?= ucfirst($r->status) ?></span></td>
<td><?= date('d M Y', strtotime($r->created_at)) ?></td>
<td>
<form action="<?= url('admin/reviews/' . $r->id . '/approve') ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-success" title="Approve"><i class="fas fa-check"></i></button></form>
<form action="<?= url('admin/reviews/' . $r->id . '/reject') ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-warning" title="Reject"><i class="fas fa-times"></i></button></form>
<form action="<?= url('admin/reviews/' . $r->id . '/delete') ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></button></form>
</td></tr><?php endforeach; ?></tbody></table></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
