/**
 * @shelf-version: 1.0.0
 */

import RafThrottle from './raf-throttle';
import Events from './events';

const INVIEW_HOOK = '[js-hook-inview]';

class InView {

    constructor() {

        this.elements = getElements();
        this.elementArray = [];

        this.eventsToBeBound = [];

        this._bindEvent();

        Events.$trigger('in-view::update');
        window.dispatchEvent(new CustomEvent('scroll'));

    }

    /**
     * Bind events
     */
    _bindEvent() {

        Events.$on('in-view::update', () => {

            this._updateElements();
            this._addElements();
            this._bindScrollEvent();

        });

    }

    /**
    * Bind all the events
    */
    _bindScrollEvent() {

        RafThrottle.set(this.eventsToBeBound);

    }

    /**
    * Sets new element config and adds them to element arrays
    * @param {Number} index Index of the element
    * @param {HTMLElement} element Element to track
    * @param {Object[]} [element[].dataset]
    * @param {Number} [element[].dataset[].inviewOffsetTop] Offset in pixels
    * @param {Number} [element[].dataset[].inviewOffsetBottom] Offset in pixels
    * @param {Number} [element[].dataset[].inviewOffsetLeft] Offset in pixels
    * @param {Number} [element[].dataset[].inviewOffsetRight] Offset in pixels
    * @param {Number} [element[].dataset[].inviewThreshold] Can be a value between 0 and 1
    * @param {string} [element[].dataset[].inviewTrigger] Triggers you want to fire, can be comma seperated
    */
    _setNewElement(index, element) {

        const config = {
            index,
            element,
            offset: {
                top: element.dataset.inviewOffsetTop || 0,
                bottom: element.dataset.inviewOffsetBottom || 0,
                left: element.dataset.inviewOffsetLeft || 0,
                right: element.dataset.inviewOffsetRight || 0
            },
            threshold: element.dataset.inviewThreshold || 0,
            triggers: getTriggers(element.dataset.inviewTrigger)
        }

        this.elementArray.push(config);
        this.eventsToBeBound.push({ element: window, event: 'scroll', namespace: `ElementInView-${index}`, fn: () => this._elementInView(config) })

    }

    /**
    * Checks if element is in viewport and adds appropriate classes
    * @param {Object[]} config
    * @param {Number} config[].index Index of the element
    * @param {HTMLElement} config[].element Element to track
    * @param {Object[]} [config[].offset]
    * @param {Number} [config[].offset[].top] Offset in pixels
    * @param {Number} [config[].offset[].bottom] Offset in pixels
    * @param {Number} [config[].offset[].left] Offset in pixels
    * @param {Number} [config[].offset[].right] Offset in pixels
    * @param {Number} [config[].threshold] Can be a value between 0 and 1
    * @param {string} [config[].triggers] Triggers you want to fire, can be comma seperated
    */
    _elementInView(config) {

        const element = config.element;

        if (elementIsInViewport(element, config).bottom) {

            element.classList.remove('is--out-view');

            config.triggers.forEach((trigger) => setTriggers(trigger, element));

            RafThrottle.remove([{ element: window, event: 'scroll', namespace: `ElementInView-${config.index}` }]);


        } else {

            if (element.classList.contains('is--out-view')) {
                return;
            }

            element.classList.add('is--out-view');

        }

    }

    /**
    * Adds all elements to inview tracking
    */
    _addElements() {

        this.elements.forEach((element, index) => {

            this._setNewElement(index, element);

        });

    }

    /**
    * Empties current events and gets new elements
    */
    _updateElements() {

        this.eventsToBeBound = [];
        this.elements = getElements();

    }

}

/**
* Gets all elements matching the INVIEW_HOOK
* @returns {NodeList} All matching HTMLElements
*/
function getElements() {

    return document.querySelectorAll(INVIEW_HOOK);

}

/**
* Returns all the triggers in an array
* @returns {Array} Array of all the triggers
*/
function getTriggers(triggers) {

    return (triggers) ? triggers.split(',') : [];

}

/**
* Returns all the triggers in an array
* @param {string} trigger Event to be triggered
* @param {HTMLElement} element Element which fired the trigger
*/
function setTriggers(trigger, element) {

    Events.$trigger(trigger, { data: element });

}

/**
* Checks if given element is in viewport
* @param {HTMLElement} element Element to check if it's in viewport
* @param {Object[]} [options[].offset]
* @param {Number} [options[].offset[].top] Offset in pixels
* @param {Number} [options[].offset[].bottom] Offset in pixels
* @param {Number} [options[].offset[].left] Offset in pixels
* @param {Number} [options[].offset[].right] Offset in pixels
* @param {Number} [options[].threshold] Can be a value between 0 and 1
*/
function elementIsInViewport(element, options) {

    const { top, right, bottom, left, width, height } = element.getBoundingClientRect();

    const intersection = {
        t: bottom,
        r: window.innerWidth - left,
        b: window.innerHeight - top,
        l: right
    }

    const threshold = {
        x: options.threshold * width,
        y: options.threshold * height
    }

    const inViewDirections = {
        top: intersection.t > (options.offset.top + threshold.y),
        right: intersection.r > (options.offset.right + threshold.x),
        bottom: intersection.b > (options.offset.bottom + threshold.y),
        left: intersection.l > (options.offset.left + threshold.x)
    }

    inViewDirections.any = inViewDirections.top || inViewDirections.right || inViewDirections.bottom || inViewDirections.left;
    inViewDirections.all = inViewDirections.top && inViewDirections.right && inViewDirections.bottom && inViewDirections.left;

    return inViewDirections;

}

export default new InView();
