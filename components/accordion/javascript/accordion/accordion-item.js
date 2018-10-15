/**
 * Accordion item class
 * Will be created for each item inside an accordion
 */
import Events from '@utilities/events';

const ACCORDIONOPENCLASS = 'accordion__item--is-active';

class AccordionItem {

    constructor(element) {

        this.item = element;
        this.openAccordion = this.item.className.indexOf(ACCORDIONOPENCLASS) !== -1;
        this.isAnimating = false;

        this.button = this.item.querySelector('[js-hook-accordion-button]');
        this.content = this.item.querySelector('[js-hook-accordion-content]');

        this.id = this.content.id;

    }

    set openAccordion(boolean) {

        this.isOpenAccordion = boolean;

    }

    get openAccordion() {

        return this.isOpenAccordion;

    }

    /**
     * Toggles the accordion item
     */
    toggle() {

        if (this.openAccordion) {
            this.close();
        } else {
            this.open();
        }

    }

    /**
     * Opens the accordion item
     */
    open() {

        if (this.openAccordion || this.isAnimating) { return; }
        this.openAccordion = true;
        this.triggerAnimatingEvent(true);

        this.item.classList.add(ACCORDIONOPENCLASS);

        this.setHeight();
        this.setAriaState();

    }

    /**
     * Closes the accordion item
     */
    close() {

        if (!this.openAccordion || this.isAnimating) { return; }
        this.openAccordion = false;
        this.triggerAnimatingEvent(true);

        this.item.classList.remove(ACCORDIONOPENCLASS);

        this.setHeight();
        this.setAriaState();

    }

    /**
     * Sets correct aria-* values
     */
    setAriaState() {

        this.button.setAttribute('aria-expanded', this.openAccordion);
        this.content.setAttribute('aria-hidden', !this.openAccordion);

    }

    /**
     * Sets the height based on the this.openAccordion
     */
    setHeight() {

        const height = getElementHeight(this.content);

        this.heightTransitionEvent = e => this.heightTransitionEnd(e);

        this.content.style.height = this.openAccordion ? '0' : height;

        // The line below triggers a repaint and is necessary for the accordion to work.
        // https://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
        this.content.offsetHeight; // eslint-disable-line

        this.content.style.height = this.openAccordion ? height : '0';

        this.content.addEventListener('transitionend', this.heightTransitionEvent, false);

    }

    /**
     * Triggers when transitionend is fired
     * @param {Event} event
     */
    heightTransitionEnd(event) {

        if (event.propertyName === 'height') {

            if (this.openAccordion) {
                this.content.style.height = 'auto';
            }

            this.content.removeEventListener('transitionend', this.heightTransitionEvent, false);
            this.triggerAnimatingEvent(false);

            Events.$trigger(`accordion::${this.openAccordion ? 'opened' : 'closed'}`, {
                data: {
                    element: this.item,
                    id: this.id
                }
            });

            Events.$trigger(`accordion[${this.id}]::${this.openAccordion ? `opened` : `closed`}`);

        }

    }

    /**
     * Triggers the animating event for the accordion holder
     * @param {Boolean} bool
     */
    triggerAnimatingEvent(bool) {

        this.isAnimating = bool;
        Events.$trigger(`accordion[${this.id}]::animating`, {
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
    const el = element;
    const old = {};
    old.height = el.style.height;
    old.visibility = el.style.visibility;

    el.style.height = 'auto';
    el.style.visibility = 'visible';

    const { height } = el.getBoundingClientRect();

    el.style.height = old.height;
    el.style.visibility = old.visibility;

    return `${height}px`;

}

export default AccordionItem;
