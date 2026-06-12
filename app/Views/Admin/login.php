<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - <?= SITE_NAME ?></title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <style>
        body { background: linear-gradient(135deg, #0F766E 0%, #15803D 100%); min-height: 100vh; display: flex; align-items: center; }
        .login-card { background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .login-header { text-align: center; margin-bottom: 30px; }
        .login-header i { font-size: 50px; color: #0F766E; margin-bottom: 15px; }
        .login-header h3 { font-weight: 700; }
        .login-header p { color: #6B7280; }
        .btn-primary { background: #0F766E; border-color: #0F766E; padding: 12px; font-weight: 600; }
        .btn-primary:hover { background: #0D5E58; }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="login-card">
                    <div class="login-header">
                        <i class="fas fa-user-shield"></i>
                        <h3>Admin Login</h3>
                        <p><?= SITE_NAME ?> Administration</p>
                    </div>
                    <?php if (isset($_SESSION['error'])): ?>
                        <div class="alert alert-danger"><?= $_SESSION['error']; unset($_SESSION['error']); ?></div>
                    <?php endif; ?>
                    <form action="<?= url('admin/login') ?>" method="POST">
                        <?= csrf_field() ?>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password" name="password" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Sign In</button>
                    </form>
                    <p class="text-center mt-3"><a href="<?= url() ?>">Back to Website</a></p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
