import Store from '../store/store';

class Component {
    constructor(props = {}) {
        this.render = this.render || function() {};

        if (props.store instanceof Store) {
            props.store.events.subscribe('stateChange', () => {
                this.render();
                this.bindEvents();
            });
        }

        if (props.element) {
            this.element = props.element;
        }
    }
}
export default Component;
