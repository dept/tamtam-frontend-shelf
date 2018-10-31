/**
 * Accordion item class
 * Will be created for each item inside an accordion
 */
import Events from '@utilities/events';

const ACCORDION_OPEN_CLASS = 'accordion__item--is-active';
const ACCORDION_ANIMATING_CLASS = 'accordion__item--is-animating';

class AccordionItem {
    constructor(element) {
        this.item = element;
        this.isOpen = this.item.className.indexOf(ACCORDION_OPEN_CLASS) !== -1;
        this.isAnimating = false;

        this.button = this.item.querySelector('[js-hook-accordion-button]');
        this.content = this.item.querySelector('[js-hook-accordion-content]');

        this.id = this.content.id;

        if (this.isOpen) {
            AccordionItem.setTabIndex(this.item, 0);
        } else {
            AccordionItem.setTabIndex(this.item, -1);
        }
    }

    set isOpen(boolean) {
        this._isOpen = boolean;
    }

    get isOpen() {
        return this._isOpen;
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
        if (this.isOpen || this.isAnimating) {
            return;
        }
        this.isOpen = true;
        this._triggerAnimatingEvent(true);

        this.item.classList.add(ACCORDION_OPEN_CLASS);

        this._setHeight();
        this._setAriaState();

        AccordionItem.setTabIndex(this.item, 0);
    }

    /**
     * Closes the accordion item
     */
    close() {
        if (!this.isOpen || this.isAnimating) {
            return;
        }
        this.isOpen = false;
        this._triggerAnimatingEvent(true);

        this.item.classList.remove(ACCORDION_OPEN_CLASS);

        this._setHeight();
        this._setAriaState();

        AccordionItem.setTabIndex(this.item, -1);
    }

    /**
     * Sets correct aria-* values
     */
    _setAriaState() {
        this.button.setAttribute('aria-expanded', this.isOpen);
        this.content.setAttribute('aria-hidden', !this.isOpen);
    }

    /**
     * Sets the height based on the this.isOpen
     */
    _setHeight() {
        const height = getElementHeight(this.content);

        this.heightTransitionEvent = e => this._heightTransitionEnd(e);

        this.content.style.height = this.isOpen ? '0' : height;

        // The line below triggers a repaint and is necessary for the accordion to work.
        // https://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
        this.content.offsetHeight; // eslint-disable-line

        this.content.style.height = this.isOpen ? height : '0';

        this.content.addEventListener('transitionend', this.heightTransitionEvent, false);
    }

    /**
     * Triggers when transitionend is fired
     * @param {Event} event
     */
    _heightTransitionEnd(event) {
        if (event.propertyName === 'height') {
            if (this.isOpen) {
                this.content.style.height = 'auto';
            }

            this.content.removeEventListener('transitionend', this.heightTransitionEvent, false);
            this._triggerAnimatingEvent(false);

            Events.$trigger(`accordion::${this.isOpen ? 'opened' : 'closed'}`, {
                data: {
                    element: this.item,
                    id: this.id,
                },
            });

            Events.$trigger(`accordion[${this.id}]::${this.isOpen ? `opened` : `closed`}`);
        }
    }

    /**
     * Triggers the animating event for the accordion holder
     * @param {Boolean} bool
     */
    _triggerAnimatingEvent(bool) {
        this.isAnimating = bool;

        if (this.isAnimating) {
            this.item.classList.add(ACCORDION_ANIMATING_CLASS);
        } else {
            this.item.classList.remove(ACCORDION_ANIMATING_CLASS);
        }

        Events.$trigger(`accordion[${this.id}]::animating`, {
            data: {
                id: this.id,
                animating: this.isAnimating,
            },
        });
    }

    static setTabIndex(accordionItem, value) {
        [...accordionItem.querySelectorAll('a, area, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not([js-hook-accordion-button]), iframe, video')].forEach(element => {
            element.tabIndex = value;
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
