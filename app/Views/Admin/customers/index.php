<?php require __DIR__ . '/../partials/header.php'; ?>
<h4 class="page-title">Customers</h4>
<div class="card"><div class="card-body">
<form action="" method="GET" class="mb-3"><div class="input-group" style="max-width:400px"><input type="text" name="search" class="form-control" placeholder="Search by name or email..." value="<?= htmlspecialchars($search) ?>"><button class="btn btn-primary"><i class="fas fa-search"></i></button></div></form>
<div class="table-responsive"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
<tbody><?php foreach ($customers as $c): ?><tr><td><?= $c->id ?></td><td><?= htmlspecialchars($c->first_name . ' ' . $c->last_name) ?></td><td><?= htmlspecialchars($c->email) ?></td><td><?= htmlspecialchars($c->phone ?? '-') ?></td>
<td><span class="badge bg-<?= $c->status === 'active' ? 'success' : 'danger' ?>"><?= ucfirst($c->status) ?></span></td><td><?= date('d M Y', strtotime($c->created_at)) ?></td>
<td><a href="<?= url('admin/customers/' . $c->id) ?>" class="btn btn-sm btn-outline-primary"><i class="fas fa-eye"></i></a></td></tr><?php endforeach; ?></tbody></table></div></div></div>
<?php require __DIR__ . '/../partials/footer.php'; ?>
