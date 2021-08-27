import Form from '@components/form'

/**
 * {Class} ExampleForm
 * @extends Form
 * Example of how to extend the form component
 *
 */
class ExampleForm extends Form {
  constructor(element) {
    super(element)
  }

  /**
   * Custom submit form success handler
   * - will be called after form is submitted successfully through ajax (see form.js)
   * @param {Object} data - data returned from API call
   */
  afterSubmitFormSuccess = (_data) => {
    // Do something custom after successful form submit
  }
}

export default ExampleForm
