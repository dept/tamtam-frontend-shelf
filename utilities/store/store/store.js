import PubSub from '../lib/pubsub.js';

class Store {
    constructor(params) {
        // Add some default objects to hold our actions, mutations and state
        // Look in the passed params object for actions and mutations
        // that might have been passed in
        this.actions = params.actions || {};
        this.mutations = params.mutations || {};
        this.state = {};

        // A status enum to set during actions and mutations
        this.status = 'resting';

        // Attach our PubSub module as an `events` element
        this.events = new PubSub();

        // Set our state to be a Proxy. We are setting the default state by
        // checking the params and defaulting to an empty object if no default
        // state is passed in
        const self = this;
        this.state = new Proxy(params.state || {}, {
            set(state, key, value) {
                state[key] = value;

                console.log(`stateChange: ${key}: ${value}`);

                self.events.publish('stateChange', self.state);

                if (self.status !== 'mutation') {
                    console.warn(`You should use a mutation to set ${key}`);
                }

                self.status = 'resting';

                return true;
            }
        });
    }

    /**
     * A dispatcher for actions that looks in the actions
     * collection and runs the action if it can find it
     *
     * @param {string} actionKey
     * @param {mixed} payload
     * @returns {boolean}
     * @memberof Store
     */
    dispatch(actionKey, payload) {
        if (typeof this.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey} doesn't exist.`);
            return false;
        }

        console.groupCollapsed(`ACTION: ${actionKey}`);

        this.status = 'action';
        this.actions[actionKey](this, payload);

        console.groupEnd();

        return true;
    }

    /**
     * Look for a mutation and modify the state object
     * if that mutation exists by calling it
     *
     * @param {string} mutationKey
     * @param {mixed} payload
     * @returns {boolean}
     * @memberof Store
     */
    commit(mutationKey, payload) {
        if (typeof this.mutations[mutationKey] !== 'function') {
            console.log(`Mutation "${mutationKey}" doesn't exist`);
            return false;
        }

        this.status = 'mutation';
        const newState = this.mutations[mutationKey](this.state, payload);
        this.state = Object.assign(this.state, newState);

        return true;
    }
}

export default Store;
