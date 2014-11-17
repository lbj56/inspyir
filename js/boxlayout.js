/**
 * boxlayout.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var Boxlayout = (function() {

	var $el = $( '#bl-main' ),
		$sections = $el.children( 'section' ),
		// works section
		$subSection = $( '#bl-sub-section' ),
		// work items
		$secondaryItems = $( '#bl-secondary-items > li' ),
		// work panels
		$secondaryPanelsContainer = $( '#bl-panel-secondary-items' ),
		$secondaryPanels = $secondaryPanelsContainer.children( 'div' ),
		totalsecondaryPanels = $secondaryPanels.length,
		// navigating the work panels
		$nextSecondaryItem = $secondaryPanelsContainer.find( 'nav > span.bl-next-secondary' ),
		// if currently navigating the work items
		isAnimating = false,
		// close work panel trigger
		$closeSecondaryItem = $secondaryPanelsContainer.find( 'nav > span.bl-icon-close' ),
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		// transition end event name
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support css transitions
		supportTransitions = Modernizr.csstransitions;

	function init() {
		initEvents();
	}

	function initEvents() {
		
		$sections.each( function() {
			
			var $section = $( this );

			// expand the clicked section and scale down the others
			$section.on( 'click', function() {

				if( !$section.data( 'open' ) ) {
					$section.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
					$el.addClass( 'bl-expand-item' );	
				}

			} ).find( 'span.bl-icon-close' ).on( 'click', function() {
				
				// close the expanded section and scale up the others
				$section.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
					if( !$( event.target ).is( 'section' ) ) return false;
					$( this ).off( transEndEventName ).removeClass( 'bl-expand-top' );
				} );

				if( !supportTransitions ) {
					$section.removeClass( 'bl-expand-top' );
				}

				$el.removeClass( 'bl-expand-item' );
				
				return false;

			} );

		} );

		// clicking on a work item: the current section scales down and the respective work panel slides up
		$secondaryItems.on( 'click', function( event ) {

			// scale down main section
			$subSection.addClass( 'bl-scale-down' );

			// show panel for this work item
			$secondaryPanelsContainer.addClass( 'bl-panel-items-show' );

			var $panel = $secondaryPanelsContainer.find("[data-panel='" + $( this ).data( 'panel' ) + "']");
			currentWorkPanel = $panel.index();
			$panel.addClass( 'bl-show-work' );

			return false;

		} );

		// navigating the work items: current work panel scales down and the next work panel slides up
		$nextSecondaryItem.on( 'click', function( event ) {
			
			if( isAnimating ) {
				return false;
			}
			isAnimating = true;

			var $currentPanel = $secondaryPanels.eq( currentWorkPanel );
			currentWorkPanel = currentWorkPanel < totalsecondaryPanels - 1 ? currentWorkPanel + 1 : 0;
			var $nextPanel = $secondaryPanels.eq( currentWorkPanel );

			$currentPanel.removeClass( 'bl-show-work' ).addClass( 'bl-hide-current-work' ).on( transEndEventName, function( event ) {
				if( !$( event.target ).is( 'div' ) ) return false;
				$( this ).off( transEndEventName ).removeClass( 'bl-hide-current-work' );
				isAnimating = false;
			} );

			if( !supportTransitions ) {
				$currentPanel.removeClass( 'bl-hide-current-work' );
				isAnimating = false;
			}
			
			$nextPanel.addClass( 'bl-show-work' );

			return false;

		} );

		// clicking the work panels close button: the current work panel slides down and the section scales up again
		$closeSecondaryItem.on( 'click', function( event ) {

			// scale up main section
			$subSection.removeClass( 'bl-scale-down' );
			$secondaryPanelsContainer.removeClass( 'bl-panel-items-show' );
			$secondaryPanels.eq( currentWorkPanel ).removeClass( 'bl-show-work' );
			
			return false;

		} );

	}

	return { init : init };

})();