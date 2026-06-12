/**
 * Amir Islamic Collection - Main JavaScript
 */

$(document).ready(function() {

    // Initialize Owl Carousels
    $('.hero-slider').owlCarousel({
        items: 1,
        nav: true,
        dots: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 6000,
        smartSpeed: 800,
        navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>']
    });

    if ($('.product-carousel').length) {
        $('.product-carousel').owlCarousel({
            loop: true,
            margin: 15,
            nav: true,
            dots: false,
            smartSpeed: 600,
            navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
            responsive: {
                0: { items: 2 },
                576: { items: 2 },
                768: { items: 3 },
                992: { items: 4 },
                1200: { items: 5 }
            }
        });
    }

    if ($('.testimonial-carousel').length) {
        $('.testimonial-carousel').owlCarousel({
            loop: true,
            margin: 20,
            nav: false,
            dots: true,
            smartSpeed: 600,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }

    // Scroll to Top Button
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $('#scrollTopBtn').fadeIn().css('display', 'flex');
        } else {
            $('#scrollTopBtn').fadeOut();
        }
    });

    // Flash Sale Countdown
    function startCountdown(hours, minutes, seconds) {
        let totalSeconds = hours * 3600 + minutes * 60 + seconds;

        function updateTimer() {
            if (totalSeconds <= 0) return;
            totalSeconds--;

            const d = Math.floor(totalSeconds / 86400);
            const h = Math.floor((totalSeconds % 86400) / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;

            $('#days').text(String(d).padStart(2, '0'));
            $('#hours').text(String(h).padStart(2, '0'));
            $('#minutes').text(String(m).padStart(2, '0'));
            $('#seconds').text(String(s).padStart(2, '0'));
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    if ($('#flashCountdown').length) {
        startCountdown(2, 12, 30);
    }

    // Quantity Buttons
    $(document).on('click', '.qty-btn.plus, .qty-btn.minus', function() {
        const input = $(this).closest('.quantity-selector, .cart-item-quantity').find('.qty-input');
        const current = parseInt(input.val());
        const min = parseInt(input.attr('min')) || 1;
        const max = parseInt(input.attr('max')) || 999;

        if ($(this).hasClass('plus') && current < max) {
            input.val(current + 1);
        } else if ($(this).hasClass('minus') && current > min) {
            input.val(current - 1);
        }

        // Trigger change for cart updates
        input.trigger('change');
    });

    // Add to Cart
    $(document).on('click', '.add-to-cart-btn, .btn-add-cart', function(e) {
        e.preventDefault();
        const btn = $(this);
        const productId = btn.data('product-id');
        const quantity = btn.closest('.product-detail-info').find('.qty-input').val() || 1;
        const variantId = btn.closest('.product-detail-info').find('.variant-select').val() || null;

        // Show loading state
        btn.html('<i class="fas fa-spinner fa-spin"></i>');
        btn.prop('disabled', true);

        $.ajax({
            url: '/amir_islamic_collection/cart/add',
            method: 'POST',
            data: {
                product_id: productId,
                quantity: quantity,
                variant_id: variantId,
                _csrf_token: $('input[name="_csrf_token"]').val()
            },
            success: function(response) {
                if (response.success) {
                    // Update cart badge
                    if (response.cart_count !== undefined) {
                        $('.header-actions .action-btn .badge').first().text(response.cart_count);
                    }
                    showNotification('success', response.message || 'Added to cart');
                } else {
                    showNotification('error', response.message || 'Failed to add to cart');
                }
            },
            error: function() {
                // Fallback: submit form normally
                const form = $('<form>').attr('method', 'POST').attr('action', '/amir_islamic_collection/cart/add');
                form.append($('<input>').attr('type', 'hidden').attr('name', 'product_id').val(productId));
                form.append($('<input>').attr('type', 'hidden').attr('name', 'quantity').val(quantity));
                form.append($('<input>').attr('type', 'hidden').attr('name', '_csrf_token').val($('input[name="_csrf_token"]').val()));
                $('body').append(form);
                form.submit();
            },
            complete: function() {
                btn.html(btn.hasClass('btn-add-cart') ? '<i class="fas fa-shopping-cart"></i> Add to Cart' : '<i class="fas fa-shopping-cart"></i>');
                btn.prop('disabled', false);
            }
        });
    });

    // Add to Wishlist
    $(document).on('click', '.add-to-wishlist, .btn-wishlist', function(e) {
        e.preventDefault();
        const btn = $(this);
        const productId = btn.data('product-id');

        if (!productId) return;

        const isWishlistPage = btn.hasClass('remove-from-wishlist');

        const url = isWishlistPage ? '/amir_islamic_collection/wishlist/remove' : '/amir_islamic_collection/wishlist/add';
        const data = { product_id: productId, _csrf_token: $('input[name="_csrf_token"]').val() };

        if (isWishlistPage) {
            if (confirm('Remove from wishlist?')) {
                $.post(url, data, function(response) {
                    if (response.success) {
                        btn.closest('.col-lg-3, .col-md-4, .col-6').fadeOut(300);
                        showNotification('success', 'Removed from wishlist');
                    }
                });
            }
        } else {
            btn.find('i').toggleClass('far fas');
            $.post(url, data, function(response) {
                showNotification(response.success ? 'success' : 'error', response.message);
            });
        }
    });

    // Update Cart Quantity
    $(document).on('click', '.update-cart', function() {
        const btn = $(this);
        const itemId = btn.data('item-id');
        const input = btn.closest('.cart-item-quantity').find('.qty-input');
        const current = parseInt(input.val());
        const action = btn.data('action');
        const newQty = action === 'plus' ? current + 1 : current - 1;

        if (newQty < 1) {
            // Remove item
            $.post('/amir_islamic_collection/cart/remove', {
                item_id: itemId,
                _csrf_token: $('input[name="_csrf_token"]').val()
            }, function(response) {
                if (response.success) {
                    location.reload();
                }
            });
            return;
        }

        $.post('/amir_islamic_collection/cart/update', {
            item_id: itemId,
            quantity: newQty,
            _csrf_token: $('input[name="_csrf_token"]').val()
        }, function(response) {
            if (response.success) {
                location.reload();
            }
        });
    });

    // Remove Cart Item
    $(document).on('click', '.remove-item', function() {
        if (!confirm('Remove this item from cart?')) return;

        const itemId = $(this).data('item-id');
        $.post('/amir_islamic_collection/cart/remove', {
            item_id: itemId,
            _csrf_token: $('input[name="_csrf_token"]').val()
        }, function(response) {
            if (response.success) {
                location.reload();
            }
        });
    });

    // Product Image Gallery
    window.changeProductImage = function(element, src) {
        $('#mainProductImage').attr('src', src);
        $('.thumbnail').removeClass('active');
        $(element).addClass('active');
    };

    // Product Tabs
    $(document).on('click', '.product-tabs .nav-link', function(e) {
        e.preventDefault();
        const target = $(this).attr('href');

        $('.product-tabs .nav-link').removeClass('active');
        $(this).addClass('active');

        $('.tab-pane').removeClass('active');
        $(target).addClass('active');
    });

    // Auto-dismiss alerts after 5 seconds
    setTimeout(function() {
        $('.alert-dismissible').fadeOut(500);
    }, 5000);

    // Mobile Navigation Toggle
    window.toggleMobileNav = function() {
        $('.nav-menu').toggleClass('show');
    };

});

// Notification System
function showNotification(type, message) {
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const bgClass = type === 'success' ? 'alert-success' : 'alert-danger';

    const alert = $('<div>').addClass('alert ' + bgClass + ' alert-dismissible fade show position-fixed')
        .css({ top: '20px', right: '20px', 'z-index': 9999, 'min-width': '300px' })
        .html('<i class="fas ' + icon + '"></i> ' + message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>');

    $('body').append(alert);

    setTimeout(function() {
        alert.fadeOut(500, function() { $(this).remove(); });
    }, 4000);
}

// Initialize Select2
$(document).ready(function() {
    if ($('.select2').length) {
        $('.select2').select2({
            theme: 'classic',
            width: '100%'
        });
    }
});

// Checkout form validation
$(document).ready(function() {
    $('#checkoutForm').on('submit', function(e) {
        const btn = $('#placeOrderBtn');
        btn.html('<i class="fas fa-spinner fa-spin"></i> Processing...');
        btn.prop('disabled', true);
    });
});
