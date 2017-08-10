import 'core-js/fn/array/from';

import Events from './util/events';

const html = document.documentElement;

const MODAL_HOOK = '[data-js-hook="modal"]';

const MODAL_VISIBLE_CLASS = 'modal--is-showing';
const MODAL_HTML_CLASS = 'is--modal-open';

const MODAL_CLOSE_HOOK = '[data-js-hook="button-modal-close"]';


class Modal {

    constructor() {

        this.registeredModals = {};

        const modals = document.querySelectorAll(MODAL_HOOK);

        Array.from(modals).forEach((modal) => {
            this.setupModalRegistry(modal);
        });

        this.bindEvents();

    }

    /**
     * Bind modals by custom hook
     *
     */
    customBind(event, CUSTOM_HOOK) {

        const modals = document.querySelectorAll(CUSTOM_HOOK);

        Array.from(modals).forEach((modal) => {
            this.setupModalRegistry(modal);
        });

    }

    /**
     * Setup an object per found modal
     *
     */
    setupModalRegistry(el) {

        const id = el.getAttribute('id');

        const triggerBtn = document.querySelectorAll(`[aria-controls=${id}]`);
        const closeBtn = el.querySelectorAll(MODAL_CLOSE_HOOK);

        const modal = {
            el,
            id,
            triggerBtn,
            closeBtn
        };

        this.registeredModals[`modal-${id}`] = modal;

        this.bindModalEvents(modal);
    }

    /**
     * Bind all general events
     *
     */
    bindEvents() {

        Events.$on('modal::close', (event, id) => this.closeModal(event, id));
        Events.$on('modal::open', (event, id) => this.openModal(event, id));

        Events.$on('modal::bind', (event, CUSTOM_HOOK) => this.customBind(event, CUSTOM_HOOK));

    }

    /**
     * Bind all modal specific events
     *
     */
    bindModalEvents({ triggerBtn, closeBtn, id }) {

        Array.from(triggerBtn).forEach((el) => el.addEventListener('click', () => Events.$trigger('modal::open', id)) );

        Array.from(closeBtn).forEach((el) => el.addEventListener('click', () => Events.$trigger('modal::close', id)) );

        // Close on ESCAPE_KEY
        document.addEventListener('keyup', event => {
            if (event.keyCode == 27) { this.closeModal() }
        });

    }

    /**
     * Open modal by id
     *
     */
    openModal(event, id) {

        const modal = this.registeredModals[`modal-${id}`];

        if (!modal) { return; }

        html.classList.add(MODAL_HTML_CLASS);

        modal.el.setAttribute('tabindex', 1)
        modal.el.classList.add(MODAL_VISIBLE_CLASS);

        Events.$trigger('focustrap::activate', { data: modal.el });

    }

    /**
     * Close modal by id if none given close all
     *
     */
    closeModal(event, id) {

        // Get current modal from all known modals
        const modal = this.registeredModals[`modal-${id}`];

        // If no ID is given we will close all modals
        if (!id) {

            for (const modalIndex of Object.keys(this.registeredModals)) {
                this.closeModal(null, this.registeredModals[modalIndex].id);
            }
            Events.$trigger('focustrap::deactivate');
            return;
        }

        // If there is no modal do nothing
        if (!modal) { return; }

        // Remove modal open class off html element
        html.classList.remove(MODAL_HTML_CLASS);

        // Remove tabindex and remove visible class
        modal.el.setAttribute('tabindex', 0)
        modal.el.classList.remove(MODAL_VISIBLE_CLASS);

        Events.$trigger('focustrap::deactivate');

    }

}

export default new Modal();