<?php require __DIR__ . '/partials/header.php'; ?>

<div class="row g-3 mb-4">
    <div class="col-md-3"><div class="stat-card bg-primary-custom"><h3><?= format_price($totalRevenue) ?></h3><p>Total Revenue</p></div></div>
    <div class="col-md-3"><div class="stat-card bg-success-custom"><h3><?= $totalOrders ?></h3><p>Total Orders</p></div></div>
    <div class="col-md-3"><div class="stat-card bg-warning-custom"><h3><?= $totalCustomers ?></h3><p>Total Customers</p></div></div>
    <div class="col-md-3"><div class="stat-card bg-info-custom"><h3><?= $totalProducts ?></h3><p>Total Products</p></div></div>
</div>

<div class="row g-3 mb-4">
    <div class="col-md-3"><div class="card"><div class="card-body text-center"><h5 class="text-warning"><?= $pendingOrders ?></h5><span class="text-muted">Pending Orders</span></div></div></div>
    <div class="col-md-3"><div class="card"><div class="card-body text-center"><h5 class="text-danger"><?= $lowStockProducts ?></h5><span class="text-muted">Low Stock Items</span></div></div></div>
</div>

<div class="row">
    <div class="col-md-8">
        <div class="card"><div class="card-header">Revenue Overview (6 Months)</div>
            <div class="card-body"><canvas id="revenueChart" height="250"></canvas></div>
        </div>
        <div class="card mt-3"><div class="card-header">Recent Orders</div>
            <div class="card-body p-0"><div class="table-responsive"><table class="table"><thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody><?php foreach ($recentOrders as $o): ?><tr><td><?= htmlspecialchars($o->order_number) ?></td><td><?= htmlspecialchars(($o->first_name ?? '') . ' ' . ($o->last_name ?? '')) ?></td><td><?= format_price($o->total) ?></td>
            <td><span class="badge bg-<?= $o->status === 'delivered' ? 'success' : ($o->status === 'cancelled' ? 'danger' : 'warning') ?>"><?= ucfirst($o->status) ?></span></td>
            <td><?= date('d M Y', strtotime($o->created_at)) ?></td></tr><?php endforeach; ?></tbody></table></div></div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card"><div class="card-header">Quick Actions</div>
            <div class="card-body">
                <a href="<?= url('admin/products/create') ?>" class="btn btn-primary w-100 mb-2"><i class="fas fa-plus"></i> Add Product</a>
                <a href="<?= url('admin/orders') ?>" class="btn btn-outline-primary w-100 mb-2"><i class="fas fa-eye"></i> View Orders</a>
                <a href="<?= url('admin/blog/create') ?>" class="btn btn-outline-primary w-100 mb-2"><i class="fas fa-pen"></i> New Blog Post</a>
                <form action="<?= url('admin/maintenance') ?>" method="POST"><?= csrf_field() ?>
                    <button type="submit" class="btn btn-outline-warning w-100"><i class="fas fa-tools"></i> Toggle Maintenance</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
const ctx = document.getElementById('revenueChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: [<?php foreach ($monthlyRevenue as $r): ?>'<?= $r->month ?>',<?php endforeach; ?>],
        datasets: [{
            label: 'Revenue',
            data: [<?php foreach ($monthlyRevenue as $r): ?><?= $r->revenue ?>,<?php endforeach; ?>],
            borderColor: '#0F766E',
            backgroundColor: 'rgba(15, 118, 110, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});
</script>

<?php require __DIR__ . '/partials/footer.php'; ?>
