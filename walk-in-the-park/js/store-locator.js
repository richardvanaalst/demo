/*
 * Google map
*/

jQuery(document).ready(function($) {


	var $window    = $(window),
	    $body      = $('body'),
	    $map       = null,
	    $geocoder  = null,
	    storelist  = [], // JSON list
	    markers    = [],
	    infowindow = null,
	    zoomIn     = 16,
	    zoomOut    = 8,
	    centerNL   = [52.2129919, 5.2793703], // Nederland
	    isTouch    = Modernizr.touch,
	    isnoTouch  = !isTouch,
	    medium     = 768,
	    ani        = 300;




	// Filter cities in Store locator
	if ( $body.hasClass('store-locator') ) {

		// Add case-insensitive "starts with" selector expression to jQuery
		// http://stackoverflow.com/questions/187537/is-there-a-case-insensitive-jquery-contains-selector
		jQuery.expr[":"].startsWith = jQuery.expr.createPseudo(function(arg) {
			return function(elem) {
				return jQuery(elem).text().toLowerCase().indexOf(arg.toLowerCase()) == 0;
			};
		});


		var $input = $('#cityFilter input'),
		    $clear = $('#cityFilter a'),
		    $list  = $('#offline ul.cities'),
		    $store = $list.find('li.store');

		$input.focus(function() {
			if (isTouch && $window.width() < medium) {
				var scrollTop = $(this).offset().top - 16;
				$('html, body').animate( { scrollTop: scrollTop }, ani );
			}
		});

		$input.change(function() {
			var value  = $(this).val(),
			    $city  = $list.find('> li');

			if (value) {
				$city.each(function() {
					$(this).hide();
					$(this).find('> h1:startsWith(' + value + ')').parent().show();
				});
				$clear.fadeIn(ani / 2);
			}
			else {
				$city.each(function() {
					$(this).hide();
				});
				$clear.fadeOut(ani / 2);
			}

			filterMarkersByCity(value);

		}).on('input', function() {
			$(this).change();
		}).keyup(function(e) {
			// Clear on ESC
			if (e.keyCode === 27) {
				$(this).val('').change();
			}
		});

		$clear.click(function() {
			$input.val('').change();
		});

		$list.find('h1 a').click(function(e) {
			e.preventDefault();
			$input.val( $(this).text() ).change();
		});

		$store.click(function() {
			var filter = $(this).find('p:nth-of-type(1)').text() + ' ' + $(this).find('p:nth-of-type(2)').text();
			console.log( filter )
			filterMarkersByStore( filter );
		});
	}




	// Google Maps API functions
	// Only on medium+ devices
	if ( window.google && $('#map-canvas').length > 0 && $window.width() >= medium ) {

		function initMap() {
			if ( $body.hasClass('contact') ) {
				var mapOptions = {
					center: new google.maps.LatLng(51.749885, 4.769849),
					zoom: zoomOut
				};

				$map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				addMarkerByAddress( 'Gruppo Adanti', ['Lorentzlaan 7', '3401 MX', 'IJselstein', 'The Netherlands'] );
				addMarkerByAddress( 'Kelma International', ['Constant Neutjensstraat 43', 'B2900', 'Schoten', 'Belgium'] );
			}
			else {
				// Center map on Nederland
				var mapOptions = {
					center: new google.maps.LatLng(centerNL[0], centerNL[1]),
					zoom: zoomOut
				};

				$map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				addAllMarkers();
			}
		}


		function addMarkerByAddress(title, address) {
			geocoder = new google.maps.Geocoder();
			geocoder.geocode( {'address': address.toString()}, function(results, status) {

				if (status == google.maps.GeocoderStatus.OK) {
					addMarker(results[0].geometry.location, title, address, true)
				}
				else {
					console.log('Geocode: ' + status + ' | ' + address);
				}
			});
		}


		function addMarker(position, title, address, tag) {
			var marker = new google.maps.Marker({
				map: $map,
				position: position,
				title: title,
				address: address
			});

			google.maps.event.addListener(marker, 'click', function() {
				addInfoWindow(this, this.title, this.address);
			});

			if (tag) {
				addInfoWindow(marker, title, address);
			}

			markers.push(marker);
		}


		function addInfoWindow(marker, title, address) {

			if (infowindow) {
				infowindow.close();
			}

			infowindow = new google.maps.InfoWindow();

			var info = '';

			if (title) {
				info += '<h4>' + title + '</h4>';
			}

			if (address) {
				info += address[0] + '<br>'; // Street
				info += address[1] + ' ';    // Post code
				info += address[2];          // City
			}

			// Country
			if ( address[3] != undefined ) {
				info += '<br>' + address[3];
			}

			infowindow.setContent(info);
			infowindow.open($map, marker);
		}


		function addAllMarkers() {
			$.getJSON( "/wordpress/wp-content/uploads/geocode-stores.json", function(data) {

				// store
				$.each( data.storelist, function(key, val) {
					var position = new google.maps.LatLng(val.geolocation.latitude, val.geolocation.longitude),
					    title    = val.name,
					    address  = [val.address.street, val.address.postcode, val.address.city];

					storelist.push(key);
					addMarker(position, title, address);
				});
			});
		}


		function filterMarkersByStore(filter) {
			clearMarkers();

			$.each( markers, function(key, val) {
				// Can be improved!
				var value = val.address[0] + ' ' + val.address[1] + ' ' + val.address[2];
				value = value.toLowerCase();
				filter = filter.toLowerCase();

				if ( value.indexOf(filter) === 0 ) {
					this.setMap($map);
					addInfoWindow(this, this.title, this.address);
					$map.setZoom(zoomIn);
					$map.panTo( this.getPosition() );
				}
			});
		}


		function filterMarkersByCity(filter) {
			var center = new google.maps.LatLng(centerNL[0], centerNL[1]);
			$map.setZoom(zoomOut);
			$map.panTo(center);
			clearMarkers();

			$.each( markers, function(key, val) {
				var value = val.address[2].toLowerCase();
				filter = filter.toLowerCase();

				if ( value.indexOf(filter) === 0 ) {
					this.setMap($map);
				}
			});
		}


		function setAllMap(map) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		}


		// Shows any markers currently in the array.
		function showMarkers() {
			setAllMap($map);
		}


		// Removes the markers from the map, but keeps them in the array.
		function clearMarkers() {
			console.log('clearMarkers')
			if (infowindow) {
				infowindow.close();
			}
			setAllMap(null);
		}


		// Deletes the markers from the map and the array.
		function deleteMarkers() {
			clearMarkers();
			markers = [];
		}


		google.maps.event.addDomListener(window, 'load', initMap);
	}




});







