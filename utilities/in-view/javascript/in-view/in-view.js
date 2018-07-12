import 'intersection-observer';
import Events from '@utilities/events';

const SCROLL_ELEMENT = window;

const OBSERVER_DEFAULT_OFFSET_Y = 0;
const OBSERVER_DEFAULT_OFFSET_X = 0;
const OBSERVER_DEFAULT_THRESHOLD = buildThresholdList();

const INVIEW_JS_HOOK = '[js-hook-inview]';
const INVIEW_TRIGGERS_HOOK = 'data-inview-trigger';
const INVIEW_OUTVIEW_CLASS = 'is--out-view';
const INVIEW_THRESHOLD_HOOK = 'data-inview-thresold';
const INVIEW_PERSISTENT_HOOK = 'data-inview-persistent';

const CONFIG = {
    rootMargin: `${OBSERVER_DEFAULT_OFFSET_Y}px ${OBSERVER_DEFAULT_OFFSET_X}px`,
    threshold: OBSERVER_DEFAULT_THRESHOLD
};

class InView {

    constructor() {

        this.nodes = getNodes();
        this.observer = null;
        this.setObserver();

    }

    setObserver() {

        this.observer = new IntersectionObserver(this.onObserve.bind(this), CONFIG);
        this.bindObservedNodes();

    }

    bindObservedNodes() {

        this.nodes.forEach(node => {

            if (!node.__inviewTriggerHook) { node.__inviewTriggerHook = node.getAttribute(INVIEW_TRIGGERS_HOOK); }
            if (!node.__inviewPersistent) { node.__inviewPersistent = node.getAttribute(INVIEW_PERSISTENT_HOOK) === 'true'; }
            if (!node.__inviewThreshold) { node.__inviewThreshold = node.getAttribute(INVIEW_THRESHOLD_HOOK) ? parseFloat(node.getAttribute(INVIEW_THRESHOLD_HOOK)) || false : false; }
            if (!node.__inviewInitialized) { this.observer.observe(node); }
            if (!node.__inviewInitialized) { node.__inviewInitialized = true; }

        });

    }

    onObserve(entries) {

        entries.forEach(entry => this.whenElementInViewport(entry, this.observer));

    }

    whenElementInViewport(entry, observer) {

        const triggers = entry.target.__inviewTriggerHook;
        const element = entry.target

        element.inviewProperties = calculateInviewProperties(entry);

        if (element.inviewProperties.scrolledPastViewport.bottom) {

            if (!element.__inviewThreshold || element.__inviewThreshold && element.__inviewThreshold >= entry.intersectionRatio) {
                element.classList.remove(INVIEW_OUTVIEW_CLASS);
            }

            triggerEvents(getTriggers(triggers), element);

            if (!element.__inviewPersistent) {
                observer.unobserve(entry.target);
            }

        } else {

            element.classList.add(INVIEW_OUTVIEW_CLASS);

            if (element.__inviewPersistent) {
                triggerEvents(getTriggers(triggers), element);
            }


        }

    }

    addElements(elements, hook) {

        elements.forEach(element => {

            if (element.__inviewInitialized) { return; }

            element.__inviewTriggerHook = hook;
            this.nodes.push(element);

            this.bindObservedNodes();

        });

    }

}

function triggerEvents(triggers, data) {

    triggers.forEach(trigger => {
        Events.$trigger(trigger, { data })
    });

}

function getTriggers(triggers) {

    return (triggers) ? triggers.split(',') : [];

}

function getNodes() {

    return [...document.querySelectorAll(INVIEW_JS_HOOK)];

}

/**
 * Checks if given element is in viewport
 * @param {Object} entry Intersection observer entry
 */
function calculateInviewProperties(entry) {

    const scrollTop = SCROLL_ELEMENT.pageYOffset || SCROLL_ELEMENT.scrollTop || document.documentElement.scrollTop;
    const scrollLeft = SCROLL_ELEMENT.pageXOffset || SCROLL_ELEMENT.scrollLeft || document.documentElement.scrollLeft;

    const { top, bottom, left, right } = getElementOffset(entry);
    const position = { top, bottom, left, right };

    const windowHeight = entry.rootBounds.height;
    const windowWidth = entry.rootBounds.width;

    const inViewDirections = getInViewDirections({
        entry,
        position,
        windowHeight,
        windowWidth,
        scrollTop,
        scrollLeft,
    });

    return inViewDirections;

}

/**
 * Returns the offsetTop and offsetLeft of given element
 * @param {Object} entry
 * @returns {Object} Object of top, bottom, left and right position
 */
function getElementOffset(entry) {

    let targetElement = entry.target;
    const elementStyles = window.getComputedStyle(targetElement);

    const margin = {};
    margin.top = parseInt(elementStyles.marginTop, 10) / 2 || 0;
    margin.right = parseInt(elementStyles.marginRight, 10) / 2 || 0;
    margin.bottom = parseInt(elementStyles.marginBottom, 10) / 2 || 0;
    margin.left = parseInt(elementStyles.marginLeft, 10) / 2 || 0;

    let top = 0 + margin.top + margin.bottom;
    let left = 0 + margin.left + margin.right;

    do {
        top += targetElement.offsetTop || 0;
        left += targetElement.offsetLeft || 0;
        targetElement = targetElement.offsetParent;
    } while (targetElement);

    return {
        top,
        left,
        right: left + entry.boundingClientRect.width,
        bottom: top + entry.boundingClientRect.height
    };
}

/**
 * Get matching in view directions
 * @param {Object} options
 * @returns {Object} matches
 */
function getInViewDirections(options) {

    const { width, height } = options.entry.boundingClientRect;

    const topPosition = options.entry.boundingClientRect.top;
    const bottomPosition = options.entry.boundingClientRect.bottom;
    const leftPosition = options.entry.boundingClientRect.left;
    const rightPosition = options.entry.boundingClientRect.right;

    const scrolledPastViewport = {};

    scrolledPastViewport.top = topPosition + height < 0;
    scrolledPastViewport.bottom = topPosition <= options.windowHeight;
    scrolledPastViewport.right = leftPosition <= options.windowWidth;
    scrolledPastViewport.left = leftPosition <= 0;

    const isInViewport = {
        horizontal: options.entry.isIntersecting && (scrolledPastViewport.left || scrolledPastViewport.right),
        vertical: options.entry.isIntersecting && (scrolledPastViewport.top || scrolledPastViewport.bottom),
    };

    return {
        position: {
            top: topPosition,
            right: rightPosition,
            bottom: bottomPosition,
            left: leftPosition
        },
        scrolledPastViewport,
        isInViewport,
        height,
        width,
        windowHeight: options.windowHeight
    };
}

function buildThresholdList() {

    const numSteps = 1000;
    const thresholds = [];

    for (let i = 1.0; i <= numSteps; i++) {
        const ratio = i / numSteps;
        thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
}

export default new InView();
