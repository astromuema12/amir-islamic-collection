<?php require VIEWS_PATH . '/Layouts/header.php'; ?>

<section class="page-banner">
    <div class="container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li>
                <li class="breadcrumb-item"><a href="<?= url('shop') ?>">Shop</a></li>
                <?php if ($category): ?>
                    <li class="breadcrumb-item"><a href="<?= url('shop/' . $category->slug) ?>"><?= htmlspecialchars($category->name) ?></a></li>
                <?php endif; ?>
                <li class="breadcrumb-item active"><?= htmlspecialchars(truncate($product->name, 40)) ?></li>
            </ol>
        </nav>
    </div>
</section>

<section class="section-padding">
    <div class="container">
        <div class="row">
            <div class="col-lg-6">
                <div class="product-gallery">
                    <div class="main-image">
                        <img id="mainProductImage" src="<?= asset('images/no-image.jpg') ?>" alt="<?= htmlspecialchars($product->name) ?>">
                    </div>
                    <?php if (!empty($images)): ?>
                    <div class="thumbnail-list">
                        <?php foreach ($images as $img): ?>
                            <div class="thumbnail" onclick="changeProductImage(this, '<?= $img->getUrl() ?>')">
                                <img src="<?= $img->getUrl() ?>" alt="<?= htmlspecialchars($img->alt_text ?: $product->name) ?>">
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="product-detail-info">
                    <h1 class="product-title"><?= htmlspecialchars($product->name) ?></h1>

                    <?php if ($brand): ?>
                        <p class="product-brand">Brand: <strong><?= htmlspecialchars($brand->name) ?></strong></p>
                    <?php endif; ?>

                    <div class="product-rating">
                        <div class="stars">
                            <?php for ($i = 1; $i <= 5; $i++): ?>
                                <i class="fas fa-star<?= $i <= round($product->avg_rating) ? '' : '-o' ?>"></i>
                            <?php endfor; ?>
                        </div>
                        <span>(<?= $product->review_count ?> reviews)</span>
                    </div>

                    <div class="product-price">
                        <span class="current-price"><?= format_price($product->getEffectivePrice()) ?></span>
                        <?php if ($product->hasDiscount()): ?>
                            <span class="old-price"><?= format_price($product->price) ?></span>
                            <span class="discount-badge">-<?= $product->getDiscountPercent() ?>% OFF</span>
                        <?php endif; ?>
                    </div>

                    <div class="product-availability">
                        <?php if ($product->inStock()): ?>
                            <span class="in-stock"><i class="fas fa-check-circle"></i> In Stock (<?= $product->stock_quantity ?> available)</span>
                        <?php else: ?>
                            <span class="out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>
                        <?php endif; ?>
                    </div>

                    <?php if ($product->short_description): ?>
                        <p class="product-short-desc"><?= nl2br(htmlspecialchars($product->short_description)) ?></p>
                    <?php endif; ?>

                    <div class="product-variants">
                        <?php if (!empty($variants)): ?>
                            <div class="variant-group">
                                <label>Size / Option:</label>
                                <select class="form-select variant-select" name="variant_id">
                                    <?php foreach ($variants as $variant): ?>
                                        <option value="<?= $variant->id ?>" <?= $variant->is_default ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($variant->name) ?> - <?= format_price($variant->price ?? $product->getEffectivePrice()) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="product-quantity">
                        <label>Quantity:</label>
                        <div class="quantity-selector">
                            <button type="button" class="qty-btn minus">-</button>
                            <input type="number" class="form-control qty-input" value="1" min="1" max="<?= $product->stock_quantity ?: 1 ?>">
                            <button type="button" class="qty-btn plus">+</button>
                        </div>
                    </div>

                    <div class="product-actions">
                        <button class="btn btn-primary btn-lg btn-add-cart" data-product-id="<?= $product->id ?>">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-primary btn-lg btn-wishlist <?= $isInWishlist ? 'active' : '' ?>" data-product-id="<?= $product->id ?>">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>

                    <div class="product-meta">
                        <p>SKU: <strong><?= htmlspecialchars($product->sku ?: 'N/A') ?></strong></p>
                        <?php if ($category): ?>
                            <p>Category: <a href="<?= url('shop/' . $category->slug) ?>"><?= htmlspecialchars($category->name) ?></a></p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-12">
                <ul class="nav nav-tabs product-tabs" id="productTabs">
                    <li class="nav-item"><a class="nav-link active" href="#description">Description</a></li>
                    <li class="nav-item"><a class="nav-link" href="#reviews">Reviews (<?= $product->review_count ?>)</a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane active" id="description">
                        <div class="product-description"><?= $product->description ?></div>
                    </div>
                    <div class="tab-pane" id="reviews">
                        <?php if (!empty($reviews)): ?>
                            <?php foreach ($reviews as $review): ?>
                                <div class="review-item">
                                    <div class="review-header">
                                        <strong><?= htmlspecialchars(($review->first_name ?? '') . ' ' . ($review->last_name ?? '')) ?></strong>
                                        <div class="review-stars">
                                            <?php for ($i = 1; $i <= 5; $i++): ?>
                                                <i class="fas fa-star<?= $i <= $review->rating ? '' : '-o' ?>"></i>
                                            <?php endfor; ?>
                                        </div>
                                        <span class="review-date"><?= time_ago($review->created_at) ?></span>
                                    </div>
                                    <?php if ($review->title): ?>
                                        <h6><?= htmlspecialchars($review->title) ?></h6>
                                    <?php endif; ?>
                                    <p><?= nl2br(htmlspecialchars($review->comment)) ?></p>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <p>No reviews yet. Be the first to review!</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <?php if (!empty($relatedProducts)): ?>
        <div class="row mt-5">
            <div class="col-12">
                <div class="section-header">
                    <h2>Related Products</h2>
                </div>
                <div class="row g-3">
                    <?php foreach ($relatedProducts as $related): ?>
                        <div class="col-lg-3 col-md-4 col-6">
                            <div class="product-card">
                                <div class="product-image">
                                    <a href="<?= url('product/' . $related->slug) ?>">
                                        <img src="<?= asset('images/no-image.jpg') ?>" alt="<?= htmlspecialchars($related->name) ?>">
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h6><a href="<?= url('product/' . $related->slug) ?>"><?= htmlspecialchars(truncate($related->name, 40)) ?></a></h6>
                                    <div class="product-price">
                                        <span class="current-price"><?= format_price($related->getEffectivePrice()) ?></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
