<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="section-padding">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="auth-card">
                    <div class="auth-header">
                        <i class="fas fa-key"></i>
                        <h3>Forgot Password</h3>
                        <p>Enter your email to reset your password</p>
                    </div>
                    <?php if (isset($message)): ?><div class="alert alert-info"><?= $message ?></div><?php endif; ?>
                    <form action="<?= url('forgot-password') ?>" method="POST">
                        <?= csrf_field() ?>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Send Reset Link</button>
                        <p class="mt-3 text-center"><a href="<?= url('login') ?>">Back to Login</a></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
