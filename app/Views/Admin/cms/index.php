<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">CMS Management</h4>
<div class="row">
<?php
$pages = ['home' => 'Homepage', 'about' => 'About Page', 'contact' => 'Contact Page'];
foreach ($pages as $pageKey => $pageName): ?>
<div class="col-md-6">
<div class="card"><div class="card-header"><?= $pageName ?> Sections</div>
<div class="card-body">
<?php $sections = array_filter($contents, fn($c) => $c->page === $pageKey); ?>
<?php if (!empty($sections)): ?>
<?php foreach ($sections as $section): ?>
<form action="<?= url('admin/cms/update') ?>" method="POST" class="mb-3"><?= csrf_field() ?>
<input type="hidden" name="page" value="<?= $pageKey ?>">
<input type="hidden" name="section" value="<?= htmlspecialchars($section->section) ?>">
<label class="form-label"><?= ucfirst(str_replace('_', ' ', $section->section)) ?></label>
<input type="text" name="title" class="form-control mb-2" value="<?= htmlspecialchars($section->title ?? '') ?>" placeholder="Title">
<textarea name="content" class="form-control" rows="4"><?= htmlspecialchars($section->content ?? '') ?></textarea>
<button type="submit" class="btn btn-sm btn-primary mt-2">Save</button></form>
<?php endforeach; ?>
<?php else: ?>
<form action="<?= url('admin/cms/update') ?>" method="POST"><?= csrf_field() ?>
<input type="hidden" name="page" value="<?= $pageKey ?>">
<input type="hidden" name="section" value="hero">
<label class="form-label">Hero Title</label><input type="text" name="title" class="form-control mb-2">
<label class="form-label">Content</label><textarea name="content" class="form-control" rows="4"></textarea>
<button type="submit" class="btn btn-sm btn-primary mt-2">Save</button></form>
<?php endif; ?>
</div></div></div>
<?php endforeach; ?>
</div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
