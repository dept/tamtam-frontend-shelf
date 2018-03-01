import cookies from 'js-cookie';
import Events from 'utilities/events';

const COOKIE_BAR_HOOK = '[js-hook-cookies-bar]';
const COOKIE_FORM_HOOK = '[js-hook-cookies-form]';
const COOKIE_OPTION_HOOK = '[js-hook-cookies-option]';

const COOKIEBAR_COOKIE_NAME = 'cookiebar-accepted';
const SHOW_CLASS = 'cookie-bar--is-visible';

class Cookies {

    constructor() {

        this.cookiebar = document.querySelector(COOKIE_BAR_HOOK);
        this.form = {};
        this.form.element = document.querySelector(COOKIE_FORM_HOOK);

        if (this.form.element) {
            this.form.url = this.form.element.getAttribute('action');
            this.form.options = this.form.element.querySelectorAll(COOKIE_OPTION_HOOK);
        }

        this.config = {
            cookiePrefix: 'default',
            version: 1,
            cookies: [
                {
                    'name': 'functional',
                    'default': 1 // Always enabled by default (law)
                },
                {
                    'name': 'analytics',
                    'default': 1 // Always enabled by default (law)
                },
                {
                    'name': 'social',
                    'default': 0
                },
                {
                    'name': 'advertising',
                    'default': 0
                },
                {
                    'name': 'other',
                    'default': 0
                }
            ]
        }

    }

    init(config) {

        this._setConfig(config);
        this._setDefaultCookies();

        this._bindEvents();

        if (this.form.element) {
            this._prefillFormCookies();
        }

        if (!this.getCookie(COOKIEBAR_COOKIE_NAME)) {
            this.setCookie(COOKIEBAR_COOKIE_NAME, '0');
        }

        if (this.getCookie(COOKIEBAR_COOKIE_NAME) === '0' && !this.form.element) {
            this._show();
        }

    }

    _setConfig(config) {

        if (config) {
            Object.assign(this.config, config);
        }

    }

    _bindEvents() {

        if (this.cookiebar) {
            Events.$on('cookies::dismiss', () => this._acceptAllCookies());
        }

        if (this.form.element) {
            Events.$on('cookies::preferences-default', () => this._setDefaultPreferences());
            this.form.element.addEventListener('submit', event => this._submitFormCookies(event));
        }

    }

    _setDefaultCookies() {

        this.config.cookies.map(cookie => {
            if (!this.getCookie(`cookie-${cookie.name}`)) {
                this.setCookie(`cookie-${cookie.name}`, cookie.default);
            }
        });

    }

    _acceptAllCookies() {

        this.config.cookies.map(cookie => {
            this.setCookie(`cookie-${cookie.name}`, '1');
        });

        this.setCookie(COOKIEBAR_COOKIE_NAME, '1');

        location.reload();

    }

    _prefillFormCookies() {

        Array.from(this.form.options).map(option => {

            if (this.getCookie(`cookie-${option.value}`) === '1') {
                option.setAttribute('checked', 'checked');
            }

        });

    }

    _submitFormCookies(event) {

        event.preventDefault();

        Array.from(this.form.options).map(option => {
            const value = option.value;
            this.config.cookies.map(cookie => {
                if (cookie.default !== 1 && cookie.name.indexOf(value) !== -1) {
                    this.setCookie(`cookie-${value}`, option.checked ? '1' : '0');
                }
            })
        });

        this.setCookie(COOKIEBAR_COOKIE_NAME, '1');

        window.location = this.form.url;

    }

    _setDefaultPreferences() {

        Array.from(this.form.options).map(option => {
            option.setAttribute('checked', 'checked');
        });

    }

    _show() {

        if (this.cookiebar) {
            this.cookiebar.classList.add(SHOW_CLASS);
        }

    }

    /**
     * Sets cookie with given value
     * @param {String} name
     * @param {any} value
     */
    setCookie(name, value) {

        cookies.set(`${this.config.cookiePrefix}-${name}`, value, { expires: 365 });

    }

    /**
     * Gets cookie with given value
     * @param {String} name
     */
    getCookie(name) {

        return cookies.get(`${this.config.cookiePrefix}-${name}`);

    }

}


export default new Cookies();
