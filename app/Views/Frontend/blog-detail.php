<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="page-banner"><div class="container"><h1><?= htmlspecialchars($blog->title) ?></h1><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li><li class="breadcrumb-item"><a href="<?= url('blog') ?>">Blog</a></li><li class="breadcrumb-item active"><?= htmlspecialchars(truncate($blog->title, 30)) ?></li></ol></nav></div></section>
<section class="section-padding"><div class="container"><div class="row">
<div class="col-lg-8"><article class="blog-detail"><div class="blog-meta"><span><i class="far fa-calendar"></i> <?= date('F d, Y', strtotime($blog->published_at ?? $blog->created_at)) ?></span>
<?php if ($blog->category_name ?? false): ?><span><i class="far fa-folder"></i> <?= htmlspecialchars($blog->category_name) ?></span><?php endif; ?>
<span><i class="far fa-eye"></i> <?= $blog->views_count ?> views</span></div>
<?php if ($blog->featured_image): ?><img src="<?= upload_url('blogs/' . $blog->featured_image) ?>" class="blog-featured-img" alt="<?= htmlspecialchars($blog->title) ?>"><?php endif; ?>
<div class="blog-content mt-3"><?= $blog->content ?></div>
<?php if ($blog->tags): ?><div class="blog-tags mt-3"><strong>Tags:</strong> <?php foreach (explode(',', $blog->tags) as $tag): ?><span class="badge bg-secondary me-1"><?= trim(htmlspecialchars($tag)) ?></span><?php endforeach; ?></div><?php endif; ?></article></div>
<div class="col-lg-4"><div class="blog-sidebar">
<div class="sidebar-widget"><h4>Categories</h4><ul class="category-list"><?php foreach ($categories as $cat): ?><li><a href="<?= url('blog/category/' . $cat->slug) ?>"><?= htmlspecialchars($cat->name) ?></a></li><?php endforeach; ?></ul></div>
<div class="sidebar-widget"><h4>Recent Posts</h4><ul class="recent-posts"><?php foreach ($recentBlogs as $rb): if ($rb->id == $blog->id) continue; ?><li><a href="<?= url('blog/' . $rb->slug) ?>"><?= htmlspecialchars($rb->title) ?></a><span><?= date('M d, Y', strtotime($rb->published_at ?? $rb->created_at)) ?></span></li><?php endforeach; ?></ul></div></div></div>
</div></div></section>
<style>.blog-featured-img{width:100%;max-height:400px;object-fit:cover;border-radius:8px}.blog-detail .blog-content p{margin-bottom:1rem;line-height:1.8}</style>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
