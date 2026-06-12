<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="section-padding"><div class="container"><div class="row"><div class="col-md-3"><?php require VIEWS_PATH . '/Frontend/dashboard/sidebar.php'; ?></div>
<div class="col-md-9"><div class="dashboard-content"><h3>My Profile</h3>
<form action="<?= url('dashboard/profile') ?>" method="POST"><?= csrf_field() ?>
<div class="row g-3"><div class="col-md-6"><label class="form-label">First Name</label><input type="text" name="first_name" class="form-control" value="<?= htmlspecialchars($user->first_name) ?>" required></div>
<div class="col-md-6"><label class="form-label">Last Name</label><input type="text" name="last_name" class="form-control" value="<?= htmlspecialchars($user->last_name) ?>" required></div>
<div class="col-md-6"><label class="form-label">Email</label><input type="email" class="form-control" value="<?= htmlspecialchars($user->email) ?>" disabled></div>
<div class="col-md-6"><label class="form-label">Phone</label><input type="tel" name="phone" class="form-control" value="<?= htmlspecialchars($user->phone ?? '') ?>"></div>
<div class="col-md-6"><label class="form-label">New Password (leave blank to keep current)</label><input type="password" name="password" class="form-control" minlength="8"></div>
</div><button type="submit" class="btn btn-primary mt-3">Update Profile</button></form></div></div></div></div></section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
