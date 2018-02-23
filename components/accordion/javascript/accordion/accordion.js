import 'core-js/fn/array/from';

import Events from '../util/events';
import AccordionItem from './accordion-item';

const ACCORDION_ITEM_HOOK = '[js-hook-accordion-item]';

class Accordion {

    constructor(element) {

        this.element = element;
        this.items = this.element.querySelectorAll(ACCORDION_ITEM_HOOK);

        if (!this.items) { return; }

        this.autoClose = this.element.dataset.autoclose === 'false' ? false : true;
        this.accordionItems = {};
        this._initItems();
        this._bindEvents();

    }

    /**
     * Bind all events
     */
    _bindEvents() {

        Events.$on(`accordion::animating`, (event, data) => {
            if (this.accordionItems[data.id]) {
                this.isAnimating = data.animating;
            }
        });

        Events.$on(`accordion::toggle`, (event, id) => {
            if (id && this.accordionItems[id] && !this.isAnimating) {
                this._closeAllChildren(id);
                this.accordionItems[id].toggle();
            }
        });

        Events.$on(`accordion::open`, (event, id) => {
            if (id && this.accordionItems[id] && !this.isAnimating) {
                this._closeAllChildren(id);
                this.accordionItems[id].open();
            }
        });

        Events.$on(`accordion::close`, (event, id) => {
            if (id) {
                if (this.accordionItems[id] && !this.isAnimating) {
                    this.accordionItems[id].close();
                }
            } else {
                if (!this.isAnimating) {
                    Object.keys(this.accordionItems).forEach(i => {
                        this.accordionItems[i].close();
                    });
                }
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

        });

    }

    /**
     * Get height of given element
     * @param {String} skipId Identifier which should be skipped
     */
    _closeAllChildren(skipId) {

        if (!this.autoClose) { return; }

        Object.keys(this.accordionItems).forEach(id => {
            if (skipId === id) { return; }
            this.accordionItems[id].close();
        });

    }

}

export default Accordion;
