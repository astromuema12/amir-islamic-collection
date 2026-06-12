<?php require VIEWS_PATH . '/Layouts/header.php'; ?>

<section class="page-banner">
    <div class="container">
        <h1>Shopping Cart</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li>
                <li class="breadcrumb-item active">Cart</li>
            </ol>
        </nav>
    </div>
</section>

<section class="section-padding">
    <div class="container">
        <?php if (!empty($cartItems)): ?>
            <div class="row">
                <div class="col-lg-8">
                    <div class="cart-items">
                        <?php foreach ($cartItems as $item): ?>
                            <div class="cart-item" data-item-id="<?= $item['id'] ?>">
                                <div class="cart-item-image">
                                    <img src="<?= $item['image'] ?>" alt="<?= htmlspecialchars($item['name']) ?>">
                                </div>
                                <div class="cart-item-details">
                                    <h5><a href="<?= url('product/' . $item['slug']) ?>"><?= htmlspecialchars($item['name']) ?></a></h5>
                                    <p class="cart-item-price"><?= format_price($item['unit_price']) ?></p>
                                    <div class="cart-item-quantity">
                                        <button class="qty-btn update-cart" data-action="minus" data-item-id="<?= $item['id'] ?>">-</button>
                                        <input type="number" class="form-control qty-input" value="<?= $item['quantity'] ?>" min="1" max="<?= $item['stock'] ?>" readonly>
                                        <button class="qty-btn update-cart" data-action="plus" data-item-id="<?= $item['id'] ?>">+</button>
                                    </div>
                                </div>
                                <div class="cart-item-total">
                                    <p class="item-total"><?= format_price($item['total_price']) ?></p>
                                    <button class="btn btn-sm btn-danger remove-item" data-item-id="<?= $item['id'] ?>"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="cart-summary">
                        <h4>Cart Summary</h4>
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span><?= format_price($cart->subtotal) ?></span>
                        </div>
                        <?php if ($cart->discount > 0): ?>
                            <div class="summary-row text-success">
                                <span>Discount</span>
                                <span>-<?= format_price($cart->discount) ?></span>
                            </div>
                        <?php endif; ?>
                        <div class="summary-row">
                            <span>Tax (<?= SITE_TAX ?>%)</span>
                            <span><?= format_price($cart->tax) ?></span>
                        </div>
                        <hr>
                        <div class="summary-row total">
                            <span>Total</span>
                            <span><?= format_price($cart->total) ?></span>
                        </div>
                        <a href="<?= url('checkout') ?>" class="btn btn-primary btn-lg w-100 mt-3">Proceed to Checkout</a>
                        <a href="<?= url('shop') ?>" class="btn btn-outline-primary w-100 mt-2">Continue Shopping</a>

                        <div class="coupon-section mt-4">
                            <h5>Apply Coupon</h5>
                            <form action="<?= url('cart/apply-coupon') ?>" method="POST" class="coupon-form">
                                <?= csrf_field() ?>
                                <div class="input-group">
                                    <input type="text" name="code" class="form-control" placeholder="Coupon code">
                                    <button type="submit" class="btn btn-coupon">Apply</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Start shopping and add items to your cart</p>
                <a href="<?= url('shop') ?>" class="btn btn-primary">Shop Now</a>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
