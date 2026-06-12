<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="section-padding">
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <?php require VIEWS_PATH . '/Frontend/dashboard/sidebar.php'; ?>
            </div>
            <div class="col-md-9">
                <div class="dashboard-content">
                    <h3>Welcome, <?= htmlspecialchars($user->getFullName()) ?>!</h3>
                    <div class="row g-3 mt-3">
                        <div class="col-md-3 col-6"><div class="dashboard-stat"><i class="fas fa-shopping-bag"></i><h4><?= $orderCount ?></h4><span>Orders</span></div></div>
                        <div class="col-md-3 col-6"><div class="dashboard-stat"><i class="fas fa-heart"></i><h4><?= $wishlistCount ?></h4><span>Wishlist</span></div></div>
                        <div class="col-md-3 col-6"><div class="dashboard-stat"><i class="fas fa-bell"></i><h4><?= $notificationCount ?></h4><span>Notifications</span></div></div>
                        <div class="col-md-3 col-6"><div class="dashboard-stat"><i class="fas fa-star"></i><h4><?= $user->email_verified_at ? 'Verified' : 'Unverified' ?></h4><span>Account</span></div></div>
                    </div>

                    <h4 class="mt-4">Recent Orders</h4>
                    <?php if (!empty($recentOrders)): ?>
                        <div class="table-responsive"><table class="table"><thead><tr><th>Order #</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
                        <tbody><?php foreach ($recentOrders as $o): ?><tr><td><?= htmlspecialchars($o->order_number) ?></td><td><?= date('M d, Y', strtotime($o->created_at)) ?></td><td><?= format_price($o->total) ?></td><td><span class="badge bg-<?= $o->status === 'delivered' ? 'success' : ($o->status === 'cancelled' ? 'danger' : 'warning') ?>"><?= ucfirst($o->status) ?></span></td>
                        <td><a href="<?= url('dashboard/orders/' . $o->id) ?>" class="btn btn-sm btn-outline-primary">View</a></td></tr><?php endforeach; ?></tbody></table></div>
                    <?php else: ?><p>No orders yet. <a href="<?= url('shop') ?>">Start shopping!</a></p><?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
