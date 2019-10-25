import Events from '@utilities/events';
import AccordionItem from './accordion-item';

const ACCORDION_ITEM_HOOK = '[js-hook-accordion-item]';

class Accordion {
  constructor(element) {
    this.element = element;
    this.items = [...this.element.querySelectorAll(ACCORDION_ITEM_HOOK)];

    if (!this.items) return;

    this.autoClose = this.element.dataset.autoclose !== 'false';
    this.accordionItems = {};
    this.initItems();
  }

  /**
   * Bind all accordion specific events
   * @param {HTMLElement} item  | accordion item
   */
  bindAccordionEvents({ id }) {
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
        this.closeAllChildren(id);
        this.accordionItems[id].open();
      }
    });

    Events.$on(`accordion[${id}]::toggle`, () => {
      if (id && this.accordionItems[id] && !this.isAnimating) {
        this.closeAllChildren(id);
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
  initItems() {
    this.items.forEach(el => {
      const item = new AccordionItem(el);
      this.accordionItems[item.id] = item;
      this.bindAccordionEvents(this.accordionItems[item.id]);
    });
  }

  /**
   * Get height of given element
   * @param {String} skipId Identifier which should be skipped
   */
  closeAllChildren(skipId) {
    if (!this.autoClose) return;

    Object.keys(this.accordionItems).forEach(id => {
      if (skipId === id) return;
      this.accordionItems[id].close();
    });
  }
}

export default Accordion;
