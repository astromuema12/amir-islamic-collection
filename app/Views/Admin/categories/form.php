<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title"><?= $category ? 'Edit Category' : 'Create Category' ?></h4>
<div class="card"><div class="card-body">
<form action="<?= $category ? url('admin/categories/update/' . $category->id) : url('admin/categories/store') ?>" method="POST">
    <?= csrf_field() ?>
    <div class="row g-3">
        <div class="col-md-6"><label class="form-label">Name *</label><input type="text" name="name" class="form-control" value="<?= $category ? htmlspecialchars($category->name) : '' ?>" required></div>
        <div class="col-md-3"><label class="form-label">Parent Category</label><select name="parent_id" class="form-select"><option value="">None</option><?php foreach ($parentCategories as $pc): if ($category && $pc->id == $category->id) continue; ?><option value="<?= $pc->id ?>" <?= $category && $category->parent_id == $pc->id ? 'selected' : '' ?>><?= htmlspecialchars($pc->name) ?></option><?php endforeach; ?></select></div>
        <div class="col-md-3"><label class="form-label">Sort Order</label><input type="number" name="sort_order" class="form-control" value="<?= $category ? $category->sort_order : '0' ?>"></div>
        <div class="col-12"><label class="form-label">Description</label><textarea name="description" class="form-control" rows="3"><?= $category ? htmlspecialchars($category->description) : '' ?></textarea></div>
        <div class="col-md-6"><label class="form-label">Meta Title</label><input type="text" name="meta_title" class="form-control" value="<?= $category ? htmlspecialchars($category->meta_title) : '' ?>"></div>
        <div class="col-md-6"><label class="form-label">Meta Description</label><textarea name="meta_description" class="form-control"><?= $category ? htmlspecialchars($category->meta_description) : '' ?></textarea></div>
        <div class="col-md-3"><label class="form-label">Status</label><select name="status" class="form-select"><option value="active" <?= $category && $category->status === 'active' ? 'selected' : '' ?>>Active</option><option value="inactive" <?= $category && $category->status === 'inactive' ? 'selected' : '' ?>>Inactive</option></select></div>
        <div class="col-12"><button type="submit" class="btn btn-primary"><?= $category ? 'Update' : 'Create' ?></button><a href="<?= url('admin/categories') ?>" class="btn btn-outline-secondary ms-2">Cancel</a></div>
    </div>
</form></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
