<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="page-banner"><div class="container"><h1>Shipping Policy</h1><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li><li class="breadcrumb-item active">Shipping</li></ol></nav></div></section>
<section class="section-padding"><div class="container"><div class="legal-content"><?= $content ?: '<p>Our shipping policy is being updated. Please check back later.</p>' ?></div></div></section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
