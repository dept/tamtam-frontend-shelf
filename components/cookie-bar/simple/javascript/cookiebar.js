import cookies from 'js-cookie';
import Events from './util/events';

const COOKIEBAR_HOOK = '[js-hook-cookiebar]'
const COOKIE_NAME = 'cookie';
const SHOW_CLASS = 'cookie--showing';

class Cookiebar {

    constructor() {

        this.cookiebar = document.querySelector(COOKIEBAR_HOOK);

        if (!this.cookiebar) { return; }

        this.bindEvents();

        if (!cookies.get(COOKIE_NAME)) {
            setCookie('0');
        } 

        if (cookies.get(COOKIE_NAME) === '0') {
            this.show();
        }

    }

    bindEvents() {

        Events.$on('cookie::dismiss', () => this.hide());

    }

    hide() {

        this.cookiebar.classList.remove(SHOW_CLASS);
        setCookie('1');
        
    }
    
    show() {
        
        this.cookiebar.classList.add(SHOW_CLASS);

    }

}

/**
 * Sets cookie with given value
 * @param {any} value
 */
function setCookie(value) {

    cookies.set(COOKIE_NAME, value);

}

export default new Cookiebar();