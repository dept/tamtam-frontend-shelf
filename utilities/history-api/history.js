/**
 *  @shelf-version: 1.0.0
 */

import Events from './events';

class History {

    constructor() {

        this.bindEvents();

    }

    /**
    * Bind events
    */
    bindEvents() {

        Events.$on('history::push', (e, data) => this.pushHistory(data));
        Events.$on('history::replace', (e, data) => this.replaceHistory(data));

    }

    /**
    * Create a new URL entry in your History
    * @param {Object} data
    * @param {Object} [data[].state] State object
    * @param {string} data[].url New url
    */
    pushHistory(data) {

        const pushOptions = {
            state: data.state || {},
            url: data.url
        };

        window.history.pushState(pushOptions.state, document.title, pushOptions.url);

    }

    /**
    * Overwrite current URL entry in your History
    * @param {Object} data
    * @param {Object} [data[].state] State object
    * @param {string} data[].url New url
    */
    replaceHistory(data) {

        const replaceOptions = {
            state: data.state || {},
            url: data.url
        };

        window.history.replaceState(replaceOptions.state, document.title, replaceOptions.url);

    }

}

export default new History();
