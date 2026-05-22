(function ($) {
    "use strict";
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
   
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
            $('.nav-bar').addClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "73px");
        } else {
            $('.nav-bar').removeClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "0");
        }
    });
    
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });

    // Dynamic product cards for category pages
    $(document).ready(function () {
        var config = window.MADERCOLOR_DYNAMIC_PRODUCTS;

        if (!config || !Array.isArray(config.products) || !config.products.length) {
            return;
        }

        function escapeHtml(value) {
            return String(value || '').replace(/[&<>"']/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char];
            });
        }

        function ensureServiceSection() {
            var $service = $('.service').first();

            if ($service.length) {
                return $service;
            }

            var title = escapeHtml(config.title || '');
            var intro = escapeHtml(config.intro || '');
            var header = title || intro
                ? '<div class="section-header text-center">' +
                    (title ? '<h2>' + title + '</h2>' : '<h2></h2>') +
                    (intro ? '<p>' + intro + '</p>' : '') +
                  '</div>'
                : '';

            $service = $(
                '<div class="service dynamic-products">' +
                    '<div class="container">' +
                        header +
                        '<div class="row"></div>' +
                    '</div>' +
                '</div>'
            );

            $('.page-header').first().after($service);
            return $service;
        }

        function productCard(product, modalId, delay) {
            var image = escapeHtml(product.image || product.detailImage || '');
            var alt = escapeHtml(product.alt || product.title || 'Producto');
            var label = escapeHtml(product.buttonLabel || product.title || 'Ver Detalles');

            return '' +
                '<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="' + delay + 's">' +
                    '<div class="service-item">' +
                        '<div class="service-img">' +
                            '<img src="' + image + '" alt="' + alt + '">' +
                            '<div class="service-overlay"></div>' +
                        '</div>' +
                        '<div class="service-text">' +
                            '<h3>' + label + ' <i class="fa fa-chevron-right"></i></h3>' +
                            '<a href="#" class="btn" data-toggle="modal" data-target="#' + modalId + '" aria-label="' + label + '">+</a>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        function productModal(product, modalId) {
            var detailImage = escapeHtml(product.detailImage || product.image || '');
            var alt = escapeHtml(product.alt || product.title || 'Producto');
            var title = escapeHtml(product.title || '');

            return '' +
                '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="' + modalId + '-label">' +
                    '<div class="modal-dialog modal-lg" role="document">' +
                        '<div class="modal-content">' +
                            '<div class="modal-header">' +
                                '<h4 class="modal-title" id="' + modalId + '-label">' + title + '</h4>' +
                                '<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">' +
                                    '<span aria-hidden="true">&times;</span>' +
                                '</button>' +
                            '</div>' +
                            '<div class="modal-body">' +
                                '<img src="' + detailImage + '" alt="' + alt + '" class="img-responsive" />' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        var $service = ensureServiceSection();
        var $row = $service.find('.row').first();
        var existingCount = $service.find('.service-item').length;

        if (config.replaceExisting) {
            $row.empty();
            $('.modal[id^="Modal-"]').remove();
            existingCount = 0;
        }

        config.products.forEach(function (product, index) {
            var modalId = product.modalId || 'Modal-dynamic-' + (config.page || 'product') + '-' + (index + 1);
            var delay = ((existingCount + index) % 6 + 1) / 10;

            $row.append(productCard(product, modalId, delay.toFixed(1)));
            $('.wrapper').append(productModal(product, modalId));
        });

        if (typeof WOW === 'function') {
            new WOW().init();
        }
    });


    // Testimonial Slider
    $('.testimonial-slider').slick({
        infinite: true,
        autoplay: true,
        arrows: false,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.testimonial-slider-nav'
    });
    $('.testimonial-slider-nav').slick({
        arrows: false,
        dots: false,
        focusOnSelect: true,
        centerMode: true,
        centerPadding: '22px',
        slidesToShow: 3,
        asNavFor: '.testimonial-slider'
    });
    $('.testimonial .slider-nav').css({"position": "relative"});
    
    
    // Blogs carousel
    $(".related-slider").owlCarousel({
        autoplay: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });
    
    
    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);

