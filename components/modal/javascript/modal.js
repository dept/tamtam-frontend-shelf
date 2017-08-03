import 'core-js/fn/array/from';

import $ from 'jquery';
import Events from './util/events';
import { $document, $html } from './util/dom-elements';

const MODAL_HOOK = '[data-js-hook="modal"]';
const VISIBLE_CLASS = 'is--showing';

class Modal {

    constructor() {

        this.registeredModals = {};

        const modals = document.querySelectorAll(MODAL_HOOK);

        Array.from(modals).forEach((modal) => {
            this.setupEvents($(modal));
        });

        this.bindEvents();

    }

    customBind(event, CUSTOM_HOOK) {

        const modals = document.querySelectorAll(CUSTOM_HOOK);

        Array.from(modals).forEach((modal) => {
            this.setupEvents($(modal));
        });

    }

    setupEvents($el) {

        const id = $el.attr('id');
        const $triggerBtn = $(`[aria-controls=${id}]`);
        const $closeBtn = $el.find('[data-js-hook="button-modal-close"]');

        const modal = {
            $el,
            id,
            $triggerBtn,
            $closeBtn
        };

        this.registeredModals[`modal-${id}`] = modal;

        this.bindModalEvents(modal);
    }

    bindEvents() {

        Events.$on('modal::close', (event, id) => this.closeModal(event, id));
        Events.$on('modal::open', (event, id) => this.openModal(event, id));

        Events.$on('modal::bind', (event, CUSTOM_HOOK) => this.customBind(event, CUSTOM_HOOK));

        $('[data-js-hook="button-modal-open"]').on('click', event => Events.$trigger('modal::open', $(event.currentTarget).attr('id')));

    }

    bindModalEvents({ $triggerBtn, $closeBtn, id }) {

        $triggerBtn.on('click', () => { Events.$trigger('modal::open', id); });
        $closeBtn.on('click', () => { Events.$trigger('modal::close', id); });

        // Close on ESCAPE_KEY
        $document.on('keyup', (event) => {
            if (event.keyCode == 27) { this.closeModal() }
        });

    }

    openModal(event, id) {

        const modal = this.registeredModals[`modal-${id}`];

        if (!modal) { return; }

        $html.addClass('is--modal-open');

        modal.$el
            .attr('tabindex', 1)
            .addClass(VISIBLE_CLASS);

    }

    closeModal(event, id) {

        const modal = this.registeredModals[`modal-${id}`];

        // If no ID is given, all of them are closed <3
        if (!id) {

            for (const modalIndex of Object.keys(this.registeredModals)) {
                this.closeModal(null, this.registeredModals[modalIndex].id);
            }

            return;
        }

        if (!modal) { return; }

        $html.removeClass('is--modal-open');

        modal.$el
            .attr('tabindex', 0)
            .removeClass(VISIBLE_CLASS);

    }

}

export default new Modal();