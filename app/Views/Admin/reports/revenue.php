<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Revenue Report</h4>
<div class="row"><div class="col-md-3"><div class="stat-card bg-primary-custom"><h3><?= format_price($totalRevenue) ?></h3><p>Total Revenue</p></div></div></div>
<div class="card mt-3"><div class="card-body"><canvas id="revenueChart" height="300"></canvas></div></div>
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
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
});
</script>
<?php require __DIR__ . '/../partials/footer.php'; ?>
