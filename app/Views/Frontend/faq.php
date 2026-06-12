<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="page-banner"><div class="container"><h1>Frequently Asked Questions</h1><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li><li class="breadcrumb-item active">FAQ</li></ol></nav></div></section>
<section class="section-padding">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="accordion" id="faqAccordion">
                    <?php if (!empty($faqs)): $i = 0; foreach ($faqs as $faq): $i++; ?>
                        <div class="accordion-item">
                            <h2 class="accordion-header"><button class="accordion-button <?= $i > 1 ? 'collapsed' : '' ?>" type="button" data-bs-toggle="collapse" data-bs-target="#faq<?= $i ?>"><?= htmlspecialchars($faq->question) ?></button></h2>
                            <div id="faq<?= $i ?>" class="accordion-collapse collapse <?= $i === 1 ? 'show' : '' ?>" data-bs-parent="#faqAccordion">
                                <div class="accordion-body"><?= nl2br(htmlspecialchars($faq->answer)) ?></div>
                            </div>
                        </div>
                    <?php endforeach; endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
