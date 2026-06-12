<?php require __DIR__ . '/../partials/header.php'; ?>
<div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="page-title mb-0">Orders</h4>
    <div class="btn-group">
        <a href="<?= url('admin/orders') ?>" class="btn btn-sm btn-outline-primary <?= !$currentStatus ? 'active' : '' ?>">All</a>
        <a href="?status=pending" class="btn btn-sm btn-outline-warning <?= $currentStatus === 'pending' ? 'active' : '' ?>">Pending</a>
        <a href="?status=paid" class="btn btn-sm btn-outline-info <?= $currentStatus === 'paid' ? 'active' : '' ?>">Paid</a>
        <a href="?status=processing" class="btn btn-sm btn-outline-primary <?= $currentStatus === 'processing' ? 'active' : '' ?>">Processing</a>
        <a href="?status=shipped" class="btn btn-sm btn-outline-secondary <?= $currentStatus === 'shipped' ? 'active' : '' ?>">Shipped</a>
        <a href="?status=delivered" class="btn btn-sm btn-outline-success <?= $currentStatus === 'delivered' ? 'active' : '' ?>">Delivered</a>
        <a href="?status=cancelled" class="btn btn-sm btn-outline-danger <?= $currentStatus === 'cancelled' ? 'active' : '' ?>">Cancelled</a>
    </div>
</div>
<div class="card"><div class="card-body p-0"><div class="table-responsive">
<table class="table"><thead><tr><th>Order #</th><th>Customer</th><th>Email</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr></thead>
<tbody><?php foreach ($orders as $o): ?><tr>
<td><?= htmlspecialchars($o->order_number) ?></td><td><?= htmlspecialchars(($o->first_name ?? '') . ' ' . ($o->last_name ?? '')) ?></td><td><?= htmlspecialchars($o->email) ?></td><td><?= format_price($o->total) ?></td>
<td><span class="badge bg-<?= $o->payment_status === 'completed' ? 'success' : 'warning' ?>"><?= ucfirst($o->payment_status) ?></span></td>
<td><span class="badge bg-<?= $o->status === 'delivered' ? 'success' : ($o->status === 'cancelled' ? 'danger' : 'warning') ?>"><?= ucfirst($o->status) ?></span></td>
<td><?= date('d M Y', strtotime($o->created_at)) ?></td>
<td><a href="<?= url('admin/orders/' . $o->id) ?>" class="btn btn-sm btn-outline-primary">View</a></td>
</tr><?php endforeach; ?></tbody></table></div></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
