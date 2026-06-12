<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="section-padding">
    <div class="container text-center">
        <div class="order-success-icon"><i class="fas fa-check-circle"></i></div>
        <h2>Order Placed Successfully!</h2>
        <p class="lead">Thank you for your order. Your order number is:</p>
        <h3 class="order-number"><?= htmlspecialchars($order->order_number) ?></h3>
        <p>We will send you a confirmation SMS/email once payment is confirmed.</p>
        <div class="mt-4"><a href="<?= url('dashboard/orders') ?>" class="btn btn-primary">View My Orders</a><a href="<?= url('shop') ?>" class="btn btn-outline-primary ms-2">Continue Shopping</a></div>
    </div>
</section>
<style>.order-success-icon{font-size:80px;color:#15803D;margin-bottom:20px}.order-number{color:#0F766E;font-weight:700;font-size:24px;letter-spacing:2px}</style>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
