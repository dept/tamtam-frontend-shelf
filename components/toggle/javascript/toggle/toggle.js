import 'core-js/fn/array/from';

import Events from '../util/events';

const TOGGLE_ACTIVE_CLASS = 'toggle--is-active';

class Toggle {

    constructor(element) {

        this.element = element;
        this.id = element.id;
        this.links = this._getToggleLinks();
        this.activeClass = element.dataset.toggleActiveClass || TOGGLE_ACTIVE_CLASS;
        this.isActive = false;

        this._bindEvents();
        this._setDefaultState();

    }

    /**
     * Get all the external link elements from the toggle component
     */
    _getToggleLinks() {

        const ariaControls = this.element.getAttribute('aria-controls');
        if ( !ariaControls) {
            return [];
        }

        const LINKS_SELECTOR = ariaControls.split(/[ ,]+/)
            .map(id => `#${ id }`)
            .join(', ');

        return Array.from(document.querySelectorAll(LINKS_SELECTOR));

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
            this._toggleState();
            event.preventDefault();
        });

    }

    /**
     * Toggles the entire UI state of the toggle component
     */
    _toggleState() {

        if ( this.element.dataset.toggleLive === 'true' ) {
            this.links = this._getToggleLinks();
        }

        this._toggleActiveClassNames();
        this._setARIAAttributeValues();
        this._triggerExternalEvents();

    }

    /**
     * Sets default ARIA and classname roles based on config
     */
    _setDefaultState() {

        if ( this.element.dataset.toggleDefaultActive === 'true' ) {
            this._toggleState();
        }

        this._setARIAAttributeValues();

    }

    /**
     * Toggles all element classnames
     */
    _toggleActiveClassNames() {

        this._toggleToggleElementActiveState();
        this._toggleLinksClassNames();

    }

    /**
     * Toggles the active classname of the toggle component and toggles aria attribute
     */
    _toggleToggleElementActiveState() {

        this.element.classList.toggle(this.activeClass);
        this.isActive = this.element.classList.contains(this.activeClass);

    }

    /**
     * Toggles the active classname of the toggle components links
     */
    _toggleLinksClassNames() {

        const toggleAction = this.isActive ? 'add' : 'remove';
        this.links.forEach((link) => link.classList[toggleAction](this.activeClass));

    }

    /**
     * Toggles the ARIA attributes
     */
    _setARIAAttributeValues() {

        this.element.setAttribute('aria-expanded', this.isActive.toString());
        this.links.forEach((link) => link.setAttribute('aria-hidden', (!this.isActive).toString()));

    }

    /**
     * Triggers external events based on new state
     */
    _triggerExternalEvents() {

        const newState = this.isActive ? 'opened' : 'closed';
        Events.$trigger(`toggle::${ newState }(${ this.element.id })`);
        Events.$trigger(`toggle::toggled(${ this.element.id })`, { data: this.isActive });

    }

}

export default Toggle;
