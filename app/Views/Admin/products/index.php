<?php require __DIR__ . '/../partials/header.php'; ?>
<div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="page-title mb-0">Products</h4>
    <a href="<?= url('admin/products/create') ?>" class="btn btn-primary"><i class="fas fa-plus"></i> Add Product</a>
</div>
<div class="card"><div class="card-body p-0"><div class="table-responsive">
<table class="table" id="productsTable"><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($products as $p): ?><tr>
<td><?= $p->id ?></td><td><a href="<?= url('product/' . $p->slug) ?>" target="_blank"><?= htmlspecialchars(truncate($p->name, 50)) ?></a></td>
<td><?= htmlspecialchars($p->category_name ?? '-') ?></td>
<td><?= format_price($p->sale_price ?: $p->price) ?></td>
<td><span class="badge bg-<?= $p->stock_quantity > 10 ? 'success' : ($p->stock_quantity > 0 ? 'warning' : 'danger') ?>"><?= $p->stock_quantity ?></span></td>
<td><span class="badge bg-<?= $p->status === 'active' ? 'success' : 'secondary' ?>"><?= ucfirst($p->status) ?></span></td>
<td><a href="<?= url('admin/products/edit/' . $p->id) ?>" class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></a>
<form action="<?= url('admin/products/delete/' . $p->id) ?>" method="POST" style="display:inline"><?= csrf_field() ?><button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this product?')"><i class="fas fa-trash"></i></button></form></td>
</tr><?php endforeach; ?></tbody></table></div></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
