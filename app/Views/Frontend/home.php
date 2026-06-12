<?php require VIEWS_PATH . '/Layouts/header.php'; ?>

<!-- Hero Slider -->
<section class="hero-section">
    <div class="hero-slider owl-carousel">
        <?php if (!empty($heroBanners)): ?>
            <?php foreach ($heroBanners as $banner): ?>
                <div class="hero-slide" style="background: linear-gradient(135deg, #0F766E 0%, #15803D 100%);">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-6">
                                <div class="hero-content animate__animated animate__fadeInLeft">
                                    <?php if ($banner->subtitle): ?>
                                        <span class="hero-subtitle"><?= htmlspecialchars($banner->subtitle) ?></span>
                                    <?php endif; ?>
                                    <h1 class="hero-title"><?= htmlspecialchars($banner->title) ?></h1>
                                    <?php if ($banner->description): ?>
                                        <p class="hero-desc"><?= htmlspecialchars($banner->description) ?></p>
                                    <?php endif; ?>
                                    <?php if ($banner->link): ?>
                                        <a href="<?= $banner->link ?>" class="btn btn-hero">
                                            <?= htmlspecialchars($banner->btn_text ?: 'Shop Now') ?>
                                            <i class="fas fa-arrow-right ms-2"></i>
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="hero-image animate__animated animate__fadeInRight">
                                    <?php if ($banner->image): ?>
                                        <img src="<?= upload_url($banner->image) ?>" alt="<?= htmlspecialchars($banner->title) ?>">
                                    <?php else: ?>
                                        <i class="fas fa-mosque hero-placeholder-icon"></i>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="hero-slide" style="background: linear-gradient(135deg, #0F766E 0%, #15803D 100%);">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-7">
                            <div class="hero-content">
                                <span class="hero-subtitle">Welcome to</span>
                                <h1 class="hero-title">Amir Islamic Collection</h1>
                                <p class="hero-desc">Your trusted source for authentic Islamic products. Discover our curated collection of Qurans, Islamic books, clothing, attars, and more.</p>
                                <a href="<?= url('shop') ?>" class="btn btn-hero">Start Shopping <i class="fas fa-arrow-right ms-2"></i></a>
                            </div>
                        </div>
                        <div class="col-lg-5 text-center">
                            <i class="fas fa-mosque" style="font-size: 200px; color: rgba(255,255,255,0.15);"></i>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Promo Banners -->
<?php if (!empty($promoBanners)): ?>
<section class="section-padding promo-section">
    <div class="container">
        <div class="row g-3">
            <?php foreach ($promoBanners as $promo): ?>
                <div class="col-md-4">
                    <div class="promo-card">
                        <div class="promo-content">
                            <h3><?= htmlspecialchars($promo->title) ?></h3>
                            <p><?= htmlspecialchars($promo->description) ?></p>
                            <?php if ($promo->link): ?>
                                <a href="<?= $promo->link ?>" class="btn btn-promo"><?= htmlspecialchars($promo->btn_text ?: 'Shop Now') ?></a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Categories Section -->
<section class="section-padding categories-section bg-light">
    <div class="container">
        <div class="section-header">
            <h2>Shop by Category</h2>
            <p>Browse our wide range of Islamic products</p>
        </div>
        <div class="row g-3">
            <?php if (!empty($categories)): ?>
                <?php foreach ($categories as $cat): ?>
                    <div class="col-lg-3 col-md-4 col-6">
                        <a href="<?= url('shop/' . $cat->slug) ?>" class="category-card">
                            <div class="category-icon">
                                <?php if ($cat->icon): ?>
                                    <i class="<?= htmlspecialchars($cat->icon) ?>"></i>
                                <?php else: ?>
                                    <i class="fas fa-tag"></i>
                                <?php endif; ?>
                            </div>
                            <h5><?= htmlspecialchars($cat->name) ?></h5>
                        </a>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <?php
                $defaultCategories = [
                    ['name' => 'Qurans', 'icon' => 'fas fa-book-quran'],
                    ['name' => 'Islamic Books', 'icon' => 'fas fa-book'],
                    ['name' => 'Prayer Mats', 'icon' => 'fas fa-pray'],
                    ['name' => 'Tasbih', 'icon' => 'fas fa-hands-praying'],
                    ['name' => 'Hijabs', 'icon' => 'fas fa-vest'],
                    ['name' => 'Attars', 'icon' => 'fas fa-spa'],
                ];
                foreach ($defaultCategories as $cat): ?>
                    <div class="col-lg-3 col-md-4 col-6">
                        <a href="<?= url('shop') ?>" class="category-card">
                            <div class="category-icon"><i class="<?= $cat['icon'] ?>"></i></div>
                            <h5><?= $cat['name'] ?></h5>
                        </a>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Flash Sale -->
<?php
$flashProducts = array_filter($featuredProducts, fn($p) => $p->hasDiscount());
if (!empty($flashProducts)): ?>
<section class="section-padding flash-sale-section">
    <div class="container">
        <div class="section-header">
            <h2>Flash Sale <i class="fas fa-bolt text-warning"></i></h2>
            <p>Limited time offers - Grab them before they're gone!</p>
        </div>
        <div class="countdown-timer" id="flashCountdown">
            <div class="timer-item"><span class="timer-num" id="days">00</span><span class="timer-label">Days</span></div>
            <div class="timer-item"><span class="timer-num" id="hours">00</span><span class="timer-label">Hours</span></div>
            <div class="timer-item"><span class="timer-num" id="minutes">00</span><span class="timer-label">Mins</span></div>
            <div class="timer-item"><span class="timer-num" id="seconds">00</span><span class="timer-label">Secs</span></div>
        </div>
        <div class="row g-3 mt-3">
            <?php foreach ($flashProducts as $product): ?>
                <div class="col-lg-3 col-md-4 col-6">
                    <div class="product-card">
                        <div class="product-badge">-<?= $product->getDiscountPercent() ?>%</div>
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
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Featured Products -->
<section class="section-padding featured-section">
    <div class="container">
        <div class="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked just for you</p>
        </div>
        <div class="product-carousel owl-carousel">
            <?php if (!empty($featuredProducts)): ?>
                <?php foreach ($featuredProducts as $product): ?>
                    <div class="product-card">
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
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Best Sellers -->
<section class="section-padding bestseller-section bg-light">
    <div class="container">
        <div class="section-header">
            <h2>Best Sellers</h2>
            <p>Our most popular products</p>
        </div>
        <div class="row g-3">
            <?php if (!empty($bestsellers)): ?>
                <?php foreach ($bestsellers as $product): ?>
                    <div class="col-lg-3 col-md-4 col-6">
                        <div class="product-card">
                            <div class="product-badge bestseller">Best Seller</div>
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
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Islamic Quote Section -->
<section class="islamic-quote-section">
    <div class="container">
        <div class="quote-content">
            <i class="fas fa-quote-left quote-icon"></i>
            <blockquote>
                "The best of you are those who are best to others."
                <cite>- Prophet Muhammad (PBUH)</cite>
            </blockquote>
        </div>
    </div>
</section>

<!-- New Arrivals -->
<section class="section-padding new-arrivals-section">
    <div class="container">
        <div class="section-header">
            <h2>New Arrivals</h2>
            <p>Check out our latest products</p>
        </div>
        <div class="row g-3">
            <?php if (!empty($newArrivals)): ?>
                <?php foreach ($newArrivals as $product): ?>
                    <div class="col-lg-3 col-md-4 col-6">
                        <div class="product-card">
                            <div class="product-badge new">New</div>
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
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Testimonials -->
<section class="section-padding testimonials-section bg-light">
    <div class="container">
        <div class="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from our valued customers</p>
        </div>
        <div class="testimonial-carousel owl-carousel">
            <?php if (!empty($testimonials)): ?>
                <?php foreach ($testimonials as $testimonial): ?>
                    <div class="testimonial-card">
                        <div class="testimonial-stars">
                            <?php for ($i = 0; $i < $testimonial->rating; $i++): ?>
                                <i class="fas fa-star"></i>
                            <?php endfor; ?>
                        </div>
                        <p class="testimonial-text">"<?= htmlspecialchars($testimonial->comment) ?>"</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h6><?= htmlspecialchars($testimonial->name) ?></h6>
                                <span>Verified Customer</span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Recent Blog Posts -->
<?php if (!empty($blogs)): ?>
<section class="section-padding blog-section">
    <div class="container">
        <div class="section-header">
            <h2>Latest from Our Blog</h2>
            <p>Stay updated with Islamic knowledge and product guides</p>
        </div>
        <div class="row g-4">
            <?php foreach ($blogs as $blog): ?>
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <div class="blog-image">
                            <?php if ($blog->featured_image): ?>
                                <img src="<?= upload_url('blogs/' . $blog->featured_image) ?>" alt="<?= htmlspecialchars($blog->title) ?>">
                            <?php else: ?>
                                <img src="<?= asset('images/no-image.jpg') ?>" alt="<?= htmlspecialchars($blog->title) ?>">
                            <?php endif; ?>
                        </div>
                        <div class="blog-content">
                            <span class="blog-date"><i class="far fa-calendar"></i> <?= $blog->published_at ? date('M d, Y', strtotime($blog->published_at)) : '' ?></span>
                            <h5><a href="<?= url('blog/' . $blog->slug) ?>"><?= htmlspecialchars($blog->title) ?></a></h5>
                            <p><?= htmlspecialchars(truncate(strip_tags($blog->excerpt), 120)) ?></p>
                            <a href="<?= url('blog/' . $blog->slug) ?>" class="btn-read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Newsletter Section -->
<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-wrapper">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h3>Subscribe to Our Newsletter</h3>
                    <p>Get the latest updates on new products and offers</p>
                </div>
                <div class="col-lg-6">
                    <form action="<?= url('newsletter') ?>" method="POST" class="newsletter-form">
                        <?= csrf_field() ?>
                        <div class="input-group">
                            <input type="email" name="email" class="form-control" placeholder="Enter your email" required>
                            <button type="submit" class="btn btn-subscribe">Subscribe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
