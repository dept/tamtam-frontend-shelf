import { AxiosError, Method } from 'axios'

import API from '@/utilities/api'
import Events from '@/utilities/events'
import serializeObject from '@/utilities/serialize-object'
import { rules, ValidationRule } from '@/utilities/validation'

type FormErrorMessages = Record<string, string>
type InputType = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
const INPUT_TYPES = 'input[name]:not([type="hidden"]), textarea[name], select[name]'
type SupportedMethod = Extract<Method, 'post' | 'put' | 'get' | 'delete'>
const SUPPORTED_METHODS: SupportedMethod[] = ['post', 'put', 'get', 'delete']

const JS_HOOK_DEFAULT_SUBMIT = '[type="submit"]:not(.u-sr-only)'
const ALERT_SELECTOR = '[js-hook-alert]'

const HIDDEN_CLASS = 'u-hidden'
const FORM_ITEM_CLASS = '.form__item'
const FORM_ITEM_ERROR_CLASS = 'form__item--error'
const FORM_ITEM_ERROR_ARIA = 'aria-invalid'
const FORM_ITEM_DESCRIBE_ARIA = 'aria-describedby'
const FORM_ITEM_SUCCESS_CLASS = 'form__item--success'
const FORM_ITEM_ERROR_MESSAGE_HOOK = '.form__item-error'

const DEFAULT_METHOD = 'post'

class Form {
  form: HTMLFormElement
  method: SupportedMethod
  action: HTMLFormElement['action']
  async: boolean
  events: string[]
  rules: Record<string, ValidationRule>

  // DOM Elements
  alertHook = ALERT_SELECTOR
  inputTypes = INPUT_TYPES

  // Methods
  afterSubmitFormSuccess: ((data: any) => void) | null = null

  constructor(element: HTMLFormElement) {
    this.form = element
    // Config
    this.async = !!element.dataset.async
    this.method = this.getFormMethod()
    this.events = element.dataset.events
      ? element.dataset.events.split(',')
      : ['change', 'paste', 'blur', 'keyup']
    this.rules = rules
    this.action = element.getAttribute('action') || window.location.href

    // Events
    this.bindChangeEvents()
    this.bindSubmitEvents()
  }

  get inputs() {
    return [...this.form.querySelectorAll<InputType>(this.inputTypes)]
  }

  get defaultSubmit() {
    return this.form.querySelector(JS_HOOK_DEFAULT_SUBMIT)
  }

  scrollToItem(target: HTMLElement) {
    Events.$trigger('scroll-to::scroll', {
      data: {
        target,
        offset: 170,
      },
    })
  }

  /**
   * Checks if input type="number" fields contain text
   */
  numberFieldContainsText(input: InputType) {
    if (input.getAttribute('type') === 'number') {
      return !/^\d+$/.test(input.value)
    }
    return false
  }

  /**
   * Add alert message to page
   */
  addAlertMessage({ message, type }: { message: string; type: string }) {
    const status = type || 'error'
    const element = this.form.querySelector<HTMLElement>(this.alertHook)
    if (!element) return
    element.innerHTML = message
    element.className = element.className.replace(
      /(?:^|\W)alert--(\w+)(?!\w)/g,
      ` alert--${status}`,
    )
    element.classList.remove('u-hidden')
    element.removeAttribute('aria-hidden')
    element.focus()

    // Scroll to alert
    this.scrollToItem(element)
  }

  /**
   * Process API error
   */
  apiErrorHandler(error: any) {
    if (!error) return

    const errorMessage = error.errorMessage || error.message || error.responseJSON
    if (!errorMessage) return
    this.addAlertMessage({ message: errorMessage, type: 'error' })
  }

  submitFormError(error: AxiosError<any>) {
    Events.$trigger('loader::hide')
    if (error.response?.data) {
      this.apiErrorHandler(error.response?.data)
    } else {
      throw new Error(`JAVASCRIPT ERROR: ${error}`)
    }
  }

  /**
   * Submit form success handler
   */
  submitFormSuccess(data: Record<string, any>) {
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

    return (
      method && SUPPORTED_METHODS.includes(method.toLowerCase() as SupportedMethod)
        ? method.toLowerCase()
        : DEFAULT_METHOD
    ) as SupportedMethod
  }

  submitForm<T>(data: T) {
    API[this.method]<T>(this.action, data)
      .then(response => this.submitFormSuccess(response.data))
      .catch(error => this.submitFormError(error))
  }

  /**
   * Validate field success handler
   */
  validateFieldSuccess(input: InputType) {
    this.showInputSuccess(input)
  }

  /**
   * Validate field error handler
   */
  validateFieldError(input: InputType, message: ValidationRule['message']) {
    this.showInputError(input, message)
  }

  getErrorContainer(input: InputType) {
    const formItem = input.closest(FORM_ITEM_CLASS)
    return formItem?.querySelector(FORM_ITEM_ERROR_MESSAGE_HOOK)
  }

  /**
   * Show the error state and message
   */
  showErrorMessage(formItem: HTMLElement, input: InputType, message: ValidationRule['message']) {
    const formItemErrorContainer = this.getErrorContainer(input)
    input.setAttribute(FORM_ITEM_ERROR_ARIA, 'true')

    if (!formItemErrorContainer) return
    input.setAttribute(FORM_ITEM_DESCRIBE_ARIA, formItemErrorContainer.id)

    formItem.classList.add(FORM_ITEM_ERROR_CLASS)
    formItemErrorContainer.textContent = message
    formItemErrorContainer.classList.remove(HIDDEN_CLASS)
  }

  /**
   * Set validation error state on an input
   */
  showInputError(input: InputType, message: ValidationRule['message']) {
    const formItem = input.closest<HTMLElement>(FORM_ITEM_CLASS)
    if (!formItem) return
    this.resetFormItem(formItem, input)
    this.showErrorMessage(formItem, input, message)
  }

  /**
   * Set validation success state on an input
   */
  showInputSuccess(input: InputType) {
    const formItem = input.closest<HTMLElement>(FORM_ITEM_CLASS)
    if (!formItem) return

    this.resetFormItem(formItem, input)
    if (input.hasAttribute('required')) {
      formItem.classList.add(FORM_ITEM_SUCCESS_CLASS)
    }
  }

  /**
   * Remove error classes and any old error message
   */
  resetFormItem(formItem: HTMLElement, input: InputType) {
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
   */
  validateField(input: InputType) {
    if (input.hasAttribute('data-ignored')) return

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
   */
  handleInputChange(input: InputType) {
    if (this.numberFieldContainsText(input)) input.value = ''

    const message = this.validateField(input)
    if (message) return this.validateFieldError(input, message)
    return this.validateFieldSuccess(input)
  }

  getFormEntries() {
    return serializeObject(this.form)
  }

  /**
   * Form validation success handler
   */
  validateFormSuccess() {
    if (this.async) {
      return this.submitForm<any>(this.getFormEntries())
    }
    this.form.submit()
  }

  /**
   * Show the input errors of the entire form per field and scroll to first invalid field
   *
   * @param {Object} messages | error messages returned from validation
   */
  showInputErrors(messages: FormErrorMessages) {
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
   */
  validateFormError(messages: FormErrorMessages) {
    this.showInputErrors(messages)
  }

  getErrorMessages() {
    return this.inputs.reduce((acc, input) => {
      const message = this.validateField(input)
      if (message) acc[input.name] = message
      return acc
    }, {} as Record<string, string>)
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
   */
  handleFormSubmit(event: Event) {
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
    this.inputs.forEach(input =>
      this.events.forEach(event =>
        input.addEventListener(event, () => this.handleInputChange(input), false),
      ),
    )
  }
}

export default Form
