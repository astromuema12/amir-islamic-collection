
        <!-- Footer -->
        <footer class="main-footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="footer-widget">
                            <div class="footer-logo">
                                <i class="fas fa-mosque"></i>
                                <h4>Amir Islamic Collection</h4>
                            </div>
                            <p class="footer-desc"><?= htmlspecialchars(get_setting('footer_description', 'Your trusted source for authentic Islamic products.')) ?></p>
                            <div class="social-links">
                                <a href="<?= get_setting('social_facebook', '#') ?>" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                <a href="<?= get_setting('social_twitter', '#') ?>" target="_blank"><i class="fab fa-twitter"></i></a>
                                <a href="<?= get_setting('social_instagram', '#') ?>" target="_blank"><i class="fab fa-instagram"></i></a>
                                <a href="<?= get_setting('social_youtube', '#') ?>" target="_blank"><i class="fab fa-youtube"></i></a>
                                <a href="<?= get_setting('social_tiktok', '#') ?>" target="_blank"><i class="fab fa-tiktok"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-4">
                        <div class="footer-widget">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="<?= url('about') ?>">About Us</a></li>
                                <li><a href="<?= url('contact') ?>">Contact Us</a></li>
                                <li><a href="<?= url('faq') ?>">FAQ</a></li>
                                <li><a href="<?= url('blog') ?>">Blog</a></li>
                                <li><a href="<?= url('shop') ?>">Shop</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-4">
                        <div class="footer-widget">
                            <h4>Policies</h4>
                            <ul>
                                <li><a href="<?= url('terms') ?>">Terms & Conditions</a></li>
                                <li><a href="<?= url('privacy-policy') ?>">Privacy Policy</a></li>
                                <li><a href="<?= url('shipping-policy') ?>">Shipping Policy</a></li>
                                <li><a href="<?= url('return-policy') ?>">Return Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4">
                        <div class="footer-widget">
                            <h4>Contact Info</h4>
                            <ul class="contact-info">
                                <li><i class="fas fa-map-marker-alt"></i> <?= htmlspecialchars(SITE_ADDRESS) ?></li>
                                <li><i class="fas fa-phone"></i> <a href="tel:<?= SITE_PHONE ?>"><?= SITE_PHONE ?></a></li>
                                <li><i class="fas fa-envelope"></i> <a href="mailto:<?= SITE_EMAIL ?>"><?= SITE_EMAIL ?></a></li>
                            </ul>
                            <div class="newsletter-form mt-3">
                                <h5>Subscribe to Newsletter</h5>
                                <form action="<?= url('newsletter') ?>" method="POST" class="d-flex">
                                    <?= csrf_field() ?>
                                    <input type="email" name="email" class="form-control" placeholder="Your email" required>
                                    <button type="submit" class="btn btn-subscribe"><i class="fas fa-paper-plane"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <p><?= htmlspecialchars(get_setting('footer_copyright', '&copy; 2024 Amir Islamic Collection. All rights reserved.')) ?></p>
                        </div>
                        <div class="col-md-6 text-end">
                            <img src="<?= asset('images/payment-icons.png') ?>" alt="Payment Methods" class="payment-icons">
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>

    <!-- WhatsApp Float -->
    <a href="https://wa.me/<?= get_setting('whatsapp_number', '254712345678') ?>" class="whatsapp-float" target="_blank" title="Chat on WhatsApp">
        <i class="fab fa-whatsapp"></i>
    </a>

    <!-- Scroll to Top -->
    <button class="scroll-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" id="scrollTopBtn">
        <i class="fas fa-arrow-up"></i>
    </button>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-rc.0/js/select2.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
    <script src="<?= asset('js/main.js') ?>"></script>
    <?= $custom_js ?? '' ?>
</body>
</html>
<?php clear_old_input(); ?>
