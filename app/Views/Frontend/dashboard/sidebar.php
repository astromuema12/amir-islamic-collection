<div class="dashboard-sidebar">
    <div class="user-info"><i class="fas fa-user-circle fa-3x"></i><h5><?= htmlspecialchars($user->getFullName()) ?></h5><span><?= htmlspecialchars($user->email) ?></span></div>
    <ul class="nav flex-column">
        <li class="nav-item"><a href="<?= url('dashboard') ?>" class="nav-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="nav-item"><a href="<?= url('dashboard/orders') ?>" class="nav-link"><i class="fas fa-shopping-bag"></i> My Orders</a></li>
        <li class="nav-item"><a href="<?= url('dashboard/profile') ?>" class="nav-link"><i class="fas fa-user"></i> My Profile</a></li>
        <li class="nav-item"><a href="<?= url('dashboard/addresses') ?>" class="nav-link"><i class="fas fa-map-marker-alt"></i> Addresses</a></li>
        <li class="nav-item"><a href="<?= url('dashboard/wishlist') ?>" class="nav-link"><i class="fas fa-heart"></i> Wishlist</a></li>
        <li class="nav-item"><a href="<?= url('dashboard/reviews') ?>" class="nav-link"><i class="fas fa-star"></i> Reviews</a></li>
        <li class="nav-item"><a href="<?= url('dashboard/tickets') ?>" class="nav-link"><i class="fas fa-headset"></i> Support Tickets</a></li>
        <li class="nav-item"><a href="<?= url('dashboard/notifications') ?>" class="nav-link"><i class="fas fa-bell"></i> Notifications</a></li>
        <li class="nav-item"><a href="<?= url('track-order') ?>" class="nav-link"><i class="fas fa-truck"></i> Track Order</a></li>
        <li class="nav-item"><a href="<?= url('logout') ?>" class="nav-link text-danger"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
    </ul>
</div>
