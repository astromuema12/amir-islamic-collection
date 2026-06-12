<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title"><?= $blog ? 'Edit Blog Post' : 'Create Blog Post' ?></h4>
<div class="card"><div class="card-body">
<form action="<?= $blog ? url('admin/blogs/update/' . $blog->id) : url('admin/blogs/store') ?>" method="POST" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <div class="row g-3">
        <div class="col-md-8"><label class="form-label">Title *</label><input type="text" name="title" class="form-control" value="<?= $blog ? htmlspecialchars($blog->title) : '' ?>" required></div>
        <div class="col-md-4"><label class="form-label">Category</label><select name="category_id" class="form-select"><option value="">None</option><?php foreach ($categories as $cat): ?><option value="<?= $cat->id ?>" <?= $blog && $blog->category_id == $cat->id ? 'selected' : '' ?>><?= htmlspecialchars($cat->name) ?></option><?php endforeach; ?></select></div>
        <div class="col-md-6"><label class="form-label">Featured Image</label><input type="file" name="featured_image" class="form-control" accept="image/*"></div>
        <div class="col-md-3"><label class="form-label">Status</label><select name="status" class="form-select"><option value="draft" <?= $blog && $blog->status === 'draft' ? 'selected' : '' ?>>Draft</option><option value="published" <?= $blog && $blog->status === 'published' ? 'selected' : '' ?>>Published</option><option value="archived" <?= $blog && $blog->status === 'archived' ? 'selected' : '' ?>>Archived</option></select></div>
        <div class="col-md-3"><div class="form-check mt-4"><input class="form-check-input" type="checkbox" name="is_featured" value="1" <?= $blog && $blog->is_featured ? 'checked' : '' ?>><label class="form-check-label">Featured Post</label></div></div>
        <div class="col-12"><label class="form-label">Excerpt</label><textarea name="excerpt" class="form-control" rows="3"><?= $blog ? htmlspecialchars($blog->excerpt) : '' ?></textarea></div>
        <div class="col-12"><label class="form-label">Content *</label><textarea name="content" class="form-control" rows="15"><?= $blog ? $blog->content : '' ?></textarea></div>
        <div class="col-md-6"><label class="form-label">Tags (comma separated)</label><input type="text" name="tags" class="form-control" value="<?= $blog ? htmlspecialchars($blog->tags) : '' ?>"></div>
        <div class="col-md-6"><label class="form-label">Meta Title</label><input type="text" name="meta_title" class="form-control" value="<?= $blog ? htmlspecialchars($blog->meta_title) : '' ?>"></div>
        <div class="col-12"><label class="form-label">Meta Description</label><textarea name="meta_description" class="form-control" rows="2"><?= $blog ? htmlspecialchars($blog->meta_description) : '' ?></textarea></div>
        <div class="col-12"><button type="submit" class="btn btn-primary"><?= $blog ? 'Update' : 'Create' ?></button><a href="<?= url('admin/blogs') ?>" class="btn btn-outline-secondary ms-2">Cancel</a></div>
    </div>
</form></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
