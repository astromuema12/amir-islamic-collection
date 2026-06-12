<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="deals-header"><div class="container"><h1><i class="fas fa-tags"></i> Hot Deals</h1><p>Amazing discounts on Islamic products</p></div></section>
<section class="section-padding"><div class="container"><div class="row g-3">
<?php if (!empty($products)): foreach ($products as $product): ?><div class="col-lg-3 col-md-4 col-6"><div class="product-card">
<div class="product-badge">-<?= $product->getDiscountPercent() ?>%</div>
<div class="product-image"><a href="<?= url('product/' . $product->slug) ?>"><img src="<?= asset('images/no-image.jpg') ?>" alt="<?= htmlspecialchars($product->name) ?>"></a></div>
<div class="product-info"><h6><a href="<?= url('product/' . $product->slug) ?>"><?= htmlspecialchars(truncate($product->name, 40)) ?></a></h6>
<div class="product-price"><span class="current-price"><?= format_price($product->getEffectivePrice()) ?></span><span class="old-price"><?= format_price($product->price) ?></span></div></div></div></div>
<?php endforeach; else: ?><div class="col-12"><div class="empty-state"><i class="fas fa-tags"></i><h3>No deals available</h3><p>Check back later for new offers</p></div></div><?php endif; ?>
</div></div></section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
