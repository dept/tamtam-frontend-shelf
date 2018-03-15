import cookies from 'js-cookie';
import Events from 'utilities/events';

const COOKIE_BAR_HOOK = '[js-hook-cookies-bar]';
const COOKIE_FORM_HOOK = '[js-hook-cookies-form]';
const COOKIE_OPTION_HOOK = '[js-hook-cookies-option]';

const COOKIEBAR_COOKIE_NAME = 'accepted';
const COOKIEBAR_COOKIE_VERSION = 'version';
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
                    // Always enabled by default (law)
                    'default': 1
                },
                {
                    'name': 'analytics',
                    // Always enabled by default (law)
                    'default': 1
                },
                {
                    'name': 'social',
                    'default': 1
                },
                {
                    'name': 'advertising',
                    'default': 1
                },
                {
                    'name': 'other',
                    'default': 1
                }
            ]
        };

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

        this.config.cookies.forEach(cookie => {
            if (!this.getCookie(cookie.name)) {
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

        location.reload();

    }

    _addGlobalCookies(cookies) {

        cookies['date'] = Date(Date.now());
        cookies['version'] = this.config.version;

        this.setCookie(COOKIEBAR_COOKIE_NAME, cookies);
        this.setCookie(COOKIEBAR_COOKIE_VERSION, this.config.version);

    }

    _prefillFormCookies() {

        Array.from(this.form.options).forEach(option => {

            if (this.getCookie(option.value) === '1') {
                option.setAttribute('checked', 'checked');
            }

        });

    }

    _submitFormCookies(event) {

        event.preventDefault();

        const acceptedCookies = {};

        Array.from(this.form.options).forEach(option => {
            const value = option.value;
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

        Array.from(this.form.options).forEach(option => {
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
     * Gets cookie with given value
     * @param {String} name
     */
    getCookie(name) {
        return cookies.get(this.prefixCookieName(name));
    }

    prefixCookieName(name) {
        return `${this.config.cookiePrefix}-cookie-${name}`;
    }
}


export default new Cookies();
