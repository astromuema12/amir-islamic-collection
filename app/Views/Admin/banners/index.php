<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Banners</h4>
<div class="card"><div class="card-body">
<button class="btn btn-primary mb-3" onclick="$('#addBannerModal').modal('show')"><i class="fas fa-plus"></i> Add Banner</button>
<div class="table-responsive"><table class="table"><thead><tr><th>Image</th><th>Title</th><th>Placement</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($banners as $b): ?><tr><td><?php if($b->image): ?><img src="<?= upload_url($b->image) ?>" style="width:100px;height:50px;object-fit:cover;border-radius:4px"><?php else: ?>-<?php endif; ?></td>
<td><?= htmlspecialchars($b->title) ?></td><td><span class="badge bg-info"><?= ucfirst($b->placement) ?></span></td><td><?= $b->sort_order ?></td>
<td><span class="badge bg-<?= $b->status === 'active' ? 'success' : 'secondary' ?>"><?= ucfirst($b->status) ?></span></td>
<td><form action="<?= url('admin/banners/delete/' . $b->id) ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></button></form></td></tr><?php endforeach; ?></tbody></table></div></div></div>

<div class="modal fade" id="addBannerModal"><div class="modal-dialog"><div class="modal-content">
<form action="<?= url('admin/banners/store') ?>" method="POST" enctype="multipart/form-data"><?= csrf_field() ?>
<div class="modal-header"><h5 class="modal-title">Add Banner</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
<div class="modal-body">
<div class="mb-3"><label class="form-label">Image *</label><input type="file" name="image" class="form-control" required></div>
<div class="mb-3"><label class="form-label">Title</label><input type="text" name="title" class="form-control"></div>
<div class="mb-3"><label class="form-label">Subtitle</label><input type="text" name="subtitle" class="form-control"></div>
<div class="mb-3"><label class="form-label">Description</label><textarea name="description" class="form-control"></textarea></div>
<div class="mb-3"><label class="form-label">Link URL</label><input type="url" name="link" class="form-control"></div>
<div class="mb-3"><label class="form-label">Button Text</label><input type="text" name="btn_text" class="form-control"></div>
<div class="row"><div class="col-md-4"><label class="form-label">Placement</label><select name="placement" class="form-select"><option value="hero">Hero</option><option value="promo">Promo</option><option value="sidebar">Sidebar</option></select></div>
<div class="col-md-4"><label class="form-label">Sort Order</label><input type="number" name="sort_order" class="form-control" value="0"></div>
<div class="col-md-4"><label class="form-label">Status</label><select name="status" class="form-select"><option value="active">Active</option><option value="inactive">Inactive</option></select></div></div>
</div>
<div class="modal-footer"><button type="submit" class="btn btn-primary">Save</button></div></form></div></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
