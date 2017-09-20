/**
 *  @shelf-version: 1.0.0
 */

import 'core-js/fn/array/from';

import Events from './util/events';

const html = document.documentElement;

const MODAL_HOOK            = '[js-hook-modal]';
const MODAL_CLOSE_HOOK      = '[js-hook-button-modal-close]';
const MODAL_VISIBLE_CLASS   = 'modal--is-showing';
const MODAL_HTML_CLASS      = 'is--modal-open';


class Modal {

    constructor() {

        this.registeredModals = {};

        const modals = document.querySelectorAll(MODAL_HOOK);

        Array.from(modals).forEach(modal => this.setupModalRegistry(modal));

        this.bindEvents();

    }

    /**
     * Bind event based on custom hook
     * @param {Event} event
     * @param {Object[]} data
     * @param {string} data[].id
     * @param {Number} [data[].noBodyClass]
     */
    customBind(event, data) {

        const modals = document.querySelectorAll(data.hook);
        const noBodyClass = data.noBodyClass || false;

        // Loop trough all found modals based on hook
        Array.from(modals).forEach(modal => this.setupModalRegistry(modal, noBodyClass));

    }

    /**
     * Setup an object per found modal
     * @param {HTMLElement} el Single modalbox
     * @param {Boolean} noBodyClass If set doesn't add class to body when modal is active
     */
    setupModalRegistry(el, noBodyClass) {

        const id = el.getAttribute('id');

        const triggerBtn = document.querySelectorAll(`[aria-controls=${id}]`);
        const closeBtn = el.querySelectorAll(MODAL_CLOSE_HOOK);

        const modal = {
            el,
            id,
            triggerBtn,
            closeBtn,
            noBodyClass
        };

        this.registeredModals[`modal-${id}`] = modal;

        this.bindModalEvents(modal);
    }

    /**
     * Bind all general events
     */
    bindEvents() {

        Events.$on('modal::close', (event, data) => this.closeModal(event, data));
        Events.$on('modal::open', (event, data) => this.openModal(event, data));

        Events.$on('modal::bind', (event, data) => this.customBind(event, data));

    }

    /**
     * Bind all modal specific events
     * @param {string} id Modal id
     * @param {HTMLElement} triggerBtn Button to open modal
     * @param {HTMLElement} closeBtn Button to close modal
     * @param {Boolean} noBodyClass If set doesn't add class to body when modal is active
     */
    bindModalEvents({ id, triggerBtn, closeBtn, noBodyClass }) {

        Array.from(triggerBtn).forEach(el => el.addEventListener('click', () => {
            Events.$trigger('modal::open', {data: {id, noBodyClass}});
            Events.$trigger(`modal::open(${ id })`, {data: {id, noBodyClass}});
        }));

        Array.from(closeBtn).forEach(el => el.addEventListener('click', () => {
            Events.$trigger('modal::close', { data: { id, noBodyClass } });
            Events.$trigger(`modal::close(${ id })`, {data: {id, noBodyClass}});
        }));

        // Close on ESCAPE_KEY
        document.addEventListener('keyup', event => {
            if (event.keyCode == 27) { this.closeModal(); }
        });

    }

    /**
     * Open modal by given id
     * @param {Event} event
     * @param {Object[]} data
     * @param {string} data[].id
     * @param {Number} [data[].noBodyClass]
     */
    openModal(event, data) {

        const modal = this.registeredModals[`modal-${data.id}`];

        if (!modal) { return; }

        // Add modal open class to html element if noBodyClass is false
        if (!data.noBodyClass) {
            html.classList.add(MODAL_HTML_CLASS);
        }

        // Add tabindex and add visible class
        modal.el.setAttribute('tabindex', 1);
        modal.el.classList.add(MODAL_VISIBLE_CLASS);

        Events.$trigger('focustrap::activate', {
            data: {
                element: modal.el
            }
        });

    }

    /**
     * Close modal by id, if none gives it will close all
     * @param {Event} event
     * @param {Object[]} data
     * @param {string} data[].id
     * @param {Number} [data[].noBodyClass]
     */
    closeModal(event, data) {

        // If no ID is given we will close all modals
        if (!data || !data.id) {
            for (const modalIndex of Object.keys(this.registeredModals)) {
                this.closeModal(null, { id: this.registeredModals[modalIndex].id });
                Events.$trigger('focustrap::deactivate');
            }
            return;
        }

        // Get current modal from all known modals
        const modal = this.registeredModals[`modal-${data.id}`];

        // If there is no modal do nothing
        if (!modal) { return; }

        // Remove modal open class off html element if noBodyClass is false
        if (!data.noBodyClass) {
            html.classList.remove(MODAL_HTML_CLASS);
        }

        // Remove tabindex and remove visible class
        modal.el.setAttribute('tabindex', 0);
        modal.el.classList.remove(MODAL_VISIBLE_CLASS);

        Events.$trigger('focustrap::deactivate');

    }

}

export default new Modal();
