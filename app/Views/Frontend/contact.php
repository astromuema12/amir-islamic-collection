<?php require VIEWS_PATH . '/Layouts/header.php'; ?>
<section class="page-banner"><div class="container"><h1>Contact Us</h1><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="<?= url() ?>">Home</a></li><li class="breadcrumb-item active">Contact</li></ol></nav></div></section>
<section class="section-padding">
    <div class="container">
        <div class="row">
            <div class="col-lg-6">
                <div class="contact-info"><h3>Get in Touch</h3>
                    <div class="contact-item"><i class="fas fa-map-marker-alt"></i><div><h5>Address</h5><p><?= htmlspecialchars(SITE_ADDRESS) ?></p></div></div>
                    <div class="contact-item"><i class="fas fa-phone"></i><div><h5>Phone</h5><p><a href="tel:<?= SITE_PHONE ?>"><?= SITE_PHONE ?></a></p></div></div>
                    <div class="contact-item"><i class="fas fa-envelope"></i><div><h5>Email</h5><p><a href="mailto:<?= SITE_EMAIL ?>"><?= SITE_EMAIL ?></a></p></div></div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="contact-form"><h3>Send us a Message</h3>
                    <form action="<?= url('contact') ?>" method="POST"><?= csrf_field() ?>
                        <div class="row g-3">
                            <div class="col-md-6"><input type="text" name="name" class="form-control" placeholder="Your Name" required></div>
                            <div class="col-md-6"><input type="email" name="email" class="form-control" placeholder="Your Email" required></div>
                            <div class="col-12"><input type="text" name="subject" class="form-control" placeholder="Subject" required></div>
                            <div class="col-12"><textarea name="message" class="form-control" rows="5" placeholder="Your Message" required></textarea></div>
                            <div class="col-12"><button type="submit" class="btn btn-primary">Send Message</button></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require VIEWS_PATH . '/Layouts/footer.php'; ?>
