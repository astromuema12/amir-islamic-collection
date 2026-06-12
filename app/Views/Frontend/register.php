<?php require VIEWS_PATH . '/Layouts/header.php'; ?>

<section class="section-padding">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="auth-card">
                    <div class="auth-header">
                        <i class="fas fa-user-plus"></i>
                        <h3>Create Account</h3>
                        <p>Join Amir Islamic Collection today</p>
                    </div>
                    <form action="<?= url('register') ?>" method="POST">
                        <?= csrf_field() ?>
                        <?php if (has_error('auth')): ?>
                            <div class="alert alert-danger"><?= error('auth') ?></div>
                        <?php endif; ?>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">First Name *</label>
                                <input type="text" name="first_name" class="form-control <?= has_error('name') ? 'is-invalid' : '' ?>" value="<?= old('first_name') ?>" required>
                                <?php if (has_error('name')): ?><div class="invalid-feedback"><?= error('name') ?></div><?php endif; ?>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Last Name *</label>
                                <input type="text" name="last_name" class="form-control" value="<?= old('last_name') ?>" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email *</label>
                            <input type="email" name="email" class="form-control <?= has_error('email') ? 'is-invalid' : '' ?>" value="<?= old('email') ?>" required>
                            <?php if (has_error('email')): ?><div class="invalid-feedback"><?= error('email') ?></div><?php endif; ?>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Phone</label>
                            <input type="tel" name="phone" class="form-control" value="<?= old('phone') ?>">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Password *</label>
                            <input type="password" name="password" class="form-control <?= has_error('password') ? 'is-invalid' : '' ?>" required>
                            <?php if (has_error('password')): ?><div class="invalid-feedback"><?= error('password') ?></div><?php endif; ?>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Confirm Password *</label>
                            <input type="password" name="password_confirmation" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Create Account</button>
                        <p class="mt-3 text-center">Already have an account? <a href="<?= url('login') ?>">Sign in</a></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
