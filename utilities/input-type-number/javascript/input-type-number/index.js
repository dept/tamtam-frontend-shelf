/**
 * Cleanse input type="number" fields from anything other than numerals.
 */
class NumberInput {
    constructor(element) {
        this.element = element;
        this.bindEvents();
    }

    /**
     * Catch non-numeric values and prevent them
     * @param event - keypress event
     * @returns {boolean} - true/false based on numeric value regex match
     */
    static preventNonNumericValue(event) {
        const key = event.key || event.keyCode;
        if (!/^[0-9]$/i.test(key)) event.preventDefault();
    }

    /**
     * Catches paste event, strips non-numeric values and sets the value of the input field.
     * Triggers change event programmatically
     * @param event - paste event
     */
    stripNonNumericValue(event) {
        event.preventDefault();

        let pastedText;

        if (event.clipboardData && event.clipboardData.getData) {
            // Standards Compliant FIRST!
            pastedText = event.clipboardData.getData('text/plain');
        } else if (window.clipboardData && window.clipboardData.getData) {
            // IE
            pastedText = window.clipboardData.getData('Text');
        }

        this.element.value = pastedText.replace(/\D/, '');

        const changeEvent = new Event('change');
        this.element.dispatchEvent(changeEvent);
    }

    /**
     * Bind all events
     */
    bindEvents() {
        this.element.addEventListener('keypress', event =>
            NumberInput.preventNonNumericValue(event)
        );

        this.element.addEventListener('paste', event =>
            this.stripNonNumericValue(event)
        );
    }
}

export default NumberInput;
