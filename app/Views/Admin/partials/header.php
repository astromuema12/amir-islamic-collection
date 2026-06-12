<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page_title ?? 'Admin' ?> - <?= SITE_NAME ?></title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js" rel="preload">
    <style>
        :root { --sidebar-width: 250px; --primary: #0F766E; --primary-dark: #0D5E58; --secondary: #D4AF37; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #F8FAFC; overflow-x: hidden; }
        .wrapper { display: flex; }
        .sidebar { width: var(--sidebar-width); background: #1E293B; min-height: 100vh; position: fixed; left: 0; top: 0; z-index: 1000; transition: all 0.3s; }
        .sidebar-brand { padding: 20px; color: #fff; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .sidebar-brand i { font-size: 30px; color: var(--secondary); }
        .sidebar-brand h4 { font-size: 16px; margin-top: 8px; }
        .sidebar-nav { padding: 15px 0; }
        .sidebar-nav .nav-item { padding: 0 15px; }
        .sidebar-nav .nav-link { color: rgba(255,255,255,0.7); padding: 10px 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px; font-size: 14px; transition: all 0.3s; }
        .sidebar-nav .nav-link:hover, .sidebar-nav .nav-link.active { background: rgba(255,255,255,0.1); color: #fff; }
        .sidebar-nav .nav-link i { width: 20px; text-align: center; }
        .content { margin-left: var(--sidebar-width); flex: 1; padding: 20px; min-height: 100vh; }
        .navbar { background: #fff; border-radius: 12px; padding: 12px 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .card { border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px; }
        .card-header { background: #fff; border-bottom: 1px solid #E2E8F0; padding: 15px 20px; font-weight: 700; border-radius: 12px 12px 0 0 !important; }
        .card-body { padding: 20px; }
        .stat-card { padding: 20px; border-radius: 12px; color: #fff; }
        .stat-card h3 { font-size: 28px; font-weight: 800; }
        .stat-card p { opacity: 0.9; font-size: 14px; }
        .bg-primary-custom { background: linear-gradient(135deg, #0F766E, #14A398); }
        .bg-success-custom { background: linear-gradient(135deg, #15803D, #16A34A); }
        .bg-warning-custom { background: linear-gradient(135deg, #D4AF37, #F59E0B); }
        .bg-danger-custom { background: linear-gradient(135deg, #DC2626, #EF4444); }
        .bg-info-custom { background: linear-gradient(135deg, #0EA5E9, #38BDF8); }
        .table { margin-bottom: 0; }
        .table thead { background: #F8FAFC; }
        .table thead th { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px; border-bottom: 2px solid #E2E8F0; color: #6B7280; }
        .table tbody td { padding: 12px; vertical-align: middle; }
        .btn-sm { padding: 5px 12px; font-size: 12px; }
        .badge { padding: 5px 10px; font-weight: 600; }
        .page-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
        .form-label { font-weight: 600; font-size: 14px; }
        @media (max-width: 768px) { .sidebar { left: -250px; } .sidebar.show { left: 0; } .content { margin-left: 0; } }
    </style>
</head>
<body>
<div class="wrapper">
    <!-- Sidebar -->
    <aside class="sidebar" id="adminSidebar">
        <div class="sidebar-brand">
            <i class="fas fa-mosque"></i>
            <h4><?= SITE_NAME ?></h4>
            <small style="color: var(--secondary);">Admin Panel</small>
        </div>
        <nav class="sidebar-nav">
            <?php $currentUri = $_GET['url'] ?? ''; ?>
            <div class="nav-item"><a href="<?= url('admin') ?>" class="nav-link <?= $currentUri === 'admin' || $currentUri === 'admin/dashboard' ? 'active' : '' ?>"><i class="fas fa-tachometer-alt"></i> Dashboard</a></div>
            <div class="nav-item"><a href="<?= url('admin/products') ?>" class="nav-link <?= strpos($currentUri, 'admin/products') === 0 ? 'active' : '' ?>"><i class="fas fa-box"></i> Products</a></div>
            <div class="nav-item"><a href="<?= url('admin/categories') ?>" class="nav-link <?= strpos($currentUri, 'admin/categories') === 0 ? 'active' : '' ?>"><i class="fas fa-tags"></i> Categories</a></div>
            <div class="nav-item"><a href="<?= url('admin/brands') ?>" class="nav-link <?= strpos($currentUri, 'admin/brands') === 0 ? 'active' : '' ?>"><i class="fas fa-building"></i> Brands</a></div>
            <div class="nav-item"><a href="<?= url('admin/orders') ?>" class="nav-link <?= strpos($currentUri, 'admin/orders') === 0 ? 'active' : '' ?>"><i class="fas fa-shopping-cart"></i> Orders</a></div>
            <div class="nav-item"><a href="<?= url('admin/customers') ?>" class="nav-link <?= strpos($currentUri, 'admin/customers') === 0 ? 'active' : '' ?>"><i class="fas fa-users"></i> Customers</a></div>
            <div class="nav-item"><a href="<?= url('admin/reviews') ?>" class="nav-link <?= strpos($currentUri, 'admin/reviews') === 0 ? 'active' : '' ?>"><i class="fas fa-star"></i> Reviews</a></div>
            <div class="nav-item"><a href="<?= url('admin/blogs') ?>" class="nav-link <?= strpos($currentUri, 'admin/blogs') === 0 ? 'active' : '' ?>"><i class="fas fa-blog"></i> Blogs</a></div>
            <div class="nav-item"><a href="<?= url('admin/coupons') ?>" class="nav-link <?= strpos($currentUri, 'admin/coupons') === 0 ? 'active' : '' ?>"><i class="fas fa-percent"></i> Coupons</a></div>
            <div class="nav-item"><a href="<?= url('admin/tickets') ?>" class="nav-link <?= strpos($currentUri, 'admin/tickets') === 0 ? 'active' : '' ?>"><i class="fas fa-headset"></i> Tickets</a></div>
            <div class="nav-item"><a href="<?= url('admin/banners') ?>" class="nav-link <?= strpos($currentUri, 'admin/banners') === 0 ? 'active' : '' ?>"><i class="fas fa-images"></i> Banners</a></div>
            <div class="nav-item"><a href="<?= url('admin/cms') ?>" class="nav-link <?= strpos($currentUri, 'admin/cms') === 0 ? 'active' : '' ?>"><i class="fas fa-file"></i> CMS</a></div>
            <div class="nav-item"><a href="<?= url('admin/newsletter') ?>" class="nav-link <?= strpos($currentUri, 'admin/newsletter') === 0 ? 'active' : '' ?>"><i class="fas fa-envelope-open-text"></i> Newsletter</a></div>
            <div class="nav-item"><a href="<?= url('admin/reports') ?>" class="nav-link <?= strpos($currentUri, 'admin/reports') === 0 ? 'active' : '' ?>"><i class="fas fa-chart-bar"></i> Reports</a></div>
            <div class="nav-item"><a href="<?= url('admin/settings') ?>" class="nav-link <?= strpos($currentUri, 'admin/settings') === 0 ? 'active' : '' ?>"><i class="fas fa-cog"></i> Settings</a></div>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 15px;">
            <div class="nav-item"><a href="<?= url() ?>" class="nav-link" target="_blank"><i class="fas fa-external-link-alt"></i> View Site</a></div>
            <div class="nav-item"><form action="<?= url('admin/logout') ?>" method="POST" style="display:inline"><?= csrf_field() ?><button type="submit" class="nav-link text-danger" style="background:none;border:none;width:100%;text-align:left;cursor:pointer"><i class="fas fa-sign-out-alt"></i> Logout</button></form></div>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="content">
        <nav class="navbar d-flex justify-content-between align-items-center">
            <div>
                <button class="btn btn-sm btn-outline-secondary d-md-none" onclick="document.getElementById('adminSidebar').classList.toggle('show')">
                    <i class="fas fa-bars"></i>
                </button>
                <span class="fw-bold ms-2"><?= $page_title ?? 'Dashboard' ?></span>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span><i class="fas fa-user-circle"></i> <?= $_SESSION['admin_name'] ?? 'Admin' ?></span>
                <span class="badge bg-<?= $_SESSION['admin_role'] === 'superadmin' ? 'warning' : 'info' ?>"><?= $_SESSION['admin_role'] ?? 'admin' ?></span>
            </div>
        </nav>

        <?php if (isset($_SESSION['success'])): ?>
            <div class="alert alert-success alert-dismissible fade show"><?= $_SESSION['success']; unset($_SESSION['success']); ?><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
        <?php endif; ?>
        <?php if (isset($_SESSION['error'])): ?>
            <div class="alert alert-danger alert-dismissible fade show"><?= $_SESSION['error']; unset($_SESSION['error']); ?><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
        <?php endif; ?>
