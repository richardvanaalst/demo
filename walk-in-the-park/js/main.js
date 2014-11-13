/*
 * Main scripts
*/

jQuery(document).ready(function($) {


	var $window   = $(window),
	    $document = $(document),
	    $body     = $('body'),
	    isTouch   = Modernizr.touch,
	    isnoTouch = !isTouch,
	    ani       = 300;




	// Masonry grid alignment
	(function() {
		$('#masonryGrid').masonry({
			itemSelector: '.masonry-item',
			columnWidth:  '.masonry-grid-sizer',
			gutter:       '.masonry-gutter-sizer',
			transitionDuration: ani+'ms'
		});
	})();




	// Collection filter
	(function() {
		if ( $body.hasClass('collection') ) {
			var $filter,
			    filter;

			if ( isTouch ) {
				$filter = $("#productFilter select").change(function() {
					filter = $(this).val();
					filterProducts(filter);
				});
			}

			if ( isnoTouch ) {
				$filter = $("#productFilter a").click(function(e) {
					e.preventDefault();
					filter = $(this).attr('href').substr(1); // remove # from href
					filterProducts(filter);
				});
			}

			function filterProducts(filter) {
				// show all
				$('#masonryGrid .product').show();

				// if filter, then filter (Cruijfianism: Yes, but that's logic)
				if ( filter !== 'all' ) {
					$('#masonryGrid .product:not(.' + filter + ')').hide();
				}

				// set the title to whatever is filtered
				$('#productFilter h3 span').text(filter);

				// recalculate the grid
				$('#masonryGrid').masonry();
			}
		}
	})();




	// Footer link scroll to top
	(function() {
		var $top = $('#footerTop .top');

		$top.click(function(e) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, ani / 2);
		});
	})();




	// Footer expand when content height is smaller than window

	// 1.  expand when content < window
	// 2.  collapse when content > window
	// 2a. collapse & scroll when visisble


	(function() {
		var $container         = $('#container'),
		    $content           = $('#content'),
		    $footer            = $('#footer'),
		    $footerTop         = $('#footerTop'),
		    $footerBottom      = $('#footerBottom'),
		    $toggle            = $footerTop.find('.panel-toggle'),
		    footerTopHeight    = null,
		    footerBottomHeight = null,
		    footerHeight       = null,
		    scrollHeight       = null,
		    scrollStart        = null,
		    scrollTop          = $window.scrollTop(),
		    stickyFooter       = null;


		function updateValues() {
			footerTopHeight    = $footerTop.height();
			footerBottomHeight = $footerBottom.height();
			footerHeight       = footerTopHeight + footerBottomHeight + 1; // 1px border-top
			scrollHeight       = $document.height() - $window.height() - footerBottomHeight;
			scrollTop          = $window.scrollTop();
		}


		function stickyFooterOrnot() {
			updateValues();

			if ( $container.css('paddingBottom') !== footerHeight ) {
				$container.css({ 'paddingBottom': footerHeight });
			}

			// Sticky collapsed footer when scrolling away from the bottom of page
			if ( stickyFooter === false && scrollHeight - scrollTop > 0 ) {
				$footer.addClass('sticky');
				$toggle.fadeIn(ani);
				stickyFooter = true;
				// console.log('stickyFooter', stickyFooter, scrollTop)
			}

			// Scroll expanded footer when scrolling at bottom of page
			else if ( stickyFooter === true && scrollHeight - scrollTop <= 0 ) {
				$footer.removeClass('sticky').removeClass('open');
				$toggle.fadeOut(ani);
				stickyFooter = false;
				// console.log('stickyFooter', stickyFooter, scrollTop)
			}

			// Collapse the expanded footer when scrolling 1/2 the height of it
			if ( stickyFooter === true && $footer.hasClass('open') && Math.abs(scrollStart - scrollTop) > footerHeight * 1/2 ) {
				$toggle.find('.close').click();
			}
		}


		updateValues();
		$container.css({ 'paddingBottom': footerHeight });

		// Check if header image is loaded: increases document height
		$content.find('.header-visual .image').imagesLoaded(function() {

			scrollHeight = $document.height() - $window.height() - footerBottomHeight;
			// console.log( 'w'+$window.height(), 'd'+$document.height(), 's'+scrollHeight )


			// Sticky when content is larger than the window
			if ( $content.height() >= $window.height() - footerTopHeight ) {
				$footer.addClass('sticky');
				$toggle.show();
				stickyFooter = true;
			}
			// Regular when content is smaller than the window
			else {
				$footer.removeClass('sticky');
				$toggle.hide();
				stickyFooter = false;
			}
			// console.log('stickyFooter', stickyFooter)


			$toggle.find('.open').click(function() {
				scrollStart = $window.scrollTop();
			});


			$window.on({
				resize: function() {
					stickyFooterOrnot();
				},
				scroll: function() {
					stickyFooterOrnot();
				}
			}).resize();
		});
	})();




	// Blur all other items when subscribing on homepage => performance?
	(function() {
		if ( $body.hasClass('home') ) {
			$('#mc4wp_email').focus(function() {
				$('.masonry-item:not(.newsletter)').animate({
					opacity: 0.2
				}, ani);
			});
			$('#mc4wp_email').blur(function() {
				$('.masonry-item:not(.newsletter)').animate({
					opacity: 1
				}, ani / 2);
			});
		}
	})();




});







