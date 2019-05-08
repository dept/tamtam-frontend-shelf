import Store from '../store/store';

class Component {
  constructor(props = {}) {
    this.render = this.render || function() {};

    if (props.store instanceof Store) {
      // This fires every time the state updates
      props.store.subscribe(state => {
        if (typeof this.stateChanged === 'function') {
          this.stateChanged(state);
        }
      });
    }

    if (props.element) {
      this.element = props.element;
    }
  }
}
export default Component;
