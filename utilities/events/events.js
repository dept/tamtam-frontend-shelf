/**
 * @shelf-version: 1.0.0
 * Events utility
 */
const eventEl = document.querySelector('html');

class Events {

    get logging() {
        return this._logging;
    }

    set logging(boolean) {
        this._logging = boolean;
    }

    constructor() {

        polyfillCustomEvent();

        this._logging = false;
        readAndBindEventsFromDOM();

    }

    $on(event, callback) {

        if (this.logging) { console.log('Listening to event', '--- Name:', event, '--- Callback:', callback); }

        eventEl.addEventListener(event, ev => {
            callback(ev, extractPropFromObject(ev.detail, 'data'), extractPropFromObject(ev.detail, 'currentTarget'));
        });

    }

    $trigger(event, data, currentTarget) {

        if (this.logging) { console.log('Event triggered', '--- Name:', event, '--- Params:', data, '--- currentTarget', currentTarget); }

        let _data = currentTarget ? {currentTarget, data} : data;
        const _event = new CustomEvent(event, { detail: _data });

        eventEl.dispatchEvent(_event);

    }

}

const _Events = new Events();

/*
 * Private methods
 */

/**
 * Parse DOM and scan for attributes starting with on:
 * These are than passed to bindEvent.
 */
function readAndBindEventsFromDOM() {

    // Elements that have attributes starting with on:
    const elements = _domFind(eventEl, element => {
        return element.attributes && [].slice.call(element.attributes).some(attr => attr.nodeName.substr(0, 3) === 'on:');
    });

    elements.map((el) => {
        const attrs = [].slice.call(el.attributes);
        attrs
        // Filter attributes (so not elements this time) starting with on:
            .filter((attr) => attr.name.slice(0, 3) === 'on:')
            // Listen to the native event.
            .map((attr) => bindEvent(attr.ownerElement, attr.name, attr.value));
    });

}

/**
 * Bind events
 * @param targetEl
 * @param attrName  - data attribute name, eg. on:click.prevent
 * @param attrValue - value of the data attribute, eg. on:click.prevent="eventname" -> where attrValue is eventname.
 */
function bindEvent(targetEl, attrName, attrValue) {

    // Split on dot and colon.
    const attrs = attrName.split(/on:|\./);
    const nativeEvent = attrs[1];
    const modifiers = attrs.splice(1);
    const [eventToTrigger, eventData] = parseEventString(attrValue);

    // Filters out only the clicked element, based on event attribute.
    const delegateFilter = el => el === targetEl;

    eventEl.addEventListener(nativeEvent, _delegate(delegateFilter, (e) => {
        runModifiers(modifiers, e);
        _Events.$trigger(eventToTrigger, eventData, targetEl);
    }));

}

/**
 * Map over modifiers and modify event with prevent or stop.
 * @param modifiers
 * @param e
 */
function runModifiers(modifiers, e) {

    modifiers.map((modifier) => {
        if (modifier === 'prevent' || modifier === 'preventDefault') {
            e.preventDefault();
        }
        if (modifier === 'stop' || modifier === 'stopPropagation') {
            e.stopPropagation();
        }
    });

}

/**
 * Event string is attrValue, which can be either only an event name, or an event name with params:
 * eventname or eventname(value).
 * Regex splits this string in an array with two params; the eventname and the value passed (if given).
 * @param eventString
 * @returns {[*,*]}
 */
function parseEventString(eventString) {

    const eventStringSplitted = eventString.split(new RegExp((/\(|\)/g)));
    return [eventStringSplitted[0], eventStringSplitted[1]];

}

/* DOM and Event helpers */
/**
 * Event delegation. Bind clicks on parent, for live elements,
 * on event traverse up the DOM to find the clicked parent if present.
 * @param criteria - Criteria function which matches the requested target
 * @param callback - Callback to execute on event.
 * @returns {Function}
 */
function _delegate(criteria, callback) {

    return function (e) {
        let el = e.target;
        if (criteria(el)) {
            callback.apply(this, arguments);
        }
        while ((el = el.parentNode)) {
            if (!criteria(el)) { continue; }
            e.delegateTarget = el;
            callback.apply(this, arguments);
            return;
        }
    };

}

/**
 * Treewalker to match elements based on a function
 * @param element   - Parent element (eg document) to bind event on.
 * @param predicate - Function expected to return a boolean if an element matches.
 * @param results
 * @returns {Array}
 */
function _domFind(element, predicate, results = []) {

    if (!element.children) {
        return results;
    }
    if (predicate(element)) {
        results.push(element);
    }
    if (element.children && element.children.length) {
        [].slice.call(element.children).map(child => {
            _domFind(child, predicate, results);
        });
    }
    return results;

}

/**
 * Extracts and returns specific properties from an given object
 * @param object   - Object to pick from
 * @param propName - Property name to return
 * @returns {Object}
 */
function extractPropFromObject(object, propName) {
    return (object && object[propName]) ? object[propName] : null;
}

/**
 * Polyfill for customEvent
 */
function polyfillCustomEvent() {

    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;

}

export default _Events;
