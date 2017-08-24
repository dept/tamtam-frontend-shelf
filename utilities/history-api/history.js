/**
 *  @shelf-version: 1.0.0
 */

import Events from './events';

class History {

    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        Events.$on('history::push', (e, url) => this.pushHistory(url));
        Events.$on('history::replace', (e, url) => this.replaceHistory(url));
    }

    pushHistory(url) {
        window.history.pushState({}, document.title, url);
    }

    replaceHistory(url) {
        window.history.replaceState({}, document.title, url);
    }

}

export default new History();
