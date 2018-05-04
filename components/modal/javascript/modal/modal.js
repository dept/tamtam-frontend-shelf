import Events from '@utilities/events';

const html = document.documentElement;

const MODAL_HOOK = '[js-hook-modal]';
const MODAL_CLOSE_HOOK = '[js-hook-button-modal-close]';
const MODAL_VISIBLE_CLASS = 'modal--is-showing';
const MODAL_HTML_CLASS = 'is--modal-open';


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
     */
    customBind(event, data) {

        const modals = document.querySelectorAll(data.hook);

        // Loop trough all found modals based on hook
        Array.from(modals).forEach(modal => this.setupModalRegistry(modal));

    }

    /**
     * Setup an object per found modal
     * @param {HTMLElement} el Single modalbox
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
     */
    bindModalEvents({ el, id, triggerBtn, closeBtn }) {

        Array.from(triggerBtn).forEach(triggerEl => triggerEl.addEventListener('click', () => {
            if (el.modalIsOpen) {
                Events.$trigger('modal::close', { data: { id } });
                Events.$trigger(`modal[${id}]::close`, { data: { id } });
            } else {
                Events.$trigger('modal::open', { data: { id } });
                Events.$trigger(`modal[${id}]::open`, { data: { id } });
            }
        }));

        Events.$on(`modal[${id}]::close`, () => this.closeModal(event, { id }));
        Events.$on(`modal[${id}]::open`, () => this.openModal(event, { id }));

        Array.from(closeBtn).forEach(el => el.addEventListener('click', () => {
            Events.$trigger('modal::close', { data: { id } });
            Events.$trigger(`modal[${id}]::close`, { data: { id } });
        }));

        // Close on ESCAPE_KEY
        document.addEventListener('keyup', event => {
            if (event.keyCode === 27) {
                Events.$trigger('modal::close');
            }
        });

    }

    /**
     * Open modal by given id
     * @param {Event} event
     * @param {Object[]} data
     * @param {string} data[].id
     */
    openModal(event, data) {

        const modal = this.registeredModals[`modal-${data.id}`];

        if (!modal) { return; }

        const autoFocus = modal.el.dataset.modalAutoFocus === 'true';
        const noBodyClass = modal.el.dataset.modalNoBodyClass === 'true';
        const closeAllOthers = modal.el.dataset.modalCloseAllOthers === 'true';

        // Add modal open class to html element if noBodyClass is false
        if (!noBodyClass) {
            html.classList.add(MODAL_HTML_CLASS);
        }

        if (closeAllOthers) {
            Object.keys(this.registeredModals)
                .filter(key => this.registeredModals[key].id !== data.id)
                .map(id => {
                    const _modal = this.registeredModals[id];
                    if (_modal.el.modalIsOpen) {
                        Events.$trigger(`modal[${_modal.id}]::close`, { data: { id: _modal.id } });
                    }
                });
        }

        // Add tabindex and add visible class
        modal.el.setAttribute('tabindex', 1);
        modal.el.classList.add(MODAL_VISIBLE_CLASS);
        modal.el.modalIsOpen = true;

        Events.$trigger('focustrap::activate', {
            data: {
                element: modal.el,
                autoFocus
            }
        });

    }

    /**
     * Close modal by id, if none gives it will close all
     * @param {Event} event
     * @param {Object[]} data
     * @param {string} data[].id
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

        const noBodyClass = modal.el.dataset.modalNoBodyClass === 'true';

        // Remove modal open class off html element if noBodyClass is false
        if (!noBodyClass) {
            html.classList.remove(MODAL_HTML_CLASS);
        }

        // Remove tabindex and remove visible class
        modal.el.setAttribute('tabindex', 0);
        modal.el.classList.remove(MODAL_VISIBLE_CLASS);
        modal.el.modalIsOpen = false;

        Events.$trigger('focustrap::deactivate');

    }

}

export default new Modal();
