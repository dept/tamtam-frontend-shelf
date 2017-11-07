import 'core-js/fn/array/from';

import Events from '../util/events';

const TOGGLE_LINK_HOOK = 'js-hook-toggle-link';

class Toggle {

    constructor(element) {

        this.element = element;
        this.id = element.id;
        this.links = this._getToggleLinks();

        this._bindEvents();

    }

    /**
     * Get all the external link elements from the toggle component
     */
    _getToggleLinks() {

        const LINK_SELECTOR = `[${ TOGGLE_LINK_HOOK }="${ element.id }"]`;
        this.links = Array.from(document.querySelectorAll(LINK_SELECTOR));

    }

    /**
     * Bind all events
     */
    _bindEvents() {

        this.element.addEventListener('click', (event) => {
            Events.$trigger(`toggle::toggle(${ element.id })`);

            if ( this.element.dataset.togglePreventDefault ) {
                event.preventDefault();
            }
        });

        Events.$on(`toggle::toggle(${ element.id })`, (event) => {
            this._toggleActiveClassNames();
            this._triggerExternalEvents();
        });

    }

    /**
     * Toggles all element classnames
     */
    _toggleActiveClassNames() {

        this._toggleToggleElementClassName();
        this._toggleLinksClassNames();

    }

    /**
     * Toggles the active classname of the toggle component
     */
    _toggleToggleElementClassName() {

        this.element.classList.toggle('is--active');

    }

    /**
     * Toggles the active classname of the toggle components links
     */
    _toggleLinksClassNames() {

        if ( this.element.dataset.toggleLive === "true" ) {
            this.links = this._getToggleLinks();
        }

        this.links.forEach((link) => link.classList.toggle('is--active'));

    }

    /**
     * Triggers external events based on new state
     */
    _triggerExternalEvents() {

        const newState = this.element.classList.contains('is--active') ? 'opened' : 'closed';
        Events.$trigger(`toggle::${ nextState }(${ element.id })`);
        Events.$trigger(`toggle::toggled(${ element.id })`, nextState === 'opened');

    }

}

export default Toggle;
