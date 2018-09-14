const LAP_ACTIVE = 'form__item--lap-active';
const INPUT_QUERY = 'input, textarea';
const FORM_ITEM = '.form__item';

class LabelAsPlaceholder {

    constructor(element) {

        this.input = element.querySelector(INPUT_QUERY);
        this.formItem = this.input.closest(FORM_ITEM);

        if (this.formItem) {
            this._toggleLabelClass();
            this._bindEvents();
        }

    }

    _bindEvents() {

        this.input.addEventListener('change', () => this._toggleLabelClass());

        if (this.input.type !== 'file') {
            this.input.addEventListener('input', () => this._toggleLabelClass(true));
            this.input.addEventListener('focus', () => this._toggleLabelClass(true));
            this.input.addEventListener('focusout', () => this._toggleLabelClass());
        }

    }

    _toggleLabelClass(forceAnimateLabel) {

        const action = forceAnimateLabel || this.input.value ? 'add' : 'remove';
        this.formItem.classList[action](LAP_ACTIVE);

    }

}

export { LabelAsPlaceholder };
