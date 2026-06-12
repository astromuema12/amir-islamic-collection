<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Customer: <?= htmlspecialchars($customer->getFullName()) ?></h4>
<div class="row"><div class="col-md-4">
    <div class="card"><div class="card-body text-center"><i class="fas fa-user-circle fa-5x" style="color:#0F766E"></i><h5 class="mt-3"><?= htmlspecialchars($customer->getFullName()) ?></h5>
    <p class="text-muted"><?= htmlspecialchars($customer->email) ?></p>
    <p><span class="badge bg-<?= $customer->status === 'active' ? 'success' : 'danger' ?>"><?= ucfirst($customer->status) ?></span></p>
    <form action="<?= url('admin/customers/' . $customer->id . '/status') ?>" method="POST"><?= csrf_field() ?>
        <select name="status" class="form-select mb-2"><option value="active" <?= $customer->status === 'active' ? 'selected' : '' ?>>Active</option><option value="inactive" <?= $customer->status === 'inactive' ? 'selected' : '' ?>>Inactive</option><option value="suspended" <?= $customer->status === 'suspended' ? 'selected' : '' ?>>Suspended</option></select>
        <button type="submit" class="btn btn-primary w-100">Update Status</button></form></div></div>
</div><div class="col-md-8">
    <div class="card"><div class="card-header">Orders</div><div class="card-body p-0">
    <table class="table"><thead><tr><th>Order #</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
    <tbody><?php foreach ($orders as $o): ?><tr><td><?= htmlspecialchars($o->order_number) ?></td><td><?= format_price($o->total) ?></td>
    <td><span class="badge bg-<?= $o->status === 'delivered' ? 'success' : 'warning' ?>"><?= ucfirst($o->status) ?></span></td><td><?= date('d M Y', strtotime($o->created_at)) ?></td></tr><?php endforeach; ?></tbody></table></div></div>
</div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
