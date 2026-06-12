<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <?php $currentUrl = url($_GET['url'] ?? ''); ?>
    <?= generate_meta_tags([
        'title' => $page_title ?? SITE_NAME,
        'description' => $meta_description ?? '',
        'url' => $currentUrl
    ]) ?>
    <link rel="canonical" href="<?= $currentUrl ?>">
    <link rel="icon" type="image/x-icon" href="<?= asset('images/favicon.ico') ?>">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-rc.0/css/select2.min.css" rel="stylesheet">
    <link href="<?= asset('css/style.css') ?>" rel="stylesheet">
</head>
<body>
    <div id="app">
        <!-- Top Bar -->
        <div class="top-bar">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <span class="top-bar-text"><i class="fas fa-phone-alt"></i> <?= SITE_PHONE ?></span>
                        <span class="top-bar-text ms-3"><i class="fas fa-envelope"></i> <?= SITE_EMAIL ?></span>
                    </div>
                    <div class="col-md-6 text-end">
                        <div class="top-bar-links">
                            <?php if (isset($_SESSION['admin_id'])): ?>
                                <a href="<?= url('admin') ?>"><i class="fas fa-shield-alt"></i> Admin Panel</a>
                            <?php endif; ?>
                            <?php if (isset($_SESSION['user_id'])): ?>
                                <a href="<?= url('dashboard') ?>"><i class="fas fa-user"></i> <?= htmlspecialchars($_SESSION['user_name']) ?></a>
                                <a href="<?= url('wishlist') ?>"><i class="fas fa-heart"></i> Wishlist (<?= get_wishlist_count() ?>)</a>
                                <a href="<?= url('logout') ?>"><i class="fas fa-sign-out-alt"></i> Logout</a>
                            <?php else: ?>
                                <a href="<?= url('login') ?>"><i class="fas fa-sign-in-alt"></i> Login</a>
                                <a href="<?= url('register') ?>"><i class="fas fa-user-plus"></i> Register</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Header -->
        <header class="main-header">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <a href="<?= url() ?>" class="logo">
                            <span class="logo-icon"><i class="fas fa-mosque"></i></span>
                            <div class="logo-text">
                                <h1>Amir Islamic</h1>
                                <span>Collection</span>
                            </div>
                        </a>
                    </div>
                    <div class="col-md-6">
                        <form action="<?= url('search') ?>" method="GET" class="search-form">
                            <div class="input-group">
                                <input type="text" class="form-control" name="q" placeholder="Search products..." value="<?= htmlspecialchars($_GET['q'] ?? '') ?>">
                                <button class="btn btn-search" type="submit"><i class="fas fa-search"></i></button>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-3">
                        <div class="header-actions">
                            <a href="<?= url('wishlist') ?>" class="action-btn" title="Wishlist">
                                <i class="fas fa-heart"></i>
                                <span class="badge"><?= get_wishlist_count() ?></span>
                            </a>
                            <a href="<?= url('cart') ?>" class="action-btn" title="Cart">
                                <i class="fas fa-shopping-cart"></i>
                                <span class="badge"><?= get_cart_count() ?></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="main-nav">
            <div class="container">
                <button class="navbar-toggler d-lg-none" type="button" onclick="toggleMobileNav()">
                    <i class="fas fa-bars"></i> Menu
                </button>
                <ul class="nav-menu">
                    <li><a href="<?= url() ?>"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="<?= url('shop') ?>"><i class="fas fa-store"></i> Shop</a></li>
                    <?php
                    $navCategories = get_categories();
                    if (!empty($navCategories)): foreach(array_slice($navCategories, 0, 6) as $cat):
                    ?>
                        <li><a href="<?= url('shop/' . $cat->slug) ?>"><?= htmlspecialchars($cat->name) ?></a></li>
                    <?php endforeach; endif; ?>
                    <li><a href="<?= url('deals') ?>"><i class="fas fa-tags"></i> Deals</a></li>
                    <li><a href="<?= url('blog') ?>"><i class="fas fa-blog"></i> Blog</a></li>
                    <li><a href="<?= url('contact') ?>"><i class="fas fa-envelope"></i> Contact</a></li>
                </ul>
            </div>
        </nav>

        <?php if (isset($_SESSION['success'])): ?>
            <div class="container mt-3">
                <div class="alert alert-success alert-dismissible fade show">
                    <i class="fas fa-check-circle"></i> <?= $_SESSION['success'] ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
            <?php unset($_SESSION['success']); ?>
        <?php endif; ?>

        <?php if (isset($_SESSION['error'])): ?>
            <div class="container mt-3">
                <div class="alert alert-danger alert-dismissible fade show">
                    <i class="fas fa-exclamation-circle"></i> <?= $_SESSION['error'] ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
            <?php unset($_SESSION['error']); ?>
        <?php endif; ?>

        <?php if (isset($_SESSION['message'])): ?>
            <div class="container mt-3">
                <div class="alert alert-info alert-dismissible fade show">
                    <i class="fas fa-info-circle"></i> <?= $_SESSION['message'] ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
            <?php unset($_SESSION['message']); ?>
        <?php endif; ?>
