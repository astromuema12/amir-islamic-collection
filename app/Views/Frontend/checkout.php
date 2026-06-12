<?php require VIEWS_PATH . '/Layouts/header.php'; ?>

<section class="page-banner">
    <div class="container">
        <h1>Checkout</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li>
                <li class="breadcrumb-item"><a href="<?= url('cart') ?>">Cart</a></li>
                <li class="breadcrumb-item active">Checkout</li>
            </ol>
        </nav>
    </div>
</section>

<section class="section-padding">
    <div class="container">
        <form action="<?= url('checkout/process') ?>" method="POST" id="checkoutForm">
            <?= csrf_field() ?>
            <div class="row">
                <div class="col-lg-8">
                    <div class="checkout-section">
                        <h3>Shipping Information</h3>
                        <?php if (!empty($addresses)): ?>
                            <div class="saved-addresses mb-3">
                                <label>Select Saved Address:</label>
                                <?php foreach ($addresses as $addr): ?>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="shipping_address_id" value="<?= $addr->id ?>" <?= $addr->is_default ? 'checked' : '' ?>>
                                        <label class="form-check-label"><?= htmlspecialchars($addr->label) ?> - <?= htmlspecialchars($addr->address_line1) ?>, <?= htmlspecialchars($addr->city) ?></label>
                                    </div>
                                <?php endforeach; ?>
                                <hr>
                                <label><input type="radio" name="shipping_address_id" value="new" checked> New Address</label>
                            </div>
                        <?php endif; ?>
                        <div class="row g-3" id="newAddressForm">
                            <div class="col-md-6">
                                <label class="form-label">First Name *</label>
                                <input type="text" name="first_name" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Last Name *</label>
                                <input type="text" name="last_name" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email *</label>
                                <input type="email" name="email" class="form-control" value="<?= $_SESSION['user_email'] ?? '' ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Phone *</label>
                                <input type="tel" name="phone" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Address Line 1 *</label>
                                <input type="text" name="address_line1" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Address Line 2</label>
                                <input type="text" name="address_line2" class="form-control">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">City *</label>
                                <input type="text" name="city" class="form-control" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">State</label>
                                <input type="text" name="state" class="form-control">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Postal Code</label>
                                <input type="text" name="postal_code" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Country</label>
                                <select name="country" class="form-select">
                                    <option value="Kenya">Kenya</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="checkout-section">
                        <h3>Shipping Method</h3>
                        <?php foreach ($shippingMethods as $method): ?>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shipping_method" value="<?= $method->id ?>" <?= $method->sort_order == 1 ? 'checked' : '' ?>>
                                <label class="form-check-label">
                                    <?= htmlspecialchars($method->name) ?> - <?= format_price($method->price) ?>
                                    <small class="d-block"><?= htmlspecialchars($method->description) ?> (<?= $method->estimated_days ?>)</small>
                                </label>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="checkout-section">
                        <h3>Payment Method</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="payment_method" value="mpesa" checked>
                            <label class="form-check-label">
                                <strong>M-Pesa</strong>
                                <small class="d-block">Pay via M-Pesa mobile money</small>
                            </label>
                        </div>
                        <div class="mpesa-details mt-2">
                            <label class="form-label">M-Pesa Phone Number</label>
                            <input type="tel" name="mpesa_phone" class="form-control" placeholder="e.g., 0712345678">
                        </div>
                    </div>

                    <div class="checkout-section">
                        <h3>Order Notes</h3>
                        <textarea name="notes" class="form-control" rows="3" placeholder="Special instructions for your order"></textarea>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="order-summary">
                        <h4>Order Summary</h4>
                        <div class="summary-items">
                            <?php foreach ($cartItems as $item): ?>
                                <div class="summary-item">
                                    <span><?= htmlspecialchars(truncate($item['name'], 30)) ?> x <?= $item['quantity'] ?></span>
                                    <span><?= format_price($item['total_price']) ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <hr>
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
                            <span>Tax</span>
                            <span><?= format_price($cart->tax) ?></span>
                        </div>
                        <hr>
                        <div class="summary-row total">
                            <span>Total</span>
                            <span><?= format_price($cart->total) ?></span>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg w-100 mt-3" id="placeOrderBtn">
                            <i class="fas fa-lock"></i> Place Order
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</section>

<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
