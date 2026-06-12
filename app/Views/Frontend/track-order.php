<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="page-banner"><div class="container"><h1>Track Your Order</h1></div></section>
<section class="section-padding">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <form action="<?= url('track-order') ?>" method="POST" class="track-form">
                    <?= csrf_field() ?>
                    <div class="mb-3"><label class="form-label">Order Number</label><input type="text" name="order_number" class="form-control" placeholder="e.g., AIC-XXXXXXXX-20240101" required></div>
                    <div class="mb-3"><label class="form-label">Email Address</label><input type="email" name="email" class="form-control" required></div>
                    <button type="submit" class="btn btn-primary w-100"><i class="fas fa-search"></i> Track Order</button>
                </form>

                <?php if (isset($order)): ?>
                    <div class="order-tracking-result mt-4">
                        <div class="tracking-status">
                            <div class="status-timeline">
                                <div class="status-item completed"><i class="fas fa-check-circle"></i><span>Order Placed</span><small><?= date('M d, Y', strtotime($order->created_at)) ?></small></div>
                                <div class="status-item <?= in_array($order->status, ['paid','processing','shipped','delivered']) ? 'completed' : '' ?>"><i class="fas fa-credit-card"></i><span>Payment Confirmed</span></div>
                                <div class="status-item <?= in_array($order->status, ['processing','shipped','delivered']) ? 'completed' : '' ?>"><i class="fas fa-cog"></i><span>Processing</span></div>
                                <div class="status-item <?= in_array($order->status, ['shipped','delivered']) ? 'completed' : '' ?>"><i class="fas fa-truck"></i><span>Shipped</span></div>
                                <div class="status-item <?= $order->status === 'delivered' ? 'completed' : '' ?>"><i class="fas fa-home"></i><span>Delivered</span></div>
                            </div>
                            <div class="tracking-details mt-4">
                                <p><strong>Order:</strong> <?= htmlspecialchars($order->order_number) ?></p>
                                <p><strong>Status:</strong> <span class="badge bg-<?= $order->status === 'delivered' ? 'success' : ($order->status === 'cancelled' ? 'danger' : 'warning') ?>"><?= ucfirst($order->status) ?></span></p>
                                <?php if ($order->tracking_number): ?><p><strong>Tracking:</strong> <?= htmlspecialchars($order->tracking_number) ?></p><?php endif; ?>
                                <p><strong>Total:</strong> <?= format_price($order->total) ?></p>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
