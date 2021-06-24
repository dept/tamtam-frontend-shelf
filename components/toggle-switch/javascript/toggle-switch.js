import Events from '@utilities/events'

class ToggleSwitch {
    constructor(element) {
        this.element = element
        this.bindEvents();
    }

    bindEvents() {
        this.element.addEventListener('change', (event) => {
            if (event.target.checked) {
                Events.$trigger('toggle-switch::checked')
            } else {
                Events.$trigger('toggle-switch::unchecked')
            }
        })
    }
}

export default ToggleSwitch
