<?php require VIEWS_PATH . '/Layouts/header.php'; ?>

<section class="section-padding">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="auth-card">
                    <div class="auth-header">
                        <i class="fas fa-user-circle"></i>
                        <h3>Welcome Back</h3>
                        <p>Sign in to your account</p>
                    </div>
                    <form action="<?= url('login') ?>" method="POST">
                        <?= csrf_field() ?>
                        <?php if (has_error('auth')): ?>
                            <div class="alert alert-danger"><?= error('auth') ?></div>
                        <?php endif; ?>
                        <div class="mb-3">
                            <label class="form-label">Email Address</label>
                            <input type="email" name="email" class="form-control" value="<?= old('email') ?>" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password" name="password" class="form-control" required>
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <div class="form-check">
                                <input type="checkbox" name="remember" class="form-check-input" id="remember">
                                <label class="form-check-label" for="remember">Remember me</label>
                            </div>
                            <a href="<?= url('forgot-password') ?>">Forgot Password?</a>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Sign In</button>
                        <p class="mt-3 text-center">Don't have an account? <a href="<?= url('register') ?>">Register here</a></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
