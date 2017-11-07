import 'core-js/fn/array/from';

import Events from '../util/events';
Events.logging = true;

const TOGGLE_LINK_HOOK = 'js-hook-toggle-link';
const TOGGLE_ACTIVE_CLASS = 'is--active';

class Toggle {

    constructor(element) {

        this.element = element;
        this.id = element.id;
        this.links = this._getToggleLinks();
        this.activeClass = element.dataset.toggleActiveClass || TOGGLE_ACTIVE_CLASS;

        this._bindEvents();

    }

    /**
     * Get all the external link elements from the toggle component
     */
    _getToggleLinks() {

        const LINK_SELECTOR = `[${ TOGGLE_LINK_HOOK }="${ this.element.id }"]`;
        return Array.from(document.querySelectorAll(LINK_SELECTOR));

    }

    /**
     * Bind all events
     */
    _bindEvents() {

        this.element.addEventListener('click', (event) => {
            Events.$trigger(`toggle::toggle(${ this.element.id })`);

            if ( this.element.dataset.togglePreventDefault ) {
                event.preventDefault();
            }
        });

        Events.$on(`toggle::toggle(${ this.element.id })`, (event) => {
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

        this.element.classList.toggle(this.activeClass);

    }

    /**
     * Toggles the active classname of the toggle components links
     */
    _toggleLinksClassNames() {

        if ( this.element.dataset.toggleLive === 'true' ) {
            this.links = this._getToggleLinks();
        }

        const toggleAction = this.element.classList.contains(this.activeClass) ? 'add' : 'remove';
        this.links.forEach((link) => link.classList[toggleAction](this.activeClass));

    }

    /**
     * Triggers external events based on new state
     */
    _triggerExternalEvents() {

        const newState = this.element.classList.contains(this.activeClass) ? 'opened' : 'closed';
        Events.$trigger(`toggle::${ newState }(${ this.element.id })`);
        Events.$trigger(`toggle::toggled(${ this.element.id })`, newState === 'opened');

    }

}

export default Toggle;
