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
            return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char];
            });
        }

        // Cada producto puede tener una galería opcional:
        // gallery: ['img/detalles/producto-1.jpeg', 'img/detalles/producto-2.jpeg']
        // También se aceptan objetos { src: '...', alt: '...' }.
        function getGallery(product) {
            var mainImage = product.detailImage || product.image || '';
            var configuredImages = product.gallery || product.images || product.detailImages || [];
            var gallery = [];
            var seen = {};

            if (!Array.isArray(configuredImages)) {
                configuredImages = [configuredImages];
            }

            function addImage(image, imageAlt) {
                var src = '';

                if (typeof image === 'string') {
                    src = image;
                } else if (image && typeof image === 'object') {
                    src = image.src || image.image || image.url || '';
                    imageAlt = image.alt || imageAlt;
                }

                if (!src || seen[src]) {
                    return;
                }

                seen[src] = true;
                gallery.push({
                    src: src,
                    alt: imageAlt || product.alt || product.title || 'Producto'
                });
            }

            // La imagen principal siempre aparece primero.
            addImage(mainImage, product.alt || product.title || 'Producto');
            configuredImages.forEach(function (image) {
                addImage(image, product.alt || product.title || 'Producto');
            });

            return gallery;
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
            var modalTarget = escapeHtml(modalId);

            return '' +
                '<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="' + delay + 's">' +
                    '<div class="service-item">' +
                        '<div class="service-img">' +
                            '<a href="#' + modalTarget + '" class="product-image-trigger" data-toggle="modal" data-target="#' + modalTarget + '" aria-label="Ver imágenes de ' + label + '">' +
                                '<img src="' + image + '" alt="' + alt + '">' +
                                '<div class="service-overlay"><span><i class="fa fa-images"></i> Ver imágenes</span></div>' +
                            '</a>' +
                        '</div>' +
                        '<div class="service-text">' +
                            '<h3>' + label + ' <i class="fa fa-chevron-right"></i></h3>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        function productModal(product, modalId) {
            var gallery = getGallery(product);
            var firstImage = gallery[0] || { src: product.detailImage || product.image || '', alt: product.alt || product.title || 'Producto' };
            var detailImage = escapeHtml(firstImage.src);
            var alt = escapeHtml(product.alt || product.title || 'Producto');
            var title = escapeHtml(product.title || '');
            var whatsappUrl = escapeHtml(product.whatsappLink || config.whatsappLink || $('.back-to-top').attr('href') || 'https://walink.co/fe04f5');
            var thumbnails = gallery.length > 1
                ? '<div class="product-gallery-thumbs" role="list" aria-label="Vistas de ' + title + '">' +
                    gallery.map(function (image, index) {
                        var imageSrc = escapeHtml(image.src);
                        var imageAlt = escapeHtml(image.alt);
                        return '<button type="button" class="product-gallery-thumb' + (index === 0 ? ' is-active' : '') + '" data-gallery-image="' + imageSrc + '" data-gallery-alt="' + imageAlt + '" role="listitem" aria-label="Ver vista ' + (index + 1) + ' de ' + title + '" aria-selected="' + (index === 0 ? 'true' : 'false') + '">' +
                            '<img src="' + imageSrc + '" alt="" loading="lazy">' +
                        '</button>';
                    }).join('') +
                '</div>'
                : '';

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
                                '<div class="product-gallery" data-gallery>' +
                                    '<img src="' + detailImage + '" alt="' + alt + '" class="img-responsive product-gallery-main" />' +
                                    thumbnails +
                                '</div>' +
                                '<div class="detail-consult-wrap">' +
                                    '<a href="' + whatsappUrl + '" class="detail-consult-btn" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp">' +
                                        '<i class="fab fa-whatsapp"></i>' +
                                        '<span>Consultar</span>' +
                                    '</a>' +
                                '</div>' +
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

        // Cambia la imagen principal sin cerrar el detalle del producto.
        $(document).on('click', '.product-gallery-thumb', function () {
            var $thumb = $(this);
            var $gallery = $thumb.closest('[data-gallery]');
            var imageSrc = $thumb.attr('data-gallery-image');
            var imageAlt = $thumb.attr('data-gallery-alt') || 'Producto';

            $gallery.find('.product-gallery-main')
                .attr('src', imageSrc)
                .attr('alt', imageAlt);
            $gallery.find('.product-gallery-thumb')
                .removeClass('is-active')
                .attr('aria-selected', 'false');
            $thumb.addClass('is-active').attr('aria-selected', 'true');
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

