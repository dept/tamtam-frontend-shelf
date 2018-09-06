import cookies from 'js-cookie';
import Events from '@utilities/events';

const COOKIE_BAR_HOOK = '[js-hook-cookies-bar]';
const COOKIE_OPTIONS_BUTTON_HOOK = '[js-hook-cookies-settings-button]';

const COOKIE_FORM_HOOK = '[js-hook-cookies-form]';
const COOKIE_FORM_SUBMIT_HOOK = '[js-hook-cookies-form-accept]';
const COOKIE_OPTION_HOOK = '[js-hook-cookies-option]';

const COOKIEBAR_COOKIE_NAME = 'accepted';
const COOKIEBAR_COOKIE_VERSION = 'version';
const SHOW_CLASS = 'cookie-bar--is-visible';

class Cookies {

    constructor() {

        this.cookiebar = document.querySelector(COOKIE_BAR_HOOK);
        this.cookiebarOptionsButton = document.querySelector(COOKIE_OPTIONS_BUTTON_HOOK);

        this.form = {};
        this.form.element = document.querySelector(COOKIE_FORM_HOOK);

        if (this.form.element) {
            this.form.url = this.form.element.getAttribute('action');
            this.form.options = [...this.form.element.querySelectorAll(COOKIE_OPTION_HOOK)];
            this.form.submit = this.form.element.querySelector(COOKIE_FORM_SUBMIT_HOOK);
        }

        this.config = {
            cookiePrefix: 'default',
            version: '1',
            cookies: [
                {
                    name: 'functional',
                    default: 1
                },
                {
                    name: 'analytics',
                    default: 1
                },
                {
                    name: 'social',
                    default: 0
                },
                {
                    name: 'advertising',
                    default: 0
                },
                {
                    name: 'other',
                    default: 0
                }
            ]
        };

    }

    init(config) {

        this._setConfig(config);

        if (this.getCookie(COOKIEBAR_COOKIE_VERSION) !== this.config.version) {
            this._removeInvalidatedCookies();
        }

        this._setDefaultCookies();

        this._bindEvents();

        if (this.form.element) {
            this._prefillFormCookies();
        }

        if (!this.getCookie(COOKIEBAR_COOKIE_NAME)) {
            this.setCookie(COOKIEBAR_COOKIE_NAME, '0');
        }

        if (this.getCookie(COOKIEBAR_COOKIE_VERSION) !== this.config.version && !this.form.element || this.getCookie(COOKIEBAR_COOKIE_NAME) === '0' && !this.form.element) {
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

        if (!this.getCookie(COOKIEBAR_COOKIE_NAME) || !this.getCookie(COOKIEBAR_COOKIE_NAME) === '0') {
            Array.from(document.querySelectorAll('a, input[type="submit"], button[type="submit"]'))
                .filter(link => link !== this.cookiebarOptionsButton && link !== this.form.submit)
                .forEach(link => {
                    link.addEventListener('click', event => {
                        this._acceptAllCookies();
                        const url = event.currentTarget.href;
                        if (url) {
                            window.location = url;
                        }
                    });
                });
        }

    }

    _setDefaultCookies() {

        this.config.cookies.forEach(cookie => {
            if (!this.getCookie(cookie.name) && cookie.default === 1) {
                this.setCookie(cookie.name, cookie.default);
            }
        });

    }

    _acceptAllCookies() {

        const acceptedCookies = {};

        this.config.cookies.forEach(cookie => {
            this.setCookie(cookie.name, '1');
            acceptedCookies[this.prefixCookieName(cookie.name)] = '1';
        });

        this._addGlobalCookies(acceptedCookies);

        window.location.reload();

    }

    _addGlobalCookies(_cookies) {

        _cookies.date = Date(Date.now());
        _cookies.version = this.config.version;

        this.setCookie(COOKIEBAR_COOKIE_NAME, _cookies);
        this.setCookie(COOKIEBAR_COOKIE_VERSION, this.config.version);

    }

    _prefillFormCookies() {

        this.form.options.forEach(option => {

            if (this.getCookie(option.value) === '1') {
                option.setAttribute('checked', 'checked');
            } else if (this.getCookie(option.value) === '0') {
                option.removeAttribute('checked');
            } else {
                option.setAttribute('checked', 'checked');
            }

        });

    }

    _removeInvalidatedCookies() {

        this.config.cookies.forEach(cookie => {
            this.removeCookie(cookie.name);
        });

        this.removeCookie(COOKIEBAR_COOKIE_NAME);
        this.removeCookie(COOKIEBAR_COOKIE_VERSION);

    }

    _submitFormCookies(event) {

        event.preventDefault();

        const acceptedCookies = {};

        this.form.options.forEach(option => {
            const { value } = option;
            this.config.cookies.forEach(cookie => {
                if (cookie.name.indexOf(value) !== -1) {
                    const state = option.checked ? '1' : '0';
                    this.setCookie(value, state);
                    acceptedCookies[this.prefixCookieName(value)] = state;
                }
            });
        });

        this._addGlobalCookies(acceptedCookies);

        window.location = this.form.url;

    }

    _setDefaultPreferences() {

        this.form.options.forEach(option => {
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
        cookies.set(this.prefixCookieName(name), value, { expires: 365 });
    }

    /**
     * Remove cookie with given value
     * @param {String} name
     */
    removeCookie(name) {
        cookies.remove(this.prefixCookieName(name));
    }

    /**
     * Gets cookie with given value
     * @param {String} name
     * @returns {Any} value
     */
    getCookie(name) {
        return cookies.get(this.prefixCookieName(name));
    }


    prefixCookieName(name) {
        return `${this.config.cookiePrefix}-cookie-${name}`;
    }

    /**
     * Checks if cookie is valid and version is correct
     * @returns {Boolean}
     */
    cookieIsValid(name) {
        return this.getCookie(COOKIEBAR_COOKIE_VERSION) === this.config.version && cookies.get(this.prefixCookieName(name)) === '1';
    }
}


export default new Cookies();
