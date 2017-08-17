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

        Array.from(modals).forEach(modal => this.setupModalRegistry(modal));

        this.bindEvents();

    }

    /**
     * Bind event based on custom hook
     * @param event
     * @param data - { hook, nobodyClass }
     */
    customBind(event, data) {
<<<<<<< HEAD
        
        const modals = document.querySelectorAll(data.hook);
        const noBodyClass = data.noBodyClass || false;

        Array.from(modals).forEach((modal) => {
            this.setupModalRegistry(modal, noBodyClass);
        });
=======

        const modals = document.querySelectorAll(data.hook);
        const noBodyClass = data.noBodyClass || false;

        // Loop trough all found modals based on hook
        Array.from(modals).forEach(modal => this.setupModalRegistry(modal, noBodyClass));
>>>>>>> 3848ed5d5d6079ec5f1dc12990c82f5258a9490a

    }

    /**
     * Setup an object per found modal
     * @param el          - Single modalbox
     * @param noBodyClass - If set doesn't add class to body when modal is active
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
     * @param id          - Modal id
     * @param triggerBtn  - Button to open modal
     * @param closeBtn    - Button to close modal
     * @param noBodyClass - If set doesn't add class to body when modal is active
     */
<<<<<<< HEAD
    bindModalEvents({ triggerBtn, closeBtn, id, noBodyClass }) {

        Array.from(triggerBtn).forEach(el => {

            el.addEventListener('click', () => { Events.$trigger('modal::open', { id, noBodyClass }); });

        });

        Array.from(closeBtn).forEach(el => {

            el.addEventListener('click', () => { Events.$trigger('modal::close', { id, noBodyClass }); });

        });
=======
    bindModalEvents({ id, triggerBtn, closeBtn, noBodyClass }) {

        Array.from(triggerBtn).forEach(el => el.addEventListener('click', () => Events.$trigger('modal::open', { data: { id, noBodyClass } })));

        Array.from(closeBtn).forEach(el => el.addEventListener('click', () => Events.$trigger('modal::close', { data: { id, noBodyClass } })));
>>>>>>> 3848ed5d5d6079ec5f1dc12990c82f5258a9490a

        // Close on ESCAPE_KEY
        document.addEventListener('keyup', event => {
            if (event.keyCode == 27) { this.closeModal(); }
        });

    }

    /**
     * Open modal by given id
     * @param event
     * @param data - { id, noBodyClass }
     */
    openModal(event, data) {

        const modal = this.registeredModals[`modal-${data.id}`];

        if (!modal) { return; }

        // Add modal open class to html element if noBodyClass is false
<<<<<<< HEAD
        if(!data.noBodyClass){
=======
        if (!data.noBodyClass) {
>>>>>>> 3848ed5d5d6079ec5f1dc12990c82f5258a9490a
            html.classList.add(MODAL_HTML_CLASS);
        }

        // Add tabindex and add visible class
        modal.el.setAttribute('tabindex', 1);
        modal.el.classList.add(MODAL_VISIBLE_CLASS);

        Events.$trigger('focustrap::activate', { data: modal.el });

    }

    /**
     * Close modal by id, if none gives it will close all
     * @param event
     * @param data - { id, noBodyClass }
     */
    closeModal(event, data) {
<<<<<<< HEAD

        // Get current modal from all known modals
        const modal = this.registeredModals[`modal-${data.id}`];

        // If no ID is given we will close all modals
        if (!data.id) {

=======

        // If no ID is given we will close all modals
        if (!data || !data.id) {
>>>>>>> 3848ed5d5d6079ec5f1dc12990c82f5258a9490a
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
<<<<<<< HEAD
        if(!data.noBodyClass){
=======
        if (!data.noBodyClass) {
>>>>>>> 3848ed5d5d6079ec5f1dc12990c82f5258a9490a
            html.classList.remove(MODAL_HTML_CLASS);
        }

        // Remove tabindex and remove visible class
        modal.el.setAttribute('tabindex', 0);
        modal.el.classList.remove(MODAL_VISIBLE_CLASS);

        Events.$trigger('focustrap::deactivate');

    }

}

export default new Modal();