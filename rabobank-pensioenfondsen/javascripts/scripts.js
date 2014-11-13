/**
 *  Main scripts
 *  build 20140409
*/



// Test connection speed for HiSRC images once, before DOM is ready
// https://github.com/teleject/hisrc
if (typeof $.hisrc !== 'undefined') {
	var hisrcSpeedTestUri = { speedTestUri: 'javascripts/vendor/hisrc-50K.jpg' };
	$.hisrc.speedTest(hisrcSpeedTestUri);
}



$(document).ready(function() {


	// Subnav in sidebar, add atrributes to add collapsing panels
	var sideNavCollapse = function() {
		$('#subnav li.subnav').each(function() {

			var $submenu = $(this).find('ul.level-2'),
			    $link    = $(this).find('> a');

			// Add class to ul.level-1 for styling hookup
			$(this).parent('ul.level-1').addClass('subnav');

			// Close all but active
			if ( $(this).find('li').hasClass('active') ) {
				$submenu.addClass('in');
			}
			else {
				$(this).addClass('collapsed');
				$submenu.addClass('collapse');
			}

			// Add Bootstrap collapse to level-1 links
			// Initialise active submenu for browsers without transition support:
			// http://stackoverflow.com/questions/12787119/bootstrap-2-1-1-collapsible-not-opening-first-time-in-ie
			$link.next('ul.level-2').collapse({toggle: false});
			$link.attr('data-toggle', 'collapse').click(function(e) {
				e.preventDefault();
				$(this).parent().toggleClass('collapsed').find('ul.level-2').collapse('toggle');
			});
		});
	};



	// Make sub-home navigation items behave like grid components
	var subhomeNavGrid = function() {
		var $subnav = $('body.sub-home-page #subhomenav > ul.level-1');

		// Multiple lists
		if ($subnav.length > 0 && $subnav.find('> li').hasClass('subnav')) {

			// Add grid column class
			$subnav.find('> li').addClass('col-sm-6');

			// Replace level-2 link with header
			$subnav.find('> .col-sm-6 > a').replaceWith(function() {
				return $('<h2 class="h3" />').append($(this).contents());
			});
		}
		// Single list
		else if ($subnav.length > 0) {
			$subnav.removeClass('level-1').addClass('level-2 col-sm-6');
		}
	};



	// Navigtion for mobile
	var mobileNav = function() {

		var $skip       = $('#skip'),
		    $showNav    = $skip.find('#show-nav a'),
		    $showSearch = $skip.find('#show-search a'),
		    $nav        = $('#navigation'),
		    $search     = $('#search'),
		    $channels   = $('#channels');

		// Create a mobile version for the channels, if they exist
		if ($('#channels').length > 0) {

			var $channelsMobile = $('<div id="channels-mobile" class="dropdown"><ul class="dropdown-menu" role="menu" aria-labelledby="channelsMobileBtn"></ul></div>'),
			    $channelsMobileBtn = $('<button id="channelsMobileBtn" class="btn" type="button" data-toggle="dropdown"><span class="caret"></span></button>');

			$channels.find('li').each(function() {
				$channelsMobile.find('ul').append($(this).clone());
			});

			$channelsMobileBtn.prepend($channels.find('li.active').eq(0).text());

			$channelsMobile.prepend($channelsMobileBtn);
			$nav.prepend($channelsMobile);
		}

		// Events for toggles
		$showSearch.click(function(e) {
			e.preventDefault();

			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$nav.removeClass('show');
				$search.removeClass('show');
				$search.find('input.gsc-input').blur();
			}
			else {
				$skip.find('a').removeClass('active');
				$(this).addClass('active');
				$nav.removeClass('show');
				$search.addClass('show');
				$search.find('input.gsc-input').focus();
			}
		});

		$showNav.click(function(e) {
			e.preventDefault();

			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$nav.removeClass('show');
				$search.removeClass('show');
			}
			else {
				$skip.find('a').removeClass('active');
				$(this).addClass('active');
				$nav.addClass('show');
				$search.removeClass('show');
			}
		});
	};



	var videoModal = function() {

		// Modal video lightbox
		$('a.show-modal').click(function(e) {
			e.preventDefault();
			$('#video-lightbox').attr({'data-href': $(this).attr('data-href')}).modal();
		});

		// location.replace, to prevent browser history state
		$('#video-lightbox').on('show.bs.modal', function() {
			var $iframe = $('#video-iframe'),
			    $href   = $(this).attr('data-href');

			// Remove whatever is in the src attribute, replace location
			$iframe.attr('src', '').get(0).contentWindow.location.replace($href);

		}).on('hide.bs.modal', function() {
			var $iframe = $('#video-iframe'),
			    $href   = 'about:blank';

			// Remove content, set blank page
			$iframe.get(0).contentWindow.location.replace($href);
		});
	};



	var downloadList = function() {

		var $lists = $('.download-list');

		$lists.each(function() {
			var $list     = $(this),
				$items    = $(this).find('li'),
				listLimit = $list.data('list-limit'),
				$toggle   = $list.find('.toggle-list'),
				$less     = $toggle.find('.less-items'),
				$more     = $toggle.find('.more-items');

			function collapse(ani) {
				// Show more button
				$more.show();
				$less.hide();

				// Limit the list
				if (ani === true) {
					$items.slice(listLimit).slideUp();
				}
				else {
					$items.slice(listLimit).hide();
				}
			}

			function expand() {
				// Show more button
				$more.hide();
				$less.show();

				// Limit the list
				$items.slideDown();
			}

			// Click event for less button
			$more.click(function() {
				expand();
				return false;
			});

			// Click event for more button
			$less.click(function() {
				collapse(true);
				return false;
			});

			// If the list-limit data attribute is set, do stuff
			if (listLimit !== undefined) {
				if (listLimit < $items.length) {
					collapse(false);
				}
			}
			else {
				return true;
			}
		});
	};



	// Add misc functionalities
	var miscFunc = function() {

		// Add extra classes to the collapse panels for custom styling
		$('.panel').on('show.bs.collapse', function() {
			$(this).addClass('in');
		}).on('hide.bs.collapse', function() {
			$(this).removeClass('in');
		});



		// Extend Bootstrap carousel with swipe for touch devices
		// and HiSRC images, depending on screen and connection speed
		if ($('#carousel').length > 0) {
			$('#carousel').find('img').hisrc(hisrcSpeedTestUri);

			if ($('html').hasClass('touch')) {
				$('#carousel').swiperight(function() {
					$(this).carousel('prev');
				}).swipeleft(function() {
					$(this).carousel('next');
				});
			}
		}



		// HiSRC top visual
		if ($('#visual').length > 0) {
			$('#visual').find('img').hisrc(hisrcSpeedTestUri);
		}



		// Add classes to login form, so they behave like grid components
		// and get the correct styling
		$('.container-app fieldset').each(function() {
			$(this).parent().addClass('row');
			$(this).addClass('col-sm-6');
			$(this).find('a').addClass('action');
		});



		// Footer panels: disable Bootstrap collapse on desktop screens
		$('#footer-top .panel h6').each(function() {
			$(this).click(function() {
				if ($(window).width() < 992) {
					$(this).attr('data-toggle', 'collapse');
				}
				else {
					$(this).removeAttr('data-toggle');
				}
			});
		});



		// Add extra class to last row for IE8
		// (This piece of code can be removed when dropping support for IE8,
		// css already has :last-child and :last-of-type for modern browsers.)
		if (navigator.appVersion.indexOf("MSIE 8.") !== -1) {
			$('.row.main:last-of-type').addClass('last');
		}

	};



	// Init functions
	sideNavCollapse();
	subhomeNavGrid();
	mobileNav();
	videoModal();
	downloadList();
	miscFunc();

});


