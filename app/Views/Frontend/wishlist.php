<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="page-banner"><div class="container"><h1>My Wishlist</h1><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li><li class="breadcrumb-item active">Wishlist</li></ol></nav></div></section>
<section class="section-padding">
    <div class="container">
        <?php if (!empty($wishlistItems)): ?><div class="row g-3">
            <?php foreach ($wishlistItems as $item): ?><div class="col-lg-3 col-md-4 col-6">
                <div class="product-card"><div class="product-image"><a href="<?= url('product/' . $item->slug) ?>"><img src="<?= $item->primary_image ? upload_url('products/' . $item->primary_image) : asset('images/no-image.jpg') ?>" alt="<?= htmlspecialchars($item->name) ?>"></a><div class="product-actions"><button class="action-btn remove-from-wishlist" data-product-id="<?= $item->product_id ?>"><i class="fas fa-trash"></i></button><button class="action-btn add-to-cart-btn" data-product-id="<?= $item->product_id ?>"><i class="fas fa-shopping-cart"></i></button></div></div>
                    <div class="product-info"><h6><a href="<?= url('product/' . $item->slug) ?>"><?= htmlspecialchars(truncate($item->name, 40)) ?></a></h6><div class="product-price"><span class="current-price"><?= format_price($item->sale_price ?: $item->price) ?></span></div></div></div>
            </div><?php endforeach; ?>
        </div><?php else: ?><div class="empty-state"><i class="fas fa-heart"></i><h3>Your wishlist is empty</h3><p>Start adding items you love</p><a href="<?= url('shop') ?>" class="btn btn-primary">Browse Products</a></div><?php endif; ?>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
