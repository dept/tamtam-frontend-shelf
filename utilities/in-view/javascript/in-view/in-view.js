import RafThrottle from '../raf-throttle';
import Events from '../events';

const INVIEW_HOOK = '[js-hook-inview]';
const SCROLL_ELEMENT = window;

class InView {

    constructor() {

        this.elements = getElements();
        this.elementArray = [];
        this.eventsToBeBound = [];
        this.lastEventIndex = 0;

        this._bindEvent();

        Events.$trigger('in-view::update');
        Events.$trigger('scroll');

    }

    /**
     * Bind event
     */
    _bindEvent() {

        Events.$on('in-view::update', () => {

            this._updateElements();
            this._addElements();
            this._bindScrollEvent();
            Events.$trigger('resize');
            Events.$trigger('scroll');

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
     * @param {HTMLElement} element Element to track
     * @param {Object[]} [element[].dataset]
     * @param {Number} [element[].dataset[].inviewOffsetTop] Offset in pixels
     * @param {Number} [element[].dataset[].inviewOffsetBottom] Offset in pixels
     * @param {Number} [element[].dataset[].inviewOffsetLeft] Offset in pixels
     * @param {Number} [element[].dataset[].inviewOffsetRight] Offset in pixels
     * @param {Number} [element[].dataset[].inviewThreshold] Can be a value between 0 and 1
     * @param {string} [element[].dataset[].inviewTrigger] Triggers you want to fire, can be comma seperated
     */
    _setNewElement(element) {

        if (element.elementInViewIdentifier) { return; }

        const index = ++this.lastEventIndex;
        element.elementInViewIdentifier = index;

        const {
            inviewPersistent,
            inviewOffsetTop,
            inviewOffsetBottom,
            inviewOffsetLeft,
            inviewOffsetRight,
            inviewThreshold,
            inviewTrigger
        } = element.dataset;

        const config = {
            index,
            element,
            persistent: (inviewPersistent === 'true') || false,
            offset: {
                top: parseInt(inviewOffsetTop, 10) || 0,
                bottom: parseInt(inviewOffsetBottom, 10) || 0,
                left: parseInt(inviewOffsetLeft, 10) || 0,
                right: parseInt(inviewOffsetRight, 10) || 0
            },
            position: getElementPositions(element),
            threshold: parseFloat(inviewThreshold) || 0,
            triggers: getTriggers(inviewTrigger)
        };

        this.elementArray.push(config);

        this.eventsToBeBound.push(
            {
                element: SCROLL_ELEMENT,
                event: 'scroll',
                namespace: `ElementInView-${config.index}`,
                fn: () => this._elementInView(config)
            }, {
                element: SCROLL_ELEMENT,
                event: 'resize',
                namespace: `ElementRecalculatePositions-${config.index}`,
                fn: () => this._reCalculateElementPositions(config)
            }
        );

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
        element._inViewport = elementIsInViewport(config);

        if (config.persistent) {
            config.triggers.forEach((trigger) => setTriggers(trigger, element));
        }

        if (element._inViewport.scrolledPastTop && !element._hasBeenInViewport) {

            element.classList.remove('is--out-view');

            if (!config.persistent) {

                config.triggers.forEach((trigger) => setTriggers(trigger, element));

                RafThrottle.remove([{
                    element: SCROLL_ELEMENT,
                    event: 'scroll',
                    namespace: `ElementInView-${config.index}`
                }]);

                element._hasBeenInViewport = true;

            }

        } else {

            if (element.className.indexOf('is--out-view') !== -1) {
                return;
            }

            element.classList.add('is--out-view');

        }

    }

    /**
     * Adds all elements to inview tracking
     */
    _addElements() {

        Object.keys(this.elements).forEach(index => {
            if (typeof this.elements[index] === 'object') {
                this._setNewElement(this.elements[index]);
            }
        });

    }

    /**
     * Empties current events and gets new elements
     */
    _updateElements() {

        this.eventsToBeBound = [];
        this.elements = getElements();

    }

    _reCalculateElementPositions(config) {

        config.position = getElementPositions(config.element);

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
 * @param {HTMLElement} options[].element Element to check if it's in viewport
 * @param {Object[]} [options[].position]
 * @param {Number} [options[].position[].top] Position in pixels
 * @param {Number} [options[].position[].bottom] Position in pixels
 * @param {Number} [options[].position[].left] Position in pixels
 * @param {Number} [options[].position[].right] Position in pixels
 * @param {Object[]} [options[].offset]
 * @param {Number} [options[].offset[].top] Offset in pixels
 * @param {Number} [options[].offset[].bottom] Offset in pixels
 * @param {Number} [options[].offset[].left] Offset in pixels
 * @param {Number} [options[].offset[].right] Offset in pixels
 * @param {Number} [options[].threshold] Can be a value between 0 and 1
 */
function elementIsInViewport(options) {

    const scrollTop = SCROLL_ELEMENT.pageYOffset || SCROLL_ELEMENT.scrollTop || document.documentElement.scrollTop;
    const scrollLeft = SCROLL_ELEMENT.pageXOffset || SCROLL_ELEMENT.scrollLeft || document.documentElement.scrollLeft;

    const windowHeight = window.innerHeight;
    const windowWidth = document.body.clientWidth;

    const { position, threshold, offset } = options;

    const intersection = getIntersections({ position, windowHeight, windowWidth, scrollLeft, scrollTop });

    const calculatedThreshold = getThreshold({ threshold, position });

    const inViewDirections = getInViewDirections({ position, intersection, offset, windowHeight, windowWidth, scrollLeft, scrollTop, calculatedThreshold });

    inViewDirections.any = getAnyInViewDirection(inViewDirections);
    inViewDirections.all = getAllInViewDirection(inViewDirections);

    return inViewDirections;

}

/**
 * Returns the offsets and measurements of given element
 * @param {HTMLElement} element
 * @returns {Object} Object with all element measurements and offsets
 */
function getElementPositions(element) {

    const { width, height } = element.getBoundingClientRect();

    const { top, left } = getElementOffset(element);

    return {
        top: top,
        left: left,
        right: left + width,
        bottom: top + height,
        width,
        height
    };

}

/**
 * Returns the offsetTop and offsetLeft of given element
 * @param {HTMLElement} element
 * @returns {Object} Object of top and left position
 */
function getElementOffset(element) {

    const elementStyles = window.getComputedStyle(element);

    const margin = {};
    margin.top = parseInt(elementStyles.marginTop / 2) || 0;
    margin.right = parseInt(elementStyles.marginRight / 2) || 0;
    margin.bottom = parseInt(elementStyles.marginBottom / 2) || 0;
    margin.left = parseInt(elementStyles.marginLeft / 2) || 0;

    let top = 0 + margin.top + margin.bottom;
    let left = 0 + margin.left + margin.right;

    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top: top,
        left: left
    };
}

/**
 * Check if any direction is in view
 * @param {Object} directions
 * @returns {Boolean} match
 */
function getAnyInViewDirection(directions) {
    return directions.top || directions.right || directions.bottom || directions.left;
}

/**
 * Check if all directions are in view
 * @param {Object} directions
 * @returns {Boolean} match
 */
function getAllInViewDirection(directions) {
    return directions.top && directions.right && directions.bottom && directions.left;
}

/**
 * Get matching in view directions
 * @param {Object} options
 * @returns {Object} matches
 */
function getInViewDirections(options) {

    const topPosition = options.offset.top + options.calculatedThreshold.y - options.intersection.t;
    const top = {};
    top.scrolledPastViewport = topPosition > -options.windowHeight;
    top.elementInView = topPosition <= 0 && topPosition >= -options.windowHeight;

    const rightPosition = options.offset.right + options.calculatedThreshold.y - options.intersection.r;
    const right = {};
    right.scrolledPastViewport = rightPosition >= -options.windowWidth;
    right.elementInView = rightPosition >= 0 && rightPosition <= options.windowWidth;

    const bottomPosition = options.offset.bottom + options.calculatedThreshold.y - options.intersection.b;
    const bottom = {};
    bottom.scrolledPastViewport = bottomPosition <= options.windowHeight;
    bottom.elementInView = bottomPosition >= 0 && bottomPosition >= -options.windowHeight;

    const leftPosition = options.offset.left + options.calculatedThreshold.y - options.intersection.r;
    const left = {};
    left.scrolledPastViewport = leftPosition >= - options.windowWidth;
    left.elementInView = leftPosition <= 0 && leftPosition >= -options.windowWidth;

    return {
        position: {
            top: topPosition,
            right: rightPosition,
            bottom: bottomPosition,
            left: leftPosition,
        },
        scrolledPastTop: top.scrolledPastViewport,
        scrolledPastRight: right.scrolledPastViewport,
        scrolledPastBottom: bottom.scrolledPastViewport,
        scrolledPastLeft: left.scrolledPastViewport,
        top: top.scrolledPastViewport && top.elementInView,
        right: right.scrolledPastViewport && right.elementInView,
        bottom: bottom.scrolledPastViewport && bottom.elementInView,
        left: left.scrolledPastViewport && left.elementInView,
        windowHeight: options.windowHeight
    }
}

/**
 * Get in view intersections
 * @param {Object} options
 * @returns {Object} matches
 */
function getIntersections(options) {

    return {
        t: options.position.top - options.scrollTop,
        r: parseInt(options.position.left.toFixed(0)) - options.scrollLeft,
        b: options.position.bottom - options.scrollTop - options.windowHeight,
        l: parseInt(options.position.right.toFixed(0)) - options.scrollLeft - options.windowWidth
    }
}

/**
 * Get the element threshold in pixels
 * @param {Object} options
 * @returns {Object} treshold
 */
function getThreshold(options) {
    return {
        x: options.threshold * options.position.width,
        y: options.threshold * options.position.height
    }
}

export default new InView();
