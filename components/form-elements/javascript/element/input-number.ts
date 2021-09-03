/**
 * Cleanse input type="number" fields from anything other than numerals.
 */
class NumberInput {
  element: HTMLInputElement

  constructor(element: HTMLInputElement) {
    this.element = element
    this.bindEvents()
  }

  /**
   * Catch non-numeric values and prevent them
   * @param event - keypress event
   */
  static preventNonNumericValue(event: KeyboardEvent) {
    if (!/^[0-9]$/i.test(event.key)) event.preventDefault()
  }

  /**
   * Catches paste event, strips non-numeric values and sets the value of the input field.
   * Triggers change event programmatically
   * @param event - paste event
   */
  stripNonNumericValue(event: ClipboardEvent) {
    event.preventDefault()

    const pastedText = event.clipboardData?.getData('text/plain')

    this.element.value = pastedText?.replace(/\D/, '') || ''

    const changeEvent = new Event('change')
    this.element.dispatchEvent(changeEvent)
  }

  /**
   * Bind all events
   */
  bindEvents() {
    this.element.addEventListener('keypress', event => NumberInput.preventNonNumericValue(event))
    this.element.addEventListener('paste', event => this.stripNonNumericValue(event))
  }
}

export default NumberInput
