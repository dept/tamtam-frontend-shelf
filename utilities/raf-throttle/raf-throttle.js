/**
 * @shelf-version: 1.0.0
 */

import raf from 'raf';

class RafThrottle {

    constructor() {

        this.timeoutList = {};

    }

    /**
    * Public function to set the assigned binds
    * @param {Array[]} binds
    * @param {Object[]} bind
    * @param {HTMLElement} bind[].element Element we are binding to ie. document or window
    * @param {string} bind[].event Event we are binding with given namespace ie. scroll.namespace
    * @param {Function} bind[].fn Function we want to execute
    */
    set(binds) {

        addEvents(binds);

    }

    /**
    * Public function to remove an assigned bind
    * @param {Array[]} binds
    * @param {Object[]} bind
    * @param {HTMLElement} bind[].element Element to unbind ie. document or window
    * @param {string} bind[].event Event we want to remove with namespace ie. scroll.namespace
    */
    remove(binds) {

        if (binds) {
            removeEvents(binds);
        }

    }

}

const _RafThrottle = new RafThrottle();


/*
 * Private methods
 */


/**
* Loop over binds and bind them
* @param {Array[]} binds
* @param {Object[]} bind
* @param {HTMLElement} bind[].element Element we are binding to ie. document or window
* @param {string} bind[].event Event we are binding with given namespace ie. scroll.namespace
* @param {Function} bind[].fn Function we want to execute
* @param {Number} [bind[].delay] Amount of delay
*/
function addEvents(binds) {

    binds.forEach(bind => on(bind.element, bind.event, event => trigger(bind, event), { passive: true }));

}

/**
* Loop over binds and remove them
* @param {Array[]} binds
* @param {Object[]} bind
* @param {HTMLElement} bind[].element Element to unbind ie. document or window
* @param {string} bind[].event Event we want to remove with namespace ie. scroll.namespace
*/
function removeEvents(binds) {

    binds.forEach(bind => off(bind.element, bind.event));

}

/**
* Append requestAnimationFrame before firing event
* @param {Object[]} bind
* @param {HTMLElement} bind[].element Element we are binding to ie. document or window
* @param {string} bind[].event Event we are binding with given namespace ie. scroll.namespace
* @param {Function} bind[].fn Function we want to execute
* @param {Event} event Event object
* @param {Number} [bind[].delay] Amount of delay
*/
function trigger(bind, event) {

    if (bind.delay && bind.delay !== 0) {

        if (!_RafThrottle.timeoutList[bind.event]) {
            _RafThrottle.timeoutList[bind.event] = {};
        }

        if (_RafThrottle.timeoutList[bind.event].timeoutTimestamp + bind.delay > Date.now()) {

            clearTimeout(_RafThrottle.timeoutList[bind.event].timeout);

        }

        _RafThrottle.timeoutList[bind.event].timeout = setTimeout(() => {

            raf(() => {

                _RafThrottle.timeoutList[bind.event].timeoutTimestamp = Date.now();

                bind.fn(event);

            });

        }, bind.delay || 0);

    } else {

        raf(() => bind.fn(event));

    }

}

/**
* Bind a namespaced eventlistener to given element
* @param {HTMLElement} element
* @param {Event} event Event we are binding with given namespace ie. scroll.namespace
* @callback {Function}
* @param {object} [options] Give options to your event
*/
function on(element, event, callback, options) {

    if (!_RafThrottle.namespaces) {
        _RafThrottle.namespaces = {};
    }

    _RafThrottle.namespaces[event] = callback;
    options = options || false;

    element.addEventListener(event.split('.')[0], callback, options);
    return _RafThrottle;

}

/**
* Remove a namespaced eventlistener to given element
* @param {HTMLElement} element
* @param {Event} event Event we are binding with given namespace ie. scroll.namespace
*/
function off(element, event) {

    element.removeEventListener(event.split('.')[0], _RafThrottle.namespaces[event]);
    delete _RafThrottle.namespaces[event];
    return this;

}

export default _RafThrottle;
