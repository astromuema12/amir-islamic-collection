<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="section-padding">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="auth-card">
                    <div class="auth-header">
                        <i class="fas fa-lock"></i>
                        <h3>Reset Password</h3>
                        <p>Enter your new password</p>
                    </div>
                    <form action="<?= url('reset-password') ?>" method="POST">
                        <?= csrf_field() ?>
                        <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
                        <div class="mb-3">
                            <label class="form-label">New Password</label>
                            <input type="password" name="password" class="form-control" required minlength="8">
                            <small class="text-muted">At least 8 characters</small>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
