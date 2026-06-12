<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title"><?= $product ? 'Edit Product' : 'Create Product' ?></h4>
<div class="card"><div class="card-body">
<form action="<?= $product ? url('admin/products/update/' . $product->id) : url('admin/products/store') ?>" method="POST" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <div class="row g-3">
        <div class="col-md-8">
            <label class="form-label">Product Name *</label>
            <input type="text" name="name" class="form-control" value="<?= $product ? htmlspecialchars($product->name) : '' ?>" required>
        </div>
        <div class="col-md-4">
            <label class="form-label">SKU</label>
            <input type="text" name="sku" class="form-control" value="<?= $product ? htmlspecialchars($product->sku) : '' ?>">
        </div>
        <div class="col-md-4">
            <label class="form-label">Category</label>
            <select name="category_id" class="form-select">
                <option value="">Select Category</option>
                <?php foreach ($categories as $cat): ?>
                    <option value="<?= $cat->id ?>" <?= $product && $product->category_id == $cat->id ? 'selected' : '' ?>><?= htmlspecialchars($cat->name) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-4">
            <label class="form-label">Brand</label>
            <select name="brand_id" class="form-select">
                <option value="">Select Brand</option>
                <?php foreach ($brands as $brand): ?>
                    <option value="<?= $brand->id ?>" <?= $product && $product->brand_id == $brand->id ? 'selected' : '' ?>><?= htmlspecialchars($brand->name) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-4">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
                <option value="active" <?= $product && $product->status === 'active' ? 'selected' : '' ?>>Active</option>
                <option value="inactive" <?= $product && $product->status === 'inactive' ? 'selected' : '' ?>>Inactive</option>
                <option value="draft" <?= $product && $product->status === 'draft' ? 'selected' : '' ?>>Draft</option>
            </select>
        </div>
        <div class="col-md-3">
            <label class="form-label">Price *</label>
            <input type="number" step="0.01" name="price" class="form-control" value="<?= $product ? $product->price : '' ?>" required>
        </div>
        <div class="col-md-3">
            <label class="form-label">Sale Price</label>
            <input type="number" step="0.01" name="sale_price" class="form-control" value="<?= $product ? $product->sale_price : '' ?>">
        </div>
        <div class="col-md-3">
            <label class="form-label">Cost Price</label>
            <input type="number" step="0.01" name="cost_price" class="form-control" value="<?= $product ? $product->cost_price : '' ?>">
        </div>
        <div class="col-md-3">
            <label class="form-label">Stock Quantity *</label>
            <input type="number" name="stock_quantity" class="form-control" value="<?= $product ? $product->stock_quantity : '0' ?>" min="0">
        </div>
        <div class="col-md-12">
            <label class="form-label">Short Description</label>
            <textarea name="short_description" class="form-control" rows="2"><?= $product ? htmlspecialchars($product->short_description) : '' ?></textarea>
        </div>
        <div class="col-md-12">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="6"><?= $product ? $product->description : '' ?></textarea>
        </div>
        <div class="col-md-12">
            <div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="is_featured" value="1" <?= $product && $product->is_featured ? 'checked' : '' ?>><label class="form-check-label">Featured</label></div>
            <div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="is_bestseller" value="1" <?= $product && $product->is_bestseller ? 'checked' : '' ?>><label class="form-check-label">Best Seller</label></div>
            <div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="is_trending" value="1" <?= $product && $product->is_trending ? 'checked' : '' ?>><label class="form-check-label">Trending</label></div>
            <div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="is_new" value="1" <?= $product && $product->is_new ? 'checked' : '' ?>><label class="form-check-label">New</label></div>
        </div>
        <div class="col-md-12">
            <label class="form-label">Product Images</label>
            <input type="file" name="images[]" class="form-control" multiple accept="image/*">
            <?php if (isset($images) && !empty($images)): ?>
                <div class="mt-2 d-flex gap-2"><?php foreach ($images as $img): ?><img src="<?= $img->getUrl() ?>" style="width:80px;height:80px;object-fit:cover;border-radius:4px;"><?php endforeach; ?></div>
            <?php endif; ?>
        </div>
        <div class="col-md-6">
            <label class="form-label">Meta Title</label>
            <input type="text" name="meta_title" class="form-control" value="<?= $product ? htmlspecialchars($product->meta_title) : '' ?>">
        </div>
        <div class="col-md-6">
            <label class="form-label">Meta Description</label>
            <textarea name="meta_description" class="form-control" rows="2"><?= $product ? htmlspecialchars($product->meta_description) : '' ?></textarea>
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary"><?= $product ? 'Update Product' : 'Create Product' ?></button>
            <a href="<?= url('admin/products') ?>" class="btn btn-outline-secondary">Cancel</a>
        </div>
    </div>
</form></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
