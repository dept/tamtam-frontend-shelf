import Events from '../events';

class FocusTrap {

    constructor() {

        this.activated = null;
        this.focusTrapElement = null;
        this.originalFocus = null;
        this.bindEvents();

    }

    bindEvents() {

        /**
         *  Bind event listeners so other function can invoke the trap.
         */
        Events.$on('focustrap::activate', (event, data) => this.activate(data));
        Events.$on('focustrap::deactivate', () => this.deactivate());

        /**
         * The document has an event handler to check the focus
         * This only triggers the trap when it's activated.
         */
        document.addEventListener('focus', event => {

            if (this.activated && this.focusTrapElement) {
                Events.$trigger('focustrap::trap', { data: event.target });
            }

        }, true);

        /**
         * The document also has a trap event which is only called when the trap is active
         * And the element is set.
         * On event it will check if the focused element is inside the trap and if not, it will reset to the trap.
         */
        Events.$on('focustrap::trap', (event, data) => {

            if (!this.focusTrapElement.contains(data)) {
                this.focusClosestFocusTarget();
            }

        });

    }

    /**
     * Public method to change the trap
     * @param {Object} data Target to set as trap element
     * @param {HTMLElement} data[].element Target to set as trap element
     * @param {Boolean} [data[].autoFocus] If true, on activation the element finds and auto focuses the first focusable element
     */
    activate(data) {

        this.activated = true;
        this.focusTrapElement = data.element;
        this.originalFocus = document.activeElement;

        if (data.autoFocus) {
            this.focusClosestFocusTarget();
        }

    }

    /**
     * Finds and focuses the first focusable element inside the trap
     */
    focusClosestFocusTarget() {

        const focusTarget = findClosestFocusTarget(this.focusTrapElement);
        focusTarget.focus();

    }

    /**
     * Public method to cancel the trap
     */
    import Events from '../events';

class FocusTrap {

    constructor() {

        this.activated = null;
        this.focusTrapElement = null;
        this.originalFocus = null;
        this.bindEvents();

    }

    bindEvents() {

        /**
         *  Bind event listeners so other function can invoke the trap.
         */
        Events.$on('focustrap::activate', (event, data) => this.activate(data));
        Events.$on('focustrap::deactivate', () => this.deactivate());

        /**
         * The document has an event handler to check the focus
         * This only triggers the trap when it's activated.
         */
        document.addEventListener('focus', event => {

            if (this.activated && this.focusTrapElement) {
                Events.$trigger('focustrap::trap', { data: event.target });
            }

        }, true);

        /**
         * The document also has a trap event which is only called when the trap is active
         * And the element is set.
         * On event it will check if the focused element is inside the trap and if not, it will reset to the trap.
         */
        Events.$on('focustrap::trap', (event, data) => {

            if (!this.focusTrapElement.contains(data)) {
                this.focusClosestFocusTarget();
            }

        });

    }

    /**
     * Public method to change the trap
     * @param {HTMLElement} element Target to set as trap element
     * @param {Boolean} autoFocus If true, on activation the element finds and auto focuses the first focusable element
     */
    activate(element, autoFocus = true) {

        this.activated = true;
        this.focusTrapElement = element;
        this.originalFocus = document.activeElement;

        if (autoFocus) {
            this.focusClosestFocusTarget();
        }

    }

    /**
     * Finds and focuses the first focusable element inside the trap
     */
    focusClosestFocusTarget() {

        const focusTarget = findClosestFocusTarget(this.focusTrapElement);
        focusTarget.focus();

    }

    /**
     * Public method to cancel the trap
     */
    deactivate() {

        this.activated = false;
        this.focusTrapElement = false;
        if (this.originalFocus) {
            this.originalFocus.focus();
        }

    }

}

/**
 * Finds the closets focusable target
 * @param focus element
 * @return { Object }
 */
function findClosestFocusTarget(el) {
    const elements = el.querySelectorAll('a, area, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe');
    return (elements.length) ? elements[0] : el;
}

export default new FocusTrap();


}

/**
 * Finds the closets focusable target
 * @param focus element
 * @return { Object }
 */
function findClosestFocusTarget(el) {
    const elements = el.querySelectorAll('a, area, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe');
    return (elements.length) ? elements[0] : el;
}

export default new FocusTrap();
