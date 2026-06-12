<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Coupons</h4>
<div class="card"><div class="card-body">
<button class="btn btn-primary mb-3" onclick="$('#addCouponModal').modal('show')"><i class="fas fa-plus"></i> Add Coupon</button>
<div class="table-responsive"><table class="table"><thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Used</th><th>Limit</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($coupons as $c): ?><tr>
<td><strong><?= htmlspecialchars($c->code) ?></strong></td><td><span class="badge bg-info"><?= ucfirst($c->type) ?></span></td>
<td><?= $c->type === 'percentage' ? $c->value . '%' : format_price($c->value) ?></td><td><?= format_price($c->min_order_amount) ?></td>
<td><?= $c->used_count ?> / <?= $c->usage_limit ?: '∞' ?></td><td><?= $c->per_user_limit ?></td>
<td><?= $c->expires_at ? date('d M Y', strtotime($c->expires_at)) : 'Never' ?></td>
<td><span class="badge bg-<?= $c->is_active ? 'success' : 'danger' ?>"><?= $c->is_active ? 'Active' : 'Inactive' ?></span></td>
<td><button class="btn btn-sm btn-outline-primary" onclick="editCoupon(<?= $c->id ?>, '<?= htmlspecialchars($c->code) ?>', '<?= $c->type ?>', <?= $c->value ?>, <?= $c->min_order_amount ?>, <?= $c->max_discount ?: 'null' ?>, <?= $c->usage_limit ?: 0 ?>, <?= $c->per_user_limit ?>, '<?= $c->starts_at ?>', '<?= $c->expires_at ?>', <?= $c->is_active ?>)"><i class="fas fa-edit"></i></button>
<form action="<?= url('admin/coupons/delete/' . $c->id) ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></button></form></td>
</tr><?php endforeach; ?></tbody></table></div></div></div>

<!-- Add Modal -->
<div class="modal fade" id="addCouponModal"><div class="modal-dialog modal-lg"><div class="modal-content">
<form action="<?= url('admin/coupons/store') ?>" method="POST"><?= csrf_field() ?>
<div class="modal-header"><h5 class="modal-title">Add Coupon</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
<div class="modal-body"><div class="row g-3">
<div class="col-md-6"><label class="form-label">Code</label><input type="text" name="code" class="form-control" required></div>
<div class="col-md-3"><label class="form-label">Type</label><select name="type" class="form-select"><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></div>
<div class="col-md-3"><label class="form-label">Value</label><input type="number" step="0.01" name="value" class="form-control" required></div>
<div class="col-md-4"><label class="form-label">Min Order Amount</label><input type="number" step="0.01" name="min_order_amount" class="form-control" value="0"></div>
<div class="col-md-4"><label class="form-label">Max Discount</label><input type="number" step="0.01" name="max_discount" class="form-control"></div>
<div class="col-md-4"><div class="form-check mt-4"><input class="form-check-input" type="checkbox" name="is_active" value="1" checked><label class="form-check-label">Active</label></div></div>
<div class="col-md-4"><label class="form-label">Usage Limit (0 = unlimited)</label><input type="number" name="usage_limit" class="form-control" value="0"></div>
<div class="col-md-4"><label class="form-label">Per User Limit</label><input type="number" name="per_user_limit" class="form-control" value="1"></div>
<div class="col-md-4"><label class="form-label">Start Date</label><input type="datetime-local" name="starts_at" class="form-control"></div>
<div class="col-md-4"><label class="form-label">Expiry Date</label><input type="datetime-local" name="expires_at" class="form-control"></div>
</div></div>
<div class="modal-footer"><button type="submit" class="btn btn-primary">Save</button></div></form></div></div></div>

<!-- Edit Modal -->
<div class="modal fade" id="editCouponModal"><div class="modal-dialog modal-lg"><div class="modal-content">
<form action="" method="POST" id="editCouponForm"><?= csrf_field() ?>
<div class="modal-header"><h5 class="modal-title">Edit Coupon</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
<div class="modal-body"><div class="row g-3">
<div class="col-md-6"><label class="form-label">Code</label><input type="text" name="code" id="editCode" class="form-control" required></div>
<div class="col-md-3"><label class="form-label">Type</label><select name="type" id="editType" class="form-select"><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></div>
<div class="col-md-3"><label class="form-label">Value</label><input type="number" step="0.01" name="value" id="editValue" class="form-control" required></div>
<div class="col-md-4"><label class="form-label">Min Order</label><input type="number" step="0.01" name="min_order_amount" id="editMinOrder" class="form-control"></div>
<div class="col-md-4"><label class="form-label">Max Discount</label><input type="number" step="0.01" name="max_discount" id="editMaxDiscount" class="form-control"></div>
<div class="col-md-4"><div class="form-check mt-4"><input class="form-check-input" type="checkbox" name="is_active" id="editActive" value="1"><label class="form-check-label">Active</label></div></div>
<div class="col-md-4"><label class="form-label">Usage Limit</label><input type="number" name="usage_limit" id="editUsageLimit" class="form-control"></div>
<div class="col-md-4"><label class="form-label">Per User Limit</label><input type="number" name="per_user_limit" id="editPerUserLimit" class="form-control"></div>
<div class="col-md-4"><label class="form-label">Start</label><input type="datetime-local" name="starts_at" id="editStarts" class="form-control"></div>
<div class="col-md-4"><label class="form-label">Expiry</label><input type="datetime-local" name="expires_at" id="editExpires" class="form-control"></div>
</div></div>
<div class="modal-footer"><button type="submit" class="btn btn-primary">Update</button></div></form></div></div></div>

<script>
function editCoupon(id, code, type, value, minOrder, maxDiscount, usageLimit, perUserLimit, starts, expires, active) {
    $('#editCouponForm').attr('action', '<?= url('admin/coupons/update/') ?>' + id);
    $('#editCode').val(code); $('#editType').val(type); $('#editValue').val(value);
    $('#editMinOrder').val(minOrder); $('#editMaxDiscount').val(maxDiscount || '');
    $('#editUsageLimit').val(usageLimit); $('#editPerUserLimit').val(perUserLimit);
    $('#editStarts').val(starts ? starts.replace(' ', 'T') : '');
    $('#editExpires').val(expires ? expires.replace(' ', 'T') : '');
    $('#editActive').prop('checked', active);
    $('#editCouponModal').modal('show');
}
</script>
<?php require __DIR__ . '/../partials/footer.php'; ?>
