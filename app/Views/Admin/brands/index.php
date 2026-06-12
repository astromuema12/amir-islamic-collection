<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Brands</h4>
<div class="card"><div class="card-body">
<button class="btn btn-primary mb-3" onclick="$('#addBrandModal').modal('show')"><i class="fas fa-plus"></i> Add Brand</button>
<div class="table-responsive"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($brands as $b): ?><tr><td><?= $b->id ?></td><td><?= htmlspecialchars($b->name) ?></td><td><?= htmlspecialchars($b->slug) ?></td>
<td><span class="badge bg-<?= $b->status === 'active' ? 'success' : 'secondary' ?>"><?= ucfirst($b->status) ?></span></td>
<td>
<button class="btn btn-sm btn-outline-primary" onclick="editBrand(<?= $b->id ?>, '<?= htmlspecialchars($b->name, ENT_QUOTES) ?>', '<?= htmlspecialchars($b->description ?? '', ENT_QUOTES) ?>', '<?= $b->status ?>')"><i class="fas fa-edit"></i></button>
<form action="<?= url('admin/brands/delete/' . $b->id) ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></button></form>
</td></tr><?php endforeach; ?></tbody></table></div></div></div>

<!-- Add Modal -->
<div class="modal fade" id="addBrandModal"><div class="modal-dialog"><div class="modal-content">
<form action="<?= url('admin/brands/store') ?>" method="POST"><?= csrf_field() ?>
<div class="modal-header"><h5 class="modal-title">Add Brand</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
<div class="modal-body">
<div class="mb-3"><label class="form-label">Name</label><input type="text" name="name" class="form-control" required></div>
<div class="mb-3"><label class="form-label">Description</label><textarea name="description" class="form-control"></textarea></div>
<div class="mb-3"><label class="form-label">Website</label><input type="url" name="website" class="form-control"></div>
<div class="mb-3"><label class="form-label">Status</label><select name="status" class="form-select"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
</div>
<div class="modal-footer"><button type="submit" class="btn btn-primary">Save</button></div></form></div></div></div>

<!-- Edit Modal -->
<div class="modal fade" id="editBrandModal"><div class="modal-dialog"><div class="modal-content">
<form action="" method="POST" id="editBrandForm"><?= csrf_field() ?>
<div class="modal-header"><h5 class="modal-title">Edit Brand</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
<div class="modal-body">
<div class="mb-3"><label class="form-label">Name</label><input type="text" name="name" id="editBrandName" class="form-control" required></div>
<div class="mb-3"><label class="form-label">Description</label><textarea name="description" id="editBrandDesc" class="form-control"></textarea></div>
<div class="mb-3"><label class="form-label">Website</label><input type="url" name="website" id="editBrandWebsite" class="form-control"></div>
<div class="mb-3"><label class="form-label">Status</label><select name="status" id="editBrandStatus" class="form-select"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
</div>
<div class="modal-footer"><button type="submit" class="btn btn-primary">Update</button></div></form></div></div></div>

<script>
function editBrand(id, name, desc, status) {
    $('#editBrandForm').attr('action', '<?= url('admin/brands/update/') ?>' + id);
    $('#editBrandName').val(name);
    $('#editBrandDesc').val(desc);
    $('#editBrandStatus').val(status);
    $('#editBrandModal').modal('show');
}
</script>
<?php require __DIR__ . '/../partials/footer.php'; ?>
