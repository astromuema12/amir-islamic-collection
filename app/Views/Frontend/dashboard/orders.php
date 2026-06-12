<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="section-padding"><div class="container"><div class="row"><div class="col-md-3"><?php require VIEWS_PATH . '/Frontend/dashboard/sidebar.php'; ?></div>
<div class="col-md-9"><div class="dashboard-content"><h3>My Orders</h3>
<?php if (!empty($orders)): ?><div class="table-responsive"><table class="table"><thead><tr><th>Order #</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
<tbody><?php foreach ($orders as $o): $items = $o->items(); ?><tr><td><?= htmlspecialchars($o->order_number) ?></td><td><?= date('d M Y', strtotime($o->created_at)) ?></td>
<td><?= array_sum(array_map(fn($i) => $i->quantity, $items)) ?></td><td><?= format_price($o->total) ?></td>
<td><span class="badge bg-<?= $o->payment_status === 'completed' ? 'success' : 'warning' ?>"><?= ucfirst($o->payment_status) ?></span></td>
<td><span class="badge bg-<?= $o->status === 'delivered' ? 'success' : ($o->status === 'cancelled' ? 'danger' : 'warning') ?>"><?= ucfirst($o->status) ?></span></td>
<td><a href="<?= url('dashboard/orders/' . $o->id) ?>" class="btn btn-sm btn-outline-primary">View</a></td></tr><?php endforeach; ?></tbody></table></div>
<?php else: ?><p>No orders found. <a href="<?= url('shop') ?>">Start shopping!</a></p><?php endif; ?></div></div></div></div></section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
