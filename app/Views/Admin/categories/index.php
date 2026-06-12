<?php require __DIR__ . '/../partials/header.php'; ?>
<div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="page-title mb-0">Categories</h4>
    <a href="<?= url('admin/categories/create') ?>" class="btn btn-primary"><i class="fas fa-plus"></i> Add Category</a>
</div>
<div class="card"><div class="card-body p-0"><div class="table-responsive">
<table class="table"><thead><tr><th>ID</th><th>Name</th><th>Parent</th><th>Products</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($categories as $c): ?><tr>
<td><?= $c->id ?></td><td><?= htmlspecialchars($c->name) ?></td><td><?= htmlspecialchars($c->parent_name ?? '-') ?></td><td><?= $c->product_count ?? 0 ?></td>
<td><span class="badge bg-<?= $c->status === 'active' ? 'success' : 'secondary' ?>"><?= ucfirst($c->status) ?></span></td><td><?= $c->sort_order ?></td>
<td><a href="<?= url('admin/categories/edit/' . $c->id) ?>" class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></a>
<form action="<?= url('admin/categories/delete/' . $c->id) ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></button></form></td>
</tr><?php endforeach; ?></tbody></table></div></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
