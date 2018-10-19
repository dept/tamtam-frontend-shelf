import Events from '@utilities/events';
import AccordionItem from './accordion-item';

const ACCORDION_ITEM_HOOK = '[js-hook-accordion-item]';

class Accordion {
    constructor(element) {
        this.element = element;
        this.items = this.element.querySelectorAll(ACCORDION_ITEM_HOOK);

        if (!this.items) {
            return;
        }

        this.autoClose = this.element.dataset.autoclose !== 'false';
        this.accordionItems = {};
        this._initItems();
    }

    /**
     * Bind all accordion specific events
     * @param {HTMLElement} item  | accordion item
     */
    _bindAccordionEvents({ id }) {
        Events.$on(`accordion[${id}]::close`, () => {
            if (id) {
                if (this.accordionItems[id] && !this.isAnimating) {
                    this.accordionItems[id].close();
                }
            } else if (!this.isAnimating) {
                Object.keys(this.accordionItems).forEach(i => {
                    this.accordionItems[i].close();
                });
            }
        });
        Events.$on(`accordion[${id}]::open`, () => {
            if (id && this.accordionItems[id] && !this.isAnimating) {
                this._closeAllChildren(id);
                this.accordionItems[id].open();
            }
        });

        Events.$on(`accordion[${id}]::toggle`, () => {
            if (id && this.accordionItems[id] && !this.isAnimating) {
                this._closeAllChildren(id);
                this.accordionItems[id].toggle();
            }
        });
        Events.$on(`accordion[${id}]::animating`, (event, data) => {
            if (this.accordionItems[data.id]) {
                this.isAnimating = data.animating;
            }
        });
    }

    /**
     * Iterate over each item inside the accordion
     */
    _initItems() {
        Array.from(this.items).forEach(el => {
            const item = new AccordionItem(el);
            this.accordionItems[item.id] = item;
            this._bindAccordionEvents(this.accordionItems[item.id]);
        });
    }

    /**
     * Get height of given element
     * @param {String} skipId Identifier which should be skipped
     */
    _closeAllChildren(skipId) {
        if (!this.autoClose) {
            return;
        }

        Object.keys(this.accordionItems).forEach(id => {
            if (skipId === id) {
                return;
            }
            this.accordionItems[id].close();
        });
    }
}

export default Accordion;
