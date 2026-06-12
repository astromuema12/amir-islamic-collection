<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Sales Report</h4>
<div class="card"><div class="card-body">
<canvas id="salesChart" height="300"></canvas>
</div></div>
<div class="card mt-3"><div class="card-header">Top Selling Products</div>
<div class="card-body p-0"><table class="table"><thead><tr><th>Product</th><th>Sales Count</th></tr></thead>
<tbody><?php foreach ($topProducts as $p): ?><tr><td><?= htmlspecialchars($p->name) ?></td><td><?= $p->sales_count ?></td></tr><?php endforeach; ?></tbody></table></div></div>
<script>
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [<?php foreach ($salesData as $d): ?>'<?= $d->date ?>',<?php endforeach; ?>],
        datasets: [{
            label: 'Orders',
            data: [<?php foreach ($salesData as $d): ?><?= $d->orders ?>,<?php endforeach; ?>],
            backgroundColor: '#0F766E'
        }, {
            label: 'Revenue',
            data: [<?php foreach ($salesData as $d): ?><?= $d->revenue ?>,<?php endforeach; ?>],
            backgroundColor: '#D4AF37',
            yAxisID: 'y1'
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true }, y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false } } }
    }
});
</script>
<?php require __DIR__ . '/../partials/footer.php'; ?>
