import API from '@utilities/api'
import Events from '@utilities/events'
import serializeObject from '@utilities/serialize-object'
import { rules } from '@utilities/validation'

const JS_HOOK_DEFAULT_SUBMIT = '[type="submit"]:not(.u-sr-only)'
const ALERT_SELECTOR = '[js-hook-alert]'
const FORM_SELECTOR = '.c-form'
const INPUT_TYPES = 'input[name]:not([type="hidden"]), textarea[name], select[name]'
const HIDDEN_CLASS = 'u-hidden'
const FORM_ITEM_CLASS = '.form__item'
const FORM_ITEM_ERROR_CLASS = 'form__item--error'
const FORM_ITEM_ERROR_ARIA = 'aria-invalid'
const FORM_ITEM_DESCRIBE_ARIA = 'aria-describedby'
const FORM_ITEM_SUCCESS_CLASS = 'form__item--success'
const FORM_ITEM_ERROR_MESSAGE_HOOK = '.form__item-error'

class Form {
  constructor(element) {
    this.form = element

    // Config
    this.async = !!element.dataset.async
    this.events = element.dataset.events
      ? element.dataset.events.join(',')
      : ['change', 'paste', 'blur', 'keyup']
    this.rules = rules
    this.action = element.getAttribute('action')

    // DOM Elements
    this.alertHook = ALERT_SELECTOR
    this.formSelector = FORM_SELECTOR
    this.class = FORM_ITEM_CLASS
    this.inputTypes = INPUT_TYPES
    this.errorClass = FORM_ITEM_ERROR_CLASS
    this.errorAria = FORM_ITEM_ERROR_ARIA
    this.describeAria = FORM_ITEM_DESCRIBE_ARIA
    this.successClass = FORM_ITEM_SUCCESS_CLASS
    this.errorMessage = FORM_ITEM_ERROR_MESSAGE_HOOK

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
   * @param {HTMLElement} input | input element to check
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
   * @param {String} message -  the message string to show
   * @param {String} type - success, warning or error type
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
   * @param {string} selector - error message selector
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

  submitForm(data) {
    API.post(this.action, data)
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
    const formItem = input.closest(this.class)
    return formItem.querySelector(this.errorMessage)
  }

  /**
   * Show the error state and message
   *
   * @param {HTMLElement} formItem | input parent that holds error/success classes
   * @param {HTMLElement} input | input to show error on
   * @param {String} message | message returned from validation or backend
   */
  showErrorMessage(formItem, input, message) {
    const formItemErrorContainer = this.getErrorContainer(input)
    if (!formItemErrorContainer) return

    input.setAttribute(this.errorAria, true)
    input.setAttribute(this.describeAria, formItemErrorContainer.id)
    formItem.classList.add(this.errorClass)
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
    const formItem = input.closest(this.class)

    this.resetFormItem(formItem, input)
    this.showErrorMessage(formItem, input, message)
  }

  /**
   * Set validation success state on an input
   *
   * @param {HTMLElement} input | input to show error on
   * @param {String} message | message returned from validation or backend
   */
  showInputSuccess(input) {
    const formItem = input.closest(this.class)
    this.resetFormItem(formItem, input)

    if (input.hasAttribute('required')) {
      formItem.classList.add(this.successClass)
    }
  }

  /**
   * Remove error classes and any old error message
   * @param {HTMLElement} formItem | input parent that holds error/success classes
   * @param {HTMLElement} input | input element
   */
  resetFormItem(formItem, input) {
    const formItemErrorContainer = this.getErrorContainer(input)

    formItem.classList.remove(this.errorClass)
    formItem.classList.remove(this.successClass)
    input.removeAttribute(this.errorAria)
    input.removeAttribute(this.describeAria)

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
   * @param {HTMLElement} input | input that fired onChange event
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
