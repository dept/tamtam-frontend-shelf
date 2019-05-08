import Store from '../store/store';

class Component {
  constructor(props = {}) {
    this.stateChanged = this.stateChanged || function() {};

    if (props.store instanceof Store) {
      // This fires every time the state updates
      props.store.subscribe(state => this.stateChanged(state));
    }

    if (props.element) {
      this.element = props.element;
    }
  }
}
export default Component;
