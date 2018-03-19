/**
 *  @shelf-version: 1.0.0
 */

import Events from './util/events';
import RafThrottle from './util/raf-throttle';

const STICKY_SCROLL_ELEMENT_HOOK = '[js-hook-sticky-scroll-element]';
const STICKY_STICKED_CLASS = 'sticky--is-sticked';
const STICKY_UNSTICKED_CLASS = 'sticky--is-unsticked';

class Sticky {

    constructor(element) {

        this.element = element;
        this.id = element.getAttribute('id');
        this.scrollElement = element.querySelector(STICKY_SCROLL_ELEMENT_HOOK);

        const stickyComponent = {
            element: this.element,
            id: this.id,
            scrollElement: this.scrollElement,
            threshold: parseInt(element.dataset.stickyThreshold, 10) || 0
        };

        this._bindStickyComponentEvents(stickyComponent);

    }

    /**
     * Bind all sticky component specific events
     * @param {HTMLElement} element Sticky component HTML element lane
     * @param {string} id Sticky component id
     * @param {HTMLElement} scrollElement Child element that scrolls through the sticky component lane
     * @param {number} threshold amount of offset before starting the animation
     */
    _bindStickyComponentEvents({ element, id, scrollElement, threshold }) {

        RafThrottle.set([{
            element: window,
            event: 'resize',
            namespace: `StickyComponentResize-${id}`,
            fn: () => this._setScrollElementSize()
        }]);

        this._setScrollElementSize();

        Events.$on(`sticky::update(${id})`, () => setStickyValues(element, scrollElement, threshold));

    }

    /**
     * Calculates the position of an element
     * @param {HTMLElement} element HTML element that is used to calculate the position
     */
    _setScrollElementSize() {

        this.scrollElement.position = this.scrollElement.getBoundingClientRect();
        this.element.position = this.element.getBoundingClientRect();

    }

}

/**
 * Sets the classes for the sticky element
 * @param {HTMLElement} el sticky component lane element
 * @param {HTMLElement} scrollElement Element that is updated
 * @param {number} threshold amount of offset before starting the animation
 */
function setStickyValues(element, scrollElement, threshold) {

    if (!element.inviewProperties || element.position.height <= scrollElement.position.height) { return; }

    if (element.inviewProperties.position.top + threshold >= 0) {

        if (element.inviewProperties.height - element.inviewProperties.position.top - threshold >= scrollElement.position.height) {
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
