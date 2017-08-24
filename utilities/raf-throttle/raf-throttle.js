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
    * @param {string} bind[].event Event type we are binding ie. scroll
    * @param {string} bind[].namespace Namepace of the event
    * @param {Function} bind[].fn Function we want to execute
    */
    set(binds) {

        this._addEvents(binds);

    }

    /**
    * Public function to remove an assigned bind
    * @param {Array[]} binds
    * @param {Object[]} bind
    * @param {HTMLElement} bind[].element Element to unbind ie. document or window
    * @param {string} bind[].event Event type we are binding ie. scroll
    * @param {string} bind[].namespace Namepace of the event
    */
    remove(binds) {

        if (binds) {
            this._removeEvents(binds);
        }

    }

    /*
    * Private methods
    */

    /**
    * Loop over binds and bind them
    * @param {Array[]} binds
    * @param {Object[]} bind
    * @param {HTMLElement} bind[].element Element we are binding to ie. document or window
    * @param {string} bind[].event Event type we are binding ie. scroll
    * @param {string} bind[].namespace Namepace of the event
    * @param {Function} bind[].fn Function we want to execute
    * @param {Number} [bind[].delay] Amount of delay
    */
    _addEvents(binds) {

        binds.forEach(bind => this._on(bind.element, bind.event, generateNamespace(bind.event, bind.namespace), event => this._trigger(bind, event), { passive: true }));

    }

    /**
    * Loop over binds and remove them
    * @param {Array[]} binds
    * @param {Object[]} bind
    * @param {HTMLElement} bind[].element Element to unbind ie. document or window
    * @param {string} bind[].event Event type we are binding ie. scroll
    * @param {string} bind[].namespace Namepace of the event
    */
    _removeEvents(binds) {

        binds.forEach(bind => this._off(bind.element, bind.event, generateNamespace(bind.event, bind.namespace)));

    }

    /**
    * Append requestAnimationFrame before firing event
    * @param {Object[]} bind
    * @param {HTMLElement} bind[].element Element we are binding to ie. document or window
    * @param {string} bind[].event Event type we are binding ie. scroll
    * @param {string} bind[].namespace Namepace of the event
    * @param {Function} bind[].fn Function we want to execute
    * @param {Event} event Event object
    * @param {Number} [bind[].delay] Amount of delay
    */
    _trigger(bind, event) {

        const eventNamespace = generateNamespace(bind.event, bind.namespace);

        if (bind.delay && bind.delay !== 0) {

            if (!this.timeoutList[eventNamespace]) {
                this.timeoutList[eventNamespace] = {};
            }

            if (this.timeoutList[eventNamespace].timeoutTimestamp + bind.delay > Date.now()) {

                clearTimeout(this.timeoutList[eventNamespace].timeout);

            }

            this.timeoutList[eventNamespace].timeout = setTimeout(() => {

                raf(() => {

                    this.timeoutList[eventNamespace].timeoutTimestamp = Date.now();

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
    * @param {string} event Event type we are binding ie. scroll
    * @param {string} namespace Namepace of the event
    * @callback {Function}
    * @param {object} [options] Give options to your event
    */
    _on(element, event, namespace, callback, options) {

        if (!this.namespaces) {
            this.namespaces = {};
        }

        this.namespaces[namespace] = callback;
        options = options || false;

        element.addEventListener(event, callback, options);

    }

    /**
    * Remove a namespaced eventlistener to given element
    * @param {HTMLElement} element
    * @param {string} event Event type we are removing ie. scroll
    * @param {string} namespace Namepace of the event we are removing
    */
    _off(element, event, namespace) {

        element.removeEventListener(event, this.namespaces[namespace]);
        delete this.namespaces[namespace];

    }

}

function generateNamespace(eventName, namespace) {

    return `${eventName}.${namespace}`;

}

export default new RafThrottle();
