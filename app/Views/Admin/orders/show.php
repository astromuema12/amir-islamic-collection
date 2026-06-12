<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Order #<?= htmlspecialchars($order->order_number) ?></h4>
<div class="row">
    <div class="col-md-8">
        <div class="card"><div class="card-header">Order Items</div>
            <div class="card-body p-0"><table class="table"><thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody><?php foreach ($items as $item): ?><tr><td><?= htmlspecialchars($item->product_name) ?></td><td><?= htmlspecialchars($item->product_sku ?: '-') ?></td><td><?= $item->quantity ?></td><td><?= format_price($item->unit_price) ?></td><td><?= format_price($item->total_price) ?></td></tr><?php endforeach; ?></tbody></table></div></div>
        <div class="card mt-3"><div class="card-header">Status History</div>
            <div class="card-body"><?php foreach ($statusHistory as $sh): ?><div class="d-flex justify-content-between mb-2"><span><span class="badge bg-info"><?= ucfirst($sh->status) ?></span> <?= htmlspecialchars($sh->comment ?: '') ?></span><small class="text-muted"><?= date('d M Y H:i', strtotime($sh->created_at)) ?></small></div><?php endforeach; ?></div></div>
    </div>
    <div class="col-md-4">
        <div class="card"><div class="card-header">Order Details</div>
            <div class="card-body">
                <p><strong>Order #:</strong> <?= htmlspecialchars($order->order_number) ?></p>
                <p><strong>Date:</strong> <?= date('d M Y H:i', strtotime($order->created_at)) ?></p>
                <p><strong>Email:</strong> <?= htmlspecialchars($order->email) ?></p>
                <p><strong>Phone:</strong> <?= htmlspecialchars($order->phone) ?></p>
                <p><strong>Payment:</strong> <?= ucfirst($order->payment_method) ?> - <span class="badge bg-<?= $order->payment_status === 'completed' ? 'success' : 'warning' ?>"><?= $order->payment_status ?></span></p>
                <hr>
                <p><strong>Subtotal:</strong> <?= format_price($order->subtotal) ?></p>
                <?php if ($order->discount > 0): ?><p><strong>Discount:</strong> -<?= format_price($order->discount) ?></p><?php endif; ?>
                <p><strong>Tax:</strong> <?= format_price($order->tax) ?></p>
                <p><strong>Shipping:</strong> <?= format_price($order->shipping_cost) ?></p>
                <p><strong>Total:</strong> <?= format_price($order->total) ?></p>
                <hr>
                <p><strong>Coupon:</strong> <?= $order->coupon_code ?: 'None' ?></p>
                <?php if ($order->tracking_number): ?><p><strong>Tracking:</strong> <?= htmlspecialchars($order->tracking_number) ?></p><?php endif; ?>
                <hr>
                <form action="<?= url('admin/orders/' . $order->id . '/status') ?>" method="POST"><?= csrf_field() ?>
                    <label class="form-label">Update Status</label>
                    <select name="status" class="form-select mb-2">
                        <option value="pending" <?= $order->status === 'pending' ? 'selected' : '' ?>>Pending</option>
                        <option value="paid" <?= $order->status === 'paid' ? 'selected' : '' ?>>Paid</option>
                        <option value="processing" <?= $order->status === 'processing' ? 'selected' : '' ?>>Processing</option>
                        <option value="shipped" <?= $order->status === 'shipped' ? 'selected' : '' ?>>Shipped</option>
                        <option value="delivered" <?= $order->status === 'delivered' ? 'selected' : '' ?>>Delivered</option>
                        <option value="cancelled" <?= $order->status === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
                        <option value="returned" <?= $order->status === 'returned' ? 'selected' : '' ?>>Returned</option>
                        <option value="refunded" <?= $order->status === 'refunded' ? 'selected' : '' ?>>Refunded</option>
                    </select>
                    <textarea name="comment" class="form-control mb-2" placeholder="Comment (optional)" rows="2"></textarea>
                    <button type="submit" class="btn btn-primary w-100">Update Status</button>
                </form>
            </div>
        </div>
    </div>
</div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
