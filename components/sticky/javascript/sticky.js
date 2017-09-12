/**
 *  @shelf-version: 1.0.0
 */

import 'core-js/fn/array/from';
import Events from './util/events';

const STICKY_HOOK                     = '[js-hook-sticky]';
const STICKY_SCROLL_ELEMENT_HOOK      = '[js-hook-sticky-scroll-element]';

class Sticky {

    constructor() {

        this.registeredStickyComponents = {};

        const stickyComponents = document.querySelectorAll(STICKY_HOOK);

        Array.from(stickyComponents).forEach(stickyComponent => this.setupStickyComponentRegistry(stickyComponent));

        this.bindEvents();

    }

    /**
     * Setup an object per found sticky component
     * @param {HTMLElement} el Single sticky component
     */
    setupStickyComponentRegistry(el) {

        const id = el.getAttribute('id');

        const scrollElement = el.querySelector(STICKY_SCROLL_ELEMENT_HOOK);

        const stickyComponent = {
            el,
            id,
            scrollElement
        };

        this.registeredStickyComponents[`sticky-${id}`] = stickyComponent;

        this.bindStickyComponentEvents(stickyComponent);
    }

    /**
     * Bind all sticky component specific events
     * @param {HTMLElement} el Sticky component HTML element lane
     * @param {string} id Sticky component id
     * @param {HTMLElement} scrollElement Child element that scrolls through the sticky component lane
     */
    bindStickyComponentEvents({ el, id, scrollElement }) {

        Events.$on(`sticky::update(#{ id })`, () => {

            setScrollElementPosition( scrollElement, getUpdatedTransformValue( el, scrollElement ) );

        });

    }

}


/**
 * Sets inline style attribute (transform: translateY) to mimic sticky effect
 * @param {HTMLElement} scrollElement Element that is updated
 * @param {number} position amount of added offset to the element
 */
function setScrollElementPosition( scrollElement, position ) {

    const transformValue = `translateY(${position}px)`;

    scrollElement.style.webkitTransform = transformValue;
    scrollElement.style.MozTransform = transformValue;
    scrollElement.style.msTransform = transformValue;
    scrollElement.style.OTransform = transformValue;
    scrollElement.style.transform = transformValue;

}


/**
 * Resets the position of the sticky scroll element to the default state (0)
 * @param {HTMLElement} el sticky component lane element
 * @param {HTMLElement} scrollElement Element that is updated
 */
function getUpdatedTransformValue( el, scrollElement) {
    const { pageYOffset: windowScrollPosition } = window;

    const startScroll = getStartScroll( el );
    const endScroll   = getEndScroll( el, scrollElement );

    // If scrolled passed the start Y position, enable sticky position
    return ( windowScrollPosition > startScroll ) ?

        // Constrain so that new sticky position can't get past the end scroll value
        Math.min(endScroll, windowScrollPosition - startScroll) :

        // If not scrolled passed the start Y position, constrain to 0 so that new sticky position can't get above the start scroll value
        0;

}


/**
 * Returns the offset top value of the sticky component
 * @param {HTMLElement} el sticky component lane element
 */
function getStartScroll( el ) {

    return getOffsetTopRelativeToDocumentTop( el );

}


/**
 * Calculates what scroll value is the end of the sticky lane
 * @param {HTMLElement} el sticky component lane element
 * @param {HTMLElement} scrollElement Element that is updated
 */
function getEndScroll( el, scrollElement ) {
    const stickyHostElementHeight   = el.offsetHeight;
    const stickyScrollElementHeight = scrollElement.offsetHeight;

    return stickyHostElementHeight - stickyScrollElementHeight;
}


/**
 * Calculates the offset top of an element relative to the top of the page
 * @param {HTMLElement} element HTML element that is used to calculate the offset
 */
function getOffsetTopRelativeToDocumentTop( element ) {
    const { top         : elementOffsetTopRelativeToWindow } = element.getBoundingClientRect();
    const { pageYOffset : windowScrollPosition             } = window;

    return elementOffsetTopRelativeToWindow + windowScrollPosition;
}

export default new Sticky();
