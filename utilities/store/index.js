import actions from './store/actions';
import mutations from './store/mutations';
import state from './store/state';
import Store from './store/store';

export default new Store({
  actions,
  mutations,
  state
});
