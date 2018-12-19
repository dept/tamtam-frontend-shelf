/**
 * Accordion item class
 * Will be created for each item inside an accordion
 */
import Events from '@utilities/events';
import setTabindexOfChildren from '@utilities/set-tabindex-of-children';

const ACCORDION_BUTTON_HOOK = '[js-hook-accordion-button]';
const ACCORDION_CONTENT_HOOK = '[js-hook-accordion-content]';

const ACCORDION_OPEN_CLASS = 'accordion__item--is-active';
const ACCORDION_ANIMATING_CLASS = 'accordion__item--is-animating';

class AccordionItem {

    constructor(element) {

        this.item = element;
        this.isOpen = this.item.classList.contains(ACCORDION_OPEN_CLASS);
        this.isAnimating = false;

        this.button = this.item.querySelector(ACCORDION_BUTTON_HOOK);
        this.content = this.item.querySelector(ACCORDION_CONTENT_HOOK);

        this.id = this.content.id;

        setTabindexOfChildren(this.content, this.isOpen ? 0 : -1);

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

        if (this.isOpen || this.isAnimating) return;

        this.isOpen = true;
        this.triggerAnimatingEvent(true);

        this.item.classList.add(ACCORDIONOPENCLASS);

        this.setHeight();
        this.setAccessibilityState();

        Events.$trigger('scroll-to::scroll', {
            data: {
                target: this.item
            }
        });
    }

    /**
     * Closes the accordion item
     */
    close() {

        if (!this.isOpen || this.isAnimating) return;

        this.isOpen = false;
        this.triggerAnimatingEvent(true);

        this.item.classList.remove(ACCORDIONOPENCLASS);

        this.setHeight();
        this.setAccessibilityState();

    }

    /**
     * Sets correct aria-* values
     */
    setAccessibilityState() {

        this.button.setAttribute('aria-expanded', this.isOpen);
        this.content.setAttribute('aria-hidden', !this.isOpen);
        setTabindexOfChildren(this.content, this.isOpen ? 0 : -1);

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

        if (event.propertyName !== 'height') return;
        if (this.isOpen) this.content.style.height = 'auto';

        this.content.removeEventListener('transitionend', this.heightTransitionEvent, false);
        this.triggerAnimatingEvent(false);

        Events.$trigger(`accordion::${this.isOpen ? 'opened' : 'closed'}`, {
            data: {
                element: this.item,
                id: this.id,
            },
        });

        Events.$trigger(`accordion[${this.id}]::${this.isOpen ? `opened` : `closed`}`);

    }

    /**
     * Triggers the animating event for the accordion holder
     * @param {Boolean} bool
     */
    triggerAnimatingEvent(bool) {

        this.isAnimating = bool;

        if (this.isAnimating) {
            this.item.classList.add(ACCORDION_ANIMATING_CLASS);
        } else {
            this.item.classList.remove(ACCORDION_ANIMATING_CLASS);
        }

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

    const { oldHeight, oldVisibility } = element.style;

    el.style.height = 'auto';
    el.style.visibility = 'visible';

    const { height } = el.getBoundingClientRect();

    element.style.height = oldHeight;
    element.style.visibility = oldVisibility;

    return `${height}px`;

}

export default AccordionItem;
