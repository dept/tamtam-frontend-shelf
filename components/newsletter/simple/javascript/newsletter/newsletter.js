import { isValidEmail } from '../util/validation';
import Events from '../util/events';
import Api from '../util/api';

const API_URL = '/api/test/'

const FORM_HOOK = '[js-hook-newsletter-form]';
const INPUT_HOOK = '[js-hook-newsletter-input]';

const SUCCESS_MESSAGE_HOOK = '[js-hook-newsletter-message-success]';
const ERROR_MESSAGE_HOOK = '[js-hook-newsletter-message-error]';

const SUBMIT_BUTTON_HOOK = '[js-hook-newsletter-submit]';
const CLOSE_BUTTON_HOOK = '[js-hook-newsletter-button-close]';
const CLOSE_MESSAGE_BUTTON_HOOK = '[js-hook-newsletter-button-close-message]';

const OPEN_CLASS = 'newsletter--is-open';
const MESSAGE_CLASS = 'newsletter__form-message--is-open';

class Newsletter {

    constructor(element) {

        this.newsletter = element;

        this.form = this.newsletter.querySelector(FORM_HOOK);
        this.inputs = this.newsletter.querySelectorAll(INPUT_HOOK);

        this.message = {};
        this.message.state = '';
        this.message.success = this.newsletter.querySelector(SUCCESS_MESSAGE_HOOK);
        this.message.error = this.newsletter.querySelector(ERROR_MESSAGE_HOOK);

        this.button = {};
        this.button.submit = this.newsletter.querySelector(SUBMIT_BUTTON_HOOK);
        this.button.close = this.newsletter.querySelector(CLOSE_BUTTON_HOOK);
        this.button.closeMessage = this.newsletter.querySelectorAll(CLOSE_MESSAGE_BUTTON_HOOK);

        if (!this.newsletter) { return; }

        this.bindEvents();

    }

    bindEvents() {

        Array.from(this.inputs).forEach(input => {
            input.addEventListener('focus', () => this._open());
            input.addEventListener('keypress', () => this._testForm());
            input.addEventListener('keyup', () => this._testForm());
        });

        Array.from(this.button.closeMessage).forEach(button => {
            button.addEventListener('click', () => this._closeMessage())
        });

        this.button.close.addEventListener('click', () => this._close())
        this.form.addEventListener('submit', event => this._submitForm(event));

    }

    _open() {

        this.newsletter.classList.add(OPEN_CLASS);

    }

    _close() {

        this.newsletter.classList.remove(OPEN_CLASS);

    }

    _closeMessage() {

        if (this.message[this.message.state]){
            this.message[this.message.state].classList.remove(MESSAGE_CLASS);
            this.message[this.message.state].setAttribute('aria-hidden', true);
            Events.$triggger('focustrap::deactivate');        
        }

    }

    _testForm() {

        if (validateElements(this.inputs)) {
            this.button.submit.setAttribute('disabled', true);
        } else {
            this.button.submit.removeAttribute('disabled');
        }

    }

    _submitForm(event) {

        event.preventDefault();
        if (!validateElements(this.inputs)) {
            this._sendForm();
        }

    }

    _sendForm() {

        this.message.success.classList.remove(MESSAGE_CLASS);
        this.message.error.classList.remove(MESSAGE_CLASS);

        Api.post(API_URL, {
            data: generateFormDataJson(this.form)
        })
            .then(() => this._setMessageState('success'), () => this._setMessageState('error'))

    }

    _setMessageState(state){

        
        if (this.message[state]){
            this.message.state = state;
            this.message[state].classList.add(MESSAGE_CLASS);
            this.message[state].setAttribute('aria-hidden', false);
            Events.$triggger('focustrap::activate', { data: { element: this.message[state] } });
        }

    }

}

function validateElements(elements) {

    let errors = 0;

    Array.from(elements).forEach(element => {

        const type = element.getAttribute('type');

        if (element.required && element.value == "") {
            errors++;
        }

        if (type === 'email' && !isValidEmail(element.value)) {
            errors++;
        }

    });

    return errors;

}

function generateFormDataJson(form) {
    return [].reduce.call(form.elements, (data, element) => {
        return (element.name) ? (data[element.name] = element.value, data) : data;
    }, {});
}

export default Newsletter;
