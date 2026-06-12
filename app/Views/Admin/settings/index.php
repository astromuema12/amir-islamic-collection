<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Settings</h4>
<div class="card"><div class="card-body">
<form action="<?= url('admin/settings') ?>" method="POST"><?= csrf_field() ?>
<?php foreach ($grouped as $group => $groupSettings): ?>
    <h5 class="mt-3 text-primary"><?= ucfirst(str_replace('_', ' ', $group)) ?></h5><hr>
    <div class="row g-3"><?php foreach ($groupSettings as $s): ?>
        <div class="col-md-6"><label class="form-label"><?= ucfirst(str_replace('_', ' ', $s->setting_key)) ?></label>
        <?php if (in_array($s->setting_key, ['footer_description', 'terms_content', 'privacy_content', 'shipping_content', 'return_content', 'site_address'])): ?>
            <textarea name="<?= htmlspecialchars($s->setting_key) ?>" class="form-control" rows="3"><?= htmlspecialchars($s->setting_value) ?></textarea>
        <?php else: ?>
            <input type="text" name="<?= htmlspecialchars($s->setting_key) ?>" class="form-control" value="<?= htmlspecialchars($s->setting_value) ?>">
        <?php endif; ?></div>
    <?php endforeach; ?></div>
<?php endforeach; ?>
    <button type="submit" class="btn btn-primary mt-3">Save Settings</button>
</form></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
