/**
 *  @shelf-version: 1.0.0
 */

import Events from '@utilities/events';
import RafThrottle from '@utilities/raf-throttle';

const STICKY_SCROLL_ELEMENT_HOOK = '[js-hook-sticky-scroll-element]';
const STICKY_STICKED_CLASS = 'sticky--is-sticked';
const STICKY_UNSTICKED_CLASS = 'sticky--is-unsticked';

class Sticky {

    constructor(element) {

        this.element = element;
        this.id = element.getAttribute('id');
        this.scrollElement = element.querySelector(STICKY_SCROLL_ELEMENT_HOOK);
        this.threshold = parseInt(element.dataset.stickyThreshold, 10) || 0;

        this._bindStickyComponentEvents();

        Events.$trigger(`sticky[${this.id}]::update`);

    }

    /**
     * Bind all sticky component specific events
     */
    _bindStickyComponentEvents() {

        RafThrottle.set([{
            element: window,
            event: 'resize',
            namespace: `StickyComponentResize-${this.id}`,
            fn: () => this._setScrollElementSize()
        }]);

        this._setScrollElementSize();

        Events.$on(`sticky[${this.id}]::recalc`, () => this._setScrollElementSize());
        Events.$on(`sticky[${this.id}]::update`, () => setStickyValues(this.element, this.scrollElement, this.threshold, this.windowHeight));

    }

    /**
     * Calculates the position of an element
     * @param {HTMLElement} element HTML element that is used to calculate the position
     */
    _setScrollElementSize() {

        this.scrollElement.position = this.scrollElement.getBoundingClientRect();
        this.element.position = this.element.getBoundingClientRect();
        this.windowHeight = window.innerHeight;

    }

}

/**
 * Sets the classes for the sticky element
 * @param {HTMLElement} el sticky component lane element
 * @param {HTMLElement} scrollElement Element that is updated
 * @param {number} threshold amount of offset before starting the animation
 */
function setStickyValues(element, scrollElement, threshold, windowHeight) {

    if (
        !element.inviewProperties
        || windowHeight <= scrollElement.position.height + threshold
        || element.position.height <= scrollElement.position.height
    ) {
        resetStickyClasses(scrollElement);
        return;
    }

    if (element.inviewProperties.position.top - threshold <= 0) {

        if (element.inviewProperties.position.top - scrollElement.position.height - threshold >= -element.inviewProperties.height) {
            setStickyClasses(scrollElement, threshold);
        } else {
            setUnStickyClasses(scrollElement);
        }

    } else {

        resetStickyClasses(scrollElement);

    }

}

function setStickyClasses(scrollElement, threshold) {

    scrollElement.style.top = `${threshold}px`;
    scrollElement.classList.add(STICKY_STICKED_CLASS);
    scrollElement.classList.remove(STICKY_UNSTICKED_CLASS);

}

function setUnStickyClasses(scrollElement) {

    scrollElement.style.top = '';
    scrollElement.classList.add(STICKY_UNSTICKED_CLASS);
    scrollElement.classList.remove(STICKY_STICKED_CLASS);

}

function resetStickyClasses(scrollElement) {

    scrollElement.style.top = '';
    scrollElement.classList.remove(STICKY_STICKED_CLASS);
    scrollElement.classList.remove(STICKY_UNSTICKED_CLASS);

}


export default Sticky;
