/*
 * Panels
*/

jQuery(document).ready(function($) {


	var $window    = $(window),
	    $body      = $('body'),
	    isTouch    = Modernizr.touch,
	    isnoTouch  = !isTouch,
	    ani        = 300;




	// Touch menu open/close
	(function() {
		if ( isTouch ) {
			var $toggle = $('#touchMenuToggle');

			var openTouchMenu = function() {
				$body.addClass('showTouchMenu');

				var scrollStart = $window.scrollTop();

				$window.on('scroll', function() {
					var scrollCurrent = $window.scrollTop();

					if ( Math.abs(scrollStart - scrollCurrent) > 60 ) {
						closeTouchMenu();
					}
				});

				$('#header, #mainNav').click(function(e) {
					e.stopPropagation();
				});
				$('html').one('click', function() {
					closeTouchMenu();
				});
			};

			var closeTouchMenu = function() {
				$body.removeClass('showTouchMenu');
				$window.off('scroll');
				$('html, #header, #mainNav').off('click');
			};

			$toggle.find('a.open').click(function() {
				openTouchMenu();
			});

			$toggle.find('a.close').click(function() {
				closeTouchMenu();
			});
		}
	})();




	// Collapsing panels
	(function() {
		if ( $('.panel') ) {
			var $panel = $('.panel'),
			    $toggle = $panel.find('.panel-toggle');

			$toggle.find('.open').click(function() {
				$(this).parents('.panel').addClass('open');
			});

			$toggle.find('.close').click(function() {
				$(this).parents('.panel').removeClass('open');
			});
		}
	})();




	// Collapsing drawers
	(function() {
		if ( $('.drawer') ) {
			var $drawer = $('.drawer'),
			    $toggle = $drawer.find('.drawer-toggle');

			// Hover sliding out effect
			if (isnoTouch) {

				$toggle.mouseleave(function() {
					var $drawer = $(this).parents('.drawer');
					$drawer.removeClass('hover');
				});

				$toggle.mouseenter(function() {
					var $drawer = $(this).parents('.drawer');
					if ( ! $drawer.hasClass('open') ) {
						$drawer.addClass('hover');
					}
				});
			}

			$toggle.click(function() {
				var $drawer = $(this).parents('.drawer');
				$drawer.removeClass('hover').toggleClass('open');
			});
		}
	})();




	// Online shops open/close
	/*(function() {
		if ( $body.hasClass('store-locator') ) {
			var $parent = $('#online'),
			    $toggle = $('#storeToggle');

			var openPanel = function() {
				$parent.addClass('open');
				// $('html, body').animate({scrollTop: $(document).height()}, ani);
			};

			var closePanel = function() {
				$parent.removeClass('open');
			};

			$toggle.find('.open').click(function() {
				openPanel();
			});

			$toggle.find('.close').click(function() {
				closePanel();
			});
		}
	})();*/




});







