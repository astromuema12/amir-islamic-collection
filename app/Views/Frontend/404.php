<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="section-padding error-page">
    <div class="container text-center">
        <div class="error-code">404</div>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed or is temporarily unavailable.</p>
        <a href="<?= url() ?>" class="btn btn-primary btn-lg"><i class="fas fa-home"></i> Back to Home</a>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
