import RafThrottle from '@utilities/raf-throttle';
import Events from '@utilities/events';
import Api from '@utilities/api';

const HOOK_AUTOCOMPLETE = 'js-hook-autocomplete';
const HOOK_INPUT_LIST = '[js-hook-autocomplete-list]';
const INPUT_VALUE_ID = 'data-value-id';
const INPUT_ACTIVE_CLASS = 'is--active';
const ITEM_ACTIVE_CLASS = 'is--active';

class Autocomplete {

  constructor(element) {

    this.element = element;
    this.list = this.element.querySelector(HOOK_INPUT_LIST);
    this.type = this.element.getAttribute(HOOK_AUTOCOMPLETE);
    this.input = document.querySelector(`[js-hook-${this.type}]`);
    this.apiUrl = this.input.getAttribute('data-api');

    this.bindEvents();

  }

  bindEvents() {

    this.input.addEventListener('focusout', () => this._closeList());

    this.input.addEventListener('keydown', (e) => this._tryToSubmit(e));

    RafThrottle.set([
      {
        element: this.input,
        event: 'keyup',
        namespace: `autocomplete-key-up-${this.type}`,
        fn: (e) => this._keyUp(e),
        delay: 200
      }
    ]);

  }

  _setFocus() {

    Events.$trigger('autocomplete::focusin');

  }

  _removeFocus() {

    Events.$trigger('autocomplete::focusout');

  }

  _tryToSubmit(e) {

    if (e.which === 13 && this.element.classList.contains(INPUT_ACTIVE_CLASS)) {

      e.preventDefault();
      this._closeList();

    }

  }

  _keyUp(e) {

    const key = window.event ? e.keyCode : e.which;

    switch (key) {
      case 40:
        //arrow down
        this._setListItem('next');
        break;

      case 38:
        //arrow up
        this._setListItem('prev');
        break;

      case 27:
        //esc
        this._closeList();
        break;

      case 13:
        //enter
        break;

      default:

        this._getList(e);

        break;

    }


  }

  _closeList() {

    this._removeFocus();

    this.element.classList.remove(INPUT_ACTIVE_CLASS);

    if(this.input.getAttribute(INPUT_VALUE_ID) === '') this.input.setAttribute(INPUT_VALUE_ID, this.input.value);

    Events.$trigger('autocomplete::selected', {
      type: this.type,
      name: this.input.name,
      value: this.input.value,
      valueId: this.input.getAttribute(INPUT_VALUE_ID)
    });

  }

  _showList() {

    this.element.classList.add(INPUT_ACTIVE_CLASS);

  }

  _setListItem(direction) {

    let totalItems = this.list.childElementCount;

    if (totalItems === 0) return;

    let currentItem = this.list.querySelector(`.${ITEM_ACTIVE_CLASS}`);
    let currentIndex = Array.prototype.indexOf.call(this.list.children, currentItem);
    let nextIndex = (currentIndex + 1 === totalItems) ? totalItems - 1 : currentIndex + 1;
    let prevIndex = (currentIndex - 1 <= 0) ? 0 : currentIndex - 1;

    if (currentItem) currentItem.classList.remove(ITEM_ACTIVE_CLASS);

    if (direction === 'next') {

      this.list.children[nextIndex].classList.add(ITEM_ACTIVE_CLASS);
      this._updateField(this.list.children[nextIndex]);

    } else {

      this.list.children[prevIndex].classList.add(ITEM_ACTIVE_CLASS);
      this._updateField(this.list.children[prevIndex]);

    }

  }

  _getList(e) {

    const target = e.target;
    const value = target.value;

    this.input.setAttribute(INPUT_VALUE_ID, '');

    Api.get(`${this.apiUrl}?query=${ value }`).then(res => this._createList(res.data, value));

  }

  _updateList(items, value) {

    if (items && value !== '') {

      this.list.innerHTML = items;
      this.list.scrollTop = 0;

      this._showList();
      this._setFocus();
      this._bindElementListeners();

    } else {

      this._closeList();

    }

  }

  _createList(data, value) {

    const list = ( data ) ? data.map((item) => `<li class="autocomplete__list-item" data-id="${ item.id }" data-value="${ item.name }">${ item.name }</li>`).join('') : false;

    this._updateList(list, value);

  }

  _updateField(element) {

    this.input.setAttribute(INPUT_VALUE_ID, element.getAttribute('data-id'));
    this.input.value = element.getAttribute('data-value');

  }

  _bindElementListeners() {

    const elements = [...this.list.querySelectorAll('li')];

    elements.map((element) => {

      element.addEventListener('mouseover', (e) => {

        e.currentTarget.classList.add(ITEM_ACTIVE_CLASS);
        this._updateField(e.currentTarget);

      });

      element.addEventListener('mouseout', () => {

        elements.map((item) => {

          item.classList.remove(ITEM_ACTIVE_CLASS);

        });

      });

    });

  }

}

export { Autocomplete };
