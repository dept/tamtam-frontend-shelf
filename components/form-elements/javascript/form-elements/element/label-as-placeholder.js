const LAP_ACTIVE = 'form__item--lap-active';
const INPUT_CLASS = 'input, textarea';

class LabelAsPlaceholder {

    constructor(element) {

        this.element = element;
        this.input = this.element.querySelector(INPUT_CLASS);

        this.formItem = this.input.closest('.form__item');

        this._handleInput();

        this._bindEvents();
    }

    _bindEvents() {

        this.input.addEventListener('change', () => this._handleChange());

        if (this.input.type != 'file') {
            this.input.addEventListener('input', () => this._handleInput());
            this.input.addEventListener('focus', () => this._addLabelClass());
            this.input.addEventListener('focusout', () => this._removeLabelClass());
        }
    }

    _handleChange() {
        if (this.input.value) {
            this._addLabelClass();
        } else {
            this._removeLabelClass();
        }

    }

    _handleInput() {

        if (this.input.value) {
            this._addLabelClass();
        }

    }

    _addLabelClass() {

        this.formItem.classList.add(LAP_ACTIVE);

    }

    _removeLabelClass() {

        if (!this.input.value) {
            this.formItem.classList.remove(LAP_ACTIVE);
        }

    }

}

export { LabelAsPlaceholder };
