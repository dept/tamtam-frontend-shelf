import API from '@utilities/api'
import Events from '@utilities/events'
import serializeObject from '@utilities/serialize-object'
import { rules } from '@utilities/validation'

const JS_HOOK_DEFAULT_SUBMIT = '[type="submit"]:not(.u-sr-only)'
const ALERT_SELECTOR = '[js-hook-alert]'
const INPUT_TYPES = 'input[name]:not([type="hidden"]), textarea[name], select[name]'
const HIDDEN_CLASS = 'u-hidden'
const FORM_ITEM_CLASS = '.form__item'
const FORM_ITEM_ERROR_CLASS = 'form__item--error'
const FORM_ITEM_ERROR_ARIA = 'aria-invalid'
const FORM_ITEM_DESCRIBE_ARIA = 'aria-describedby'
const FORM_ITEM_SUCCESS_CLASS = 'form__item--success'
const FORM_ITEM_ERROR_MESSAGE_HOOK = '.form__item-error'
const SUPPORTED_METHODS = ['post', 'put', 'get', 'delete']

class Form {
  constructor(element) {
    this.form = element

    // Config
    this.async = !!element.dataset.async
    this.method = this.getFormMethod()
    this.events = element.dataset.events
      ? element.dataset.events.join(',')
      : ['change', 'paste', 'blur', 'keyup']
    this.rules = rules
    this.action = element.getAttribute('action')

    // DOM Elements
    this.alertHook = ALERT_SELECTOR
    this.inputTypes = INPUT_TYPES

    // Methods
    this.afterSubmitFormSuccess = null

    // Events
    this.bindChangeEvents()
    this.bindSubmitEvents()
  }

  get inputs() {
    return [...this.form.querySelectorAll(this.inputTypes)]
  }

  get defaultSubmit() {
    return this.form.querySelector(JS_HOOK_DEFAULT_SUBMIT)
  }

  scrollToItem(target) {
    Events.$trigger('scroll-to::scroll', {
      data: {
        target,
        offset: 170,
      },
    })
  }

  /**
   * Checks if input type="number" fields contain text
   *
   * @param {HTMLInputElement} input | input element to check
   * @returns {Boolean} return true if number field contains text, false otherwise
   */
  numberFieldContainsText(input) {
    if (input.getAttribute('type') === 'number') {
      return !/^\d+$/.test(input.value)
    }

    return false
  }

  /**
   * Add alert message to page
   *
   * @param {Object} obj Alert information
   * @param {String} obj.message -  the message string to show
   * @param {String} obj.type - success, warning or error type
   */
  addAlertMessage({ message, type }) {
    const status = type || 'error'
    const el = this.form.querySelector(this.alertHook)
    if (!el) return
    el.innerHTML = message
    el.className = el.className.replace(/(?:^|\W)alert--(\w+)(?!\w)/g, ` alert--${status}`)
    el.classList.remove('u-hidden')
    el.removeAttribute('aria-hidden')
    el.focus()

    // Scroll to alert
    this.scrollToItem(el)
  }

  /**
   * Process API error
   *
   * @param {Object|String} error - error message
   */
  apiErrorHandler(error) {
    if (!error) return
    const errorMessage = error.errorMessage || error.message || error.responseJSON
    if (!errorMessage) return
    this.addAlertMessage({ message: errorMessage, type: 'error' })
  }

  submitFormError(error) {
    Events.$trigger('loader::hide')
    const { data } = error.response
    if (data) {
      this.apiErrorHandler(data)
    } else {
      throw new Error(`JAVASCRIPT ERROR: ${error}`)
    }
  }

  /**
   * Submit form success handler
   * @param {Object} data - data returned from API call
   */
  submitFormSuccess(data) {
    // If redirect redirect to page
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl
    }
    // Handle server field errors from body payload
    if (data.errors) {
      this.validateFormError(data.errors)
    }

    // If extended form provides afterSubmitFormSuccess function, this will be called
    if (typeof this.afterSubmitFormSuccess === 'function') {
      this.afterSubmitFormSuccess(data)
    }
  }

  getFormMethod() {
    const method = this.form.getAttribute('method')

    return method && SUPPORTED_METHODS.includes(method.toLowerCase())
        ? method.toLowerCase()
        : 'post'
  }

  submitForm(data) {
    API[this.method](this.action, data)
      .then(response => this.submitFormSuccess(response.data))
      .catch(error => this.submitFormError(error))
  }

  /**
   * Validate field success handler
   *
   * @param {HTMLElement} input | input that fired onChange event
   */
  validateFieldSuccess(input) {
    this.showInputSuccess(input)
  }

  /**
   * Validate field error handler
   *
   * @param {HTMLElement} input | input that fired onChange event
   * @param {String} message | message returned from validation
   */
  validateFieldError(input, message) {
    this.showInputError(input, message)
  }

  getErrorContainer(input) {
    const formItem = input.closest(FORM_ITEM_CLASS)
    return formItem.querySelector(FORM_ITEM_ERROR_MESSAGE_HOOK)
  }

  /**
   * Show the error state and message
   *
   * @param {Element} formItem | input parent that holds error/success classes
   * @param {HTMLElement} input | input to show error on
   * @param {String} message | message returned from validation or backend
   */
  showErrorMessage(formItem, input, message) {
    const formItemErrorContainer = this.getErrorContainer(input)
    input.setAttribute(FORM_ITEM_ERROR_ARIA, 'true')
    input.setAttribute(FORM_ITEM_DESCRIBE_ARIA, formItemErrorContainer.id)

    if (!formItemErrorContainer) return

    formItem.classList.add(FORM_ITEM_ERROR_CLASS)
    formItemErrorContainer.textContent = message
    formItemErrorContainer.classList.remove(HIDDEN_CLASS)
  }

  /**
   * Set validation error state on an input
   *
   * @param {HTMLElement} input | input to show error on
   * @param {String} message | message returned from validation or backend
   */
  showInputError(input, message) {
    const formItem = input.closest(FORM_ITEM_CLASS)

    this.resetFormItem(formItem, input)
    this.showErrorMessage(formItem, input, message)
  }

  /**
   * Set validation success state on an input
   *
   * @param {HTMLElement} input | input to show error on
   */
  showInputSuccess(input) {
    const formItem = input.closest(FORM_ITEM_CLASS)
    this.resetFormItem(formItem, input)

    if (input.hasAttribute('required')) {
      formItem.classList.add(FORM_ITEM_SUCCESS_CLASS)
    }
  }

  /**
   * Remove error classes and any old error message
   * @param {Element} formItem | input parent that holds error/success classes
   * @param {HTMLElement} input | input element
   */
  resetFormItem(formItem, input) {
    const formItemErrorContainer = this.getErrorContainer(input)

    formItem.classList.remove(FORM_ITEM_ERROR_CLASS)
    formItem.classList.remove(FORM_ITEM_SUCCESS_CLASS)
    input.removeAttribute(FORM_ITEM_ERROR_ARIA)
    input.removeAttribute(FORM_ITEM_DESCRIBE_ARIA)

    if (formItemErrorContainer) {
      formItemErrorContainer.textContent = ''
      formItemErrorContainer.classList.add(HIDDEN_CLASS)
    }
  }

  /**
   * Validate field - do field validation
   * @param {HTMLElement} input | input that fired onChange event
   */
  validateField(input) {
    if (input.hasAttribute('data-ignored')) {
      return
    }
    const validations = input.getAttribute('data-validate')
    if (!validations) return

    return validations
      .split(',')
      .map(type => type.trim())
      .filter(type => !rules[type].method(input))
      .map(type => rules[type].message)
      .join(', ')
  }

  /**
   * Handle onchange of an input
   * @param {HTMLInputElement} input | input that fired onChange event
   */
  handleInputChange(input) {
    if (this.numberFieldContainsText(input)) {
      input.value = ''
    }
    const message = this.validateField(input)
    if (message) {
      return this.validateFieldError(input, message)
    }
    return this.validateFieldSuccess(input)
  }

  getFormEntries() {
    console.log('getFormEntries - ', serializeObject(this.form))
    return serializeObject(this.form)
  }

  /**
   * Form validation success handler
   */
  validateFormSuccess() {
    if (this.async) {
      return this.submitForm(this.getFormEntries())
    }
    this.form.submit()
  }

  /**
   * Show the input errors of the entire form per field and scroll to first invalid field
   *
   * @param {Object} messages | error messages returned from validation
   */
  showInputErrors(messages) {
    let scrolledToError = false
    this.inputs.map(input => {
      if (!scrolledToError && messages[input.name]) {
        this.scrollToItem(input)
        scrolledToError = true
      }
      if (messages[input.name]) {
        return this.showInputError(input, messages[input.name])
      }
    })
  }

  /**
   * Form validation error handler
   * @param {Object} messages | messages returned from validation of fields
   */
  validateFormError(messages) {
    this.showInputErrors(messages)
  }

  getErrorMessages() {
    return this.inputs.reduce((acc, input) => {
      const message = this.validateField(input)
      if (message) acc[input.name] = message
      return acc
    }, {})
  }

  validateForm() {
    const messages = this.getErrorMessages()
    const isValid = !Object.keys(messages).length
    if (isValid) {
      return this.validateFormSuccess()
    }
    return this.validateFormError(messages)
  }

  /**
   * Submit the shipping form
   * @param event, submit event
   */
  handleFormSubmit(event) {
    event.preventDefault()
    this.validateForm()
  }

  bindSubmitEvents() {
    // KEEP: For debug of form: submits the form without validation, to trigger backend errors right away.
    // this.form.addEventListener('submit', event => {
    //   event.preventDefault(event);
    //   this.submitForm();
    // });
    this.form.addEventListener('submit', event => this.handleFormSubmit(event))
  }

  /**
   * Bind change events of input elements
   */
  bindChangeEvents() {
    this.inputs.map(input =>
      this.events.map(event =>
        input.addEventListener(event, () => this.handleInputChange(input), false),
      ),
    )
  }
}

export default Form
