;(function($){
	"use strict";

	// global scope of settings
	var settings;

	// create
	$.fn.wideImage = function( options ){
		// extend settings between defaults & options entered by users
		settings = $.extend( {}, $.fn.wideImage.defaults, options );
		// returning object
		return $(this).each( function(){
			var obj = this;

			if( $(this).hasClass('loaded') !== true ){
				$(this).css( settings.wrapStyles );
				$(this).find( settings.image ).css( settings.imageStyles );
			}

			obj.generate = function(){
				// execute
				var options = {
					animate : false,
					distance : settings.distance
				};
				// if add preload
				if( $(obj).hasClass('loaded') !== true ){
					preload( $(obj), options );
				} else {
					wideImage( $(obj), options, null );
				}
			};

			obj.hover = function(){
				$(obj).on( 'mouseover', function(){
					// execute
					var options = {
						animate : settings.animate,
						distance : settings.distanceHover,
						speed : settings.animateSpeed
					};
					wideImage( $(this), options, null );

				}).on( 'mouseleave', function(){
					$(this).find( settings.image ).stop();
					wideImage( $(this), { distance: settings.distance, animate : settings.animate, speed : 'fast' }, null );
				});
			};

			$(document).ready( function(){
				// do action
				obj.generate();
				// add hover effect
				if( settings.hover === true )
					obj.hover();
			});

			// generate event
			$(window).on('resize', function(){
				if( this.thumbnailResizeTo ) clearTimeout(this.thumbnailResizeTo);
				this.thumbnailResizeTo = setTimeout(function(){
					$(this).trigger('imageWideResizeEnd');
				}, 10);
			});
			// trigger event
			$(window).on('imageWideResizeEnd', function(){
				/* re-execute when page are resized */
				obj.generate();
			});

		});
	};

	$.fn.wideImage.defaults = {
		/* class elements */
		wrap : '.wi-wrap',
		image : '.wi-image',
		/* style elements */
		wrapStyles : { position : 'relative', overflow : 'hidden' },
		imageStyles : { position : 'absolute', zIndex : 0, opacity : 0, visibility : 'hidden' },
		/* behavior */
		preload : true,
		position : 'center',
		distance : 10,
		hover : false,
		distanceHover : 50,
		animate : true,
		animateSpeed : 2500
	};

	function getWidth( image ){
		if( $(image).data('width') )
			return $(image).data('width');

		var imageWidth = $(image).outerWidth();
		$(image).data('width', imageWidth);
		return imageWidth;
	}

	function getHeight( image ){
		if( $(image).data('height') )
			return $(image).data('height');

		var imageHeight = $(image).outerHeight();
		$(image).data('height', imageHeight);
		return imageHeight;
	}

	function preload( obj, options ){
		$(obj).find( settings.image ).one('load', function(){
			var check = setInterval( function(){
				if( $(obj).find( settings.image ).outerWidth() !== 0 ){
					$(obj).find( settings.image ).css({ opacity : 1, visibility : 'visible' });
					wideImage( $(obj), options );
					clearInterval( check );
				}
			}, 100 );
		}).each( function(){
			if( this.complete )
				$(this).load();
		});
	}

	function wideImage( obj, options ){
		// Extend options
		var defaults = { distance : 10, animate : false, speed : 'fast' };
		options = $.extend( {}, defaults, options );

		// Image Measures
		var percentage, newImageWidth, newImageHeight;

		// set image
		var image = $(obj).find( settings.image );

		// get variables
		var wrapWidth = $(obj).outerWidth();
		var wrapHeight = $(obj).outerHeight();
		var imageWidth = getWidth( image );
		var imageHeight = getHeight( image );

		if( imageWidth >= imageHeight ){
			percentage = Math.floor( ( imageWidth * 100 ) / imageHeight );
			newImageHeight = Math.floor( wrapHeight + options.distance );
			newImageWidth = Math.floor( ( newImageHeight * percentage ) / 100 );
			if( newImageWidth <= wrapWidth ){
				newImageWidth = wrapWidth + options.distance;
				newImageHeight = ( newImageWidth * 100 ) / percentage;
			}
		} else {
			percentage = Math.floor( ( imageHeight * 100 ) / imageWidth );
			newImageWidth = Math.floor( wrapWidth + options.distance );
			newImageHeight = Math.floor( ( newImageWidth * percentage ) / 100 );
			if( newImageHeight <= wrapHeight ){
				newImageHeight = wrapHeight + options.distance;
				newImageWidth = ( newImageHeight * 100 ) / percentage;
			}
		}
		// output sizes
		var sizes = { 'width' : newImageWidth, 'height' : newImageHeight };


		// Image Position
		var top = Math.floor( ( newImageHeight - wrapHeight ) / 2 * -1 ),
			left = Math.floor( ( newImageWidth - wrapWidth ) / 2 * -1 ),
			right = Math.floor( ( newImageWidth - wrapWidth ) / 2 * -1 ),
			bottom = Math.floor( ( newImageHeight - wrapHeight ) / 2 * -1 );

		// image positions
		if( settings.position.match(/top/) !== null )
			top = 0;
		if( settings.position.match(/left/) !== null )
			left = 0;
		if( settings.position.match(/right/) !== null )
			right = 0;
		if( settings.position.match(/bottom/) !== null )
			bottom = 0;

		// output position
		var positions = { 'top' : top, 'left' : left, 'right' : right, 'bottom' : bottom };

		// Execute
		var properties = $.extend( {}, sizes, positions );
		if( options.animate === true )
			$(image).stop().animate( properties, options.speed);
		else
			$(image).css( properties );

		$(obj).addClass('loaded');
	}

})(jQuery);