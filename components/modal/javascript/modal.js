/* @version: 1.0.0 */

import 'core-js/fn/array/from';
import Events from './util/events';

const html = document.documentElement;

const MODAL_HOOK = '[data-js-hook="modal"]';
const MODAL_CLOSE_HOOK = '[data-js-hook="button-modal-close"]';

const MODAL_VISIBLE_CLASS = 'modal--is-showing';
const MODAL_HTML_CLASS = 'is--modal-open';



class Modal {

    constructor() {

        this.registeredModals = {};

        const modals = document.querySelectorAll(MODAL_HOOK);

        Array.from(modals).forEach((modal) => {
            this.setupModalRegistry(modal);
        });

        this.bindEvents();

    }

    onRegisterCustomModal(event, data) {
        this.registerCustomModal(data);
    }

    /**
     * Register new modals by custom hook.
     */
    registerCustomModal( data) {
        if ( !data ) {
            return;
        }

        const modals = document.querySelectorAll(data.selector);
        const noBodyClass = data.noBodyClass || false;

        Array.from(modals).forEach((modal) => {
            this.setupModalRegistry(modal, noBodyClass);
        });

    }

    /**
     * Setup an object per found modal.
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
     * Bind all general events.
     */
    bindEvents() {

        Events.$on('modal::close', (event, data) => this.closeModal(event, data));
        Events.$on('modal::open', (event, data) => this.openModal(event, data));

        Events.$on('modal::register', (event, data) => this.onRegisterCustomModal(event, data));

    }

    /**
     * Bind all modal specific events.
     */
    bindModalEvents({ triggerBtn, closeBtn, id, noBodyClass }) {

        Array.from(triggerBtn).forEach(el => {

            el.addEventListener('click', () => {
                Events.$trigger('modal::open', {
                    data: { id, noBodyClass }
                });
            });

        });

        Array.from(closeBtn).forEach(el => {

            el.addEventListener('click', () => {
                Events.$trigger('modal::close', {
                    data: { id, noBodyClass }
                });
            });

        });

        // Close on ESCAPE_KEY
        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 27) { this.closeModal() }
        });

    }

    /**
     * Open modal by id.
     */
    openModal(event, data) {
        const modal = this.registeredModals[`modal-${data.id}`];

        if (!modal) { return; }

        // Add modal open class to html element if noBodyClass is false
        if(!data.noBodyClass){
            html.classList.add(MODAL_HTML_CLASS);
        }

        // Add tabindex and add visible class
        modal.el.setAttribute('tabindex', 1);
        modal.el.classList.add(MODAL_VISIBLE_CLASS);

    }

    /**
     * Close modal by id if none given close all.
     */
    closeModal(event, data) {

        // If no ID is given we will close all modals
        if (!data || !data.id) {

            for (const modalIndex of Object.keys(this.registeredModals)) {
                this.closeModal(null, {id:this.registeredModals[modalIndex].id});
            }

            return;
        }

        // Get current modal from all known modals
        const modal = this.registeredModals[`modal-${data.id}`];

        // If there is no modal do nothing
        if (!modal) { return; }

        // Remove modal open class off html element if noBodyClass is false
        if(!data.noBodyClass){
            html.classList.remove(MODAL_HTML_CLASS);
        }

        // Remove tabindex and remove visible class
        modal.el.setAttribute('tabindex', 0);
        modal.el.classList.remove(MODAL_VISIBLE_CLASS);

    }

}

export default new Modal();
