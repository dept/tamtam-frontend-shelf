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

        const el = element;
        const id = el.getAttribute('id');
        const scrollElement = el.querySelector(STICKY_SCROLL_ELEMENT_HOOK);

        const stickyComponent = {
            el,
            id,
            scrollElement,
            threshold: parseInt(el.dataset.stickyThreshold) || 0
        };

        this._bindStickyComponentEvents(stickyComponent);

    }

    /**
     * Bind all sticky component specific events
     * @param {HTMLElement} el Sticky component HTML element lane
     * @param {string} id Sticky component id
     * @param {HTMLElement} scrollElement Child element that scrolls through the sticky component lane
     * @param {number} threshold amount of offset before starting the animation
     */
    _bindStickyComponentEvents({ el, id, scrollElement, threshold }) {

        RafThrottle.set([{
            element: window,
            event: 'resize',
            namespace: `StickyComponentResize-${id}`,
            fn: () => setScrollElementSize(scrollElement)
        }]);

        setScrollElementSize(scrollElement);

        Events.$on(`sticky::update(${id})`, () => setStickyValues(el, scrollElement, threshold));

    }

}

/**
 * Sets the classes for the sticky element
 * @param {HTMLElement} el sticky component lane element
 * @param {HTMLElement} scrollElement Element that is updated
 * @param {number} threshold amount of offset before starting the animation
 */
function setStickyValues(el, scrollElement, threshold) {

    if (!el.inviewProperties) { return; }

    if (el.inviewProperties.position.top + threshold >= 0) {

        if (el.inviewProperties.height - el.inviewProperties.position.top - threshold >= scrollElement.position.height) {
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


/**
 * Calculates the position of an element
 * @param {HTMLElement} element HTML element that is used to calculate the position
 */
function setScrollElementSize(element) {

    element.position = element.getBoundingClientRect();

}

export default Sticky;
