<?php require __DIR__ . '/../partials/header.php'; ?>
<div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="page-title mb-0">Blog Posts</h4>
    <a href="<?= url('admin/blogs/create') ?>" class="btn btn-primary"><i class="fas fa-plus"></i> New Post</a>
</div>
<div class="card"><div class="card-body p-0"><table class="table"><thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($blogs as $b): ?><tr>
<td><?= $b->id ?></td><td><?= htmlspecialchars(truncate($b->title, 50)) ?></td><td><?= htmlspecialchars($b->category_name ?? '-') ?></td><td><?= htmlspecialchars($b->author_name ?? '-') ?></td>
<td><span class="badge bg-<?= $b->status === 'published' ? 'success' : ($b->status === 'draft' ? 'warning' : 'secondary') ?>"><?= ucfirst($b->status) ?></span></td>
<td><?= $b->views_count ?? 0 ?></td><td><?= date('d M Y', strtotime($b->created_at)) ?></td>
<td><a href="<?= url('admin/blogs/edit/' . $b->id) ?>" class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></a>
<form action="<?= url('admin/blogs/delete/' . $b->id) ?>" method="POST" style="display:inline"><?= csrf_field() ?><button class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></button></form></td>
</tr><?php endforeach; ?></tbody></table></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
