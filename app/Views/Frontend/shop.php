<?php require VIEWS_PATH . '/Layouts/header.php'; ?>

<section class="page-banner">
    <div class="container">
        <h1><?= isset($currentCategory) ? htmlspecialchars($currentCategory->name) : 'Our Shop' ?></h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li>
                <li class="breadcrumb-item active"><?= isset($currentCategory) ? htmlspecialchars($currentCategory->name) : 'Shop' ?></li>
            </ol>
        </nav>
    </div>
</section>

<section class="section-padding">
    <div class="container">
        <div class="row">
            <div class="col-lg-3">
                <div class="shop-sidebar">
                    <div class="sidebar-widget">
                        <h4>Categories</h4>
                        <ul class="category-list">
                            <li><a href="<?= url('shop') ?>" class="<?= !isset($currentCategory) ? 'active' : '' ?>">All Categories</a></li>
                            <?php foreach ($categories as $cat): ?>
                                <li>
                                    <a href="<?= url('shop/' . $cat->slug) ?>" class="<?= isset($currentCategory) && $currentCategory->id == $cat->id ? 'active' : '' ?>">
                                        <?= htmlspecialchars($cat->name) ?>
                                        <span>(<?= $cat->product_count ?? 0 ?>)</span>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                    <div class="sidebar-widget">
                        <h4>Filter by Price</h4>
                        <form action="<?= url('shop') ?>" method="GET" class="price-filter-form">
                            <div class="price-inputs">
                                <input type="number" name="min_price" class="form-control" placeholder="Min" value="<?= htmlspecialchars($_GET['min_price'] ?? '') ?>">
                                <span>-</span>
                                <input type="number" name="max_price" class="form-control" placeholder="Max" value="<?= htmlspecialchars($_GET['max_price'] ?? '') ?>">
                            </div>
                            <button type="submit" class="btn btn-filter mt-2">Filter</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-9">
                <div class="shop-toolbar">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <p class="results-count">Showing <?= count($products) ?> of <?= $total ?? 0 ?> results</p>
                        </div>
                        <div class="col-md-6 text-end">
                            <form action="" method="GET" class="sort-form d-inline-block">
                                <select name="sort" class="form-select" onchange="this.form.submit()">
                                    <option value="newest" <?= ($sort ?? 'newest') == 'newest' ? 'selected' : '' ?>>Newest</option>
                                    <option value="price_low" <?= ($sort ?? '') == 'price_low' ? 'selected' : '' ?>>Price: Low to High</option>
                                    <option value="price_high" <?= ($sort ?? '') == 'price_high' ? 'selected' : '' ?>>Price: High to Low</option>
                                    <option value="popular" <?= ($sort ?? '') == 'popular' ? 'selected' : '' ?>>Most Popular</option>
                                    <option value="rating" <?= ($sort ?? '') == 'rating' ? 'selected' : '' ?>>Highest Rated</option>
                                </select>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="row g-3">
                    <?php if (!empty($products)): ?>
                        <?php foreach ($products as $product): ?>
                            <div class="col-lg-4 col-md-4 col-6">
                                <div class="product-card">
                                    <?php if ($product->hasDiscount()): ?>
                                        <div class="product-badge">-<?= $product->getDiscountPercent() ?>%</div>
                                    <?php elseif ($product->is_new): ?>
                                        <div class="product-badge new">New</div>
                                    <?php endif; ?>
                                    <div class="product-image">
                                        <a href="<?= url('product/' . $product->slug) ?>">
                                            <img src="<?= asset('images/no-image.jpg') ?>" alt="<?= htmlspecialchars($product->name) ?>">
                                        </a>
                                        <div class="product-actions">
                                            <button class="action-btn add-to-wishlist" data-product-id="<?= $product->id ?>"><i class="far fa-heart"></i></button>
                                            <button class="action-btn add-to-cart-btn" data-product-id="<?= $product->id ?>"><i class="fas fa-shopping-cart"></i></button>
                                        </div>
                                    </div>
                                    <div class="product-info">
                                        <h6><a href="<?= url('product/' . $product->slug) ?>"><?= htmlspecialchars(truncate($product->name, 40)) ?></a></h6>
                                        <div class="product-price">
                                            <span class="current-price"><?= format_price($product->getEffectivePrice()) ?></span>
                                            <?php if ($product->hasDiscount()): ?>
                                                <span class="old-price"><?= format_price($product->price) ?></span>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="col-12">
                            <div class="empty-state">
                                <i class="fas fa-box-open"></i>
                                <h3>No products found</h3>
                                <p>Try adjusting your search or filter criteria</p>
                                <a href="<?= url('shop') ?>" class="btn btn-primary">View All Products</a>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <?php if (($totalPages ?? 0) > 1): ?>
                <nav class="mt-4">
                    <ul class="pagination justify-content-center">
                        <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                            <li class="page-item <?= ($currentPage ?? 1) == $i ? 'active' : '' ?>">
                                <a class="page-link" href="?page=<?= $i ?>&sort=<?= $sort ?? 'newest' ?>"><?= $i ?></a>
                            </li>
                        <?php endfor; ?>
                    </ul>
                </nav>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
