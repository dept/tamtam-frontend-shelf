/**
 * @shelf-version: 1.0.0
 */

import 'core-js/fn/array/from';

import Events from './util/events';

const ACCORDEON_ITEM_HOOK = '[js-hook-accordeon-item]';

const ACCORDEON_OPEN_CLASS = 'accordeon__item--is-active';

class Accordeon {

    constructor(element) {

        this.element = element;
        this._autoclose = this.element.dataset.autoclose === 'false' ? false : true;
        this.items = this.element.querySelectorAll(ACCORDEON_ITEM_HOOK);

        if (!this.items) { return; }

        this.itemObject = {};
        this._initItems();
        this._bindEvents();

    }

    /**
     * Bind all events
     */
    _bindEvents() {

        Events.$on(`accordeon::animating`, (event, data) => {
            if (this.itemObject[data.id]) {
                this._isAnimating = data.animating;
            }
        });

        Events.$on(`accordeon::toggle`, (event, id) => {
            if (id && this.itemObject[id] && !this._isAnimating) {
                this._closeAllChildren(id);
                this.itemObject[id].toggle();
            }
        });

        Events.$on(`accordeon::open`, (event, id) => {
            if (id && this.itemObject[id] && !this._isAnimating) {
                this._closeAllChildren(id);
                this.itemObject[id].open();
            }
        });

        Events.$on(`accordeon::close`, (event, id) => {
            if (id && this.itemObject[id] && !this._isAnimating) {
                this.itemObject[id].close();
            }
        });

    }

    /**
     * Iterate over each item inside the accordeon
     */
    _initItems() {

        Array.from(this.items).forEach(el => {

            const item = new AccordeonItem(el);
            this.itemObject[item.id] = item;

        });

    }

    /**
     * Get height of given element
     * @param {String} skipId Identifier which should be skipped
     */
    _closeAllChildren(skipId) {

        if(!this._autoclose) { return; }

        Object.keys(this.itemObject).forEach(id => {
            if (skipId === id) { return; }
            this.itemObject[id].close();
        });

    }

}

/**
 * Accordeon item class
 * Will be created for each item inside an accordeon
 */
class AccordeonItem {

    constructor(element) {

        this.item = element;
        this._openState = this.item.className.indexOf(ACCORDEON_OPEN_CLASS) !== -1;
        this._isAnimating = false;

        this.button = this.item.querySelector('[js-hook-accordeon-button]')
        this.content = this.item.querySelector('[js-hook-accordeon-content]');

        this.id = this.content.id;

    }

    /**
     * Toggles the accordeon item
     */
    toggle() {

        if (this._openState) {
            this.close();
        } else {
            this.open();
        }

    }

    /**
     * Opens the accordeon item
     */
    open() {

        if (this._openState || this._isAnimating) { return; }
        this._openState = true;
        this._triggerAnimatingEvent(true);

        this.item.classList.add(ACCORDEON_OPEN_CLASS);

        this._setHeight();
        this._setAriaState();

    }

    /**
     * Closes the accordeon item
     */
    close() {

        if (!this._openState || this._isAnimating) { return; }
        this._openState = false;
        this._triggerAnimatingEvent(true);

        this.item.classList.remove(ACCORDEON_OPEN_CLASS);

        this._setHeight();
        this._setAriaState();

    }

    /**
     * Sets correct aria-* values
     */
    _setAriaState() {

        this.button.setAttribute('aria-expanded', (this._openState) ? true : false);
        this.content.setAttribute('aria-hidden', (this._openState) ? false : true);

    }

    /**
     * Sets the height based on the this._openState
     */
    _setHeight() {

        const height = getElementHeight(this.content);

        this.heightTransitionEvent = e => this._heightTransitionEnd(e);

        this.content.style.height = (this._openState) ? '0' : height;
        this.content.offsetHeight;
        this.content.style.height = (this._openState) ? height : '0';

        this.content.addEventListener('transitionend', this.heightTransitionEvent, false);

    }

    /**
     * Triggers when transitionend is fired
     * @param {Event} event
     */
    _heightTransitionEnd(event) {

        if (event.propertyName == 'height') {

            if (this._openState) {
                this.content.style.height = 'auto';
            }

            this.content.removeEventListener('transitionend', this.heightTransitionEvent, false);
            this._triggerAnimatingEvent(false);

        }

    }

    /**
     * Triggers the animating event for the accordeon holder
     * @param {Boolean} bool
     */
    _triggerAnimatingEvent(bool) {

        this._isAnimating = bool;
        Events.$trigger('accordeon::animating', { data: { id: this.id, animating: this._isAnimating } });

    }

}

/**
 * Get height of given element
 * @param {HTMLElement} element
 * @returns {String} height in pixels
 */
function getElementHeight(element) {

    const old = {};
    old.height = element.style.height;
    old.visibility = element.style.visibility;

    element.style.height = 'auto';
    element.style.visibility = 'visible';

    const { height } = element.getBoundingClientRect();

    element.style.height = old.height;
    element.style.visibility = old.visibility;

    return `${height}px`;

}


// export the constructor function
export default Accordeon;

