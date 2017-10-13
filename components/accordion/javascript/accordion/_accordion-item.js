/**
 * Accordion item class
 * Will be created for each item inside an accordion
 */
import Events from '../util/events';

const ACCORDION_OPEN_CLASS = 'accordion__item--is-active';

class AccordionItem {

    constructor(element) {

        this.item = element;
        this.isOpen = this.item.className.indexOf(ACCORDION_OPEN_CLASS) !== -1;
        this.isAnimating = false;

        this.button = this.item.querySelector('[js-hook-accordion-button]');
        this.content = this.item.querySelector('[js-hook-accordion-content]');

        this.id = this.content.id;

    }

    /**
     * Toggles the accordion item
     */
    toggle() {

        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }

    }

    /**
     * Opens the accordion item
     */
    open() {

        if (this.isOpen || this.isAnimating) { return; }
        this.isOpen = true;
        this._triggerAnimatingEvent(true);

        this.item.classList.add(ACCORDION_OPEN_CLASS);

        this._setHeight();
        this._setAriaState();

    }

    /**
     * Closes the accordion item
     */
    close() {

        if (!this.isOpen || this.isAnimating) { return; }
        this.isOpen = false;
        this._triggerAnimatingEvent(true);

        this.item.classList.remove(ACCORDION_OPEN_CLASS);

        this._setHeight();
        this._setAriaState();

    }

    /**
     * Sets correct aria-* values
     */
    _setAriaState() {

        this.button.setAttribute('aria-expanded', (this.isOpen) ? true : false);
        this.content.setAttribute('aria-hidden', (this.isOpen) ? false : true);

    }

    /**
     * Sets the height based on the this.isOpen
     */
    _setHeight() {

        const height = getElementHeight(this.content);

        this.heightTransitionEvent = e => this._heightTransitionEnd(e);

        this.content.style.height = (this.isOpen) ? '0' : height;
        this.content.offsetHeight;
        this.content.style.height = (this.isOpen) ? height : '0';

        this.content.addEventListener('transitionend', this.heightTransitionEvent, false);

    }

    /**
     * Triggers when transitionend is fired
     * @param {Event} event
     */
    _heightTransitionEnd(event) {

        if (event.propertyName == 'height') {

            if (this.isOpen) {
                this.content.style.height = 'auto';
            }

            this.content.removeEventListener('transitionend', this.heightTransitionEvent, false);
            this._triggerAnimatingEvent(false);

            Events.$trigger(`accordion::${(this.isOpen) ? 'opened' : 'closed'}`, {
                data: {
                    element: this.item,
                    id: this.id
                }
            });

            Events.$trigger(`accordion::${(this.isOpen) ? `opened(${this.id})` : `closed(${this.id})`}`);

        }

    }

    /**
     * Triggers the animating event for the accordion holder
     * @param {Boolean} bool
     */
    _triggerAnimatingEvent(bool) {

        this.isAnimating = bool;
        Events.$trigger('accordion::animating', {
            data: {
                id: this.id,
                animating: this.isAnimating
            }
        });

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

export default AccordionItem;
