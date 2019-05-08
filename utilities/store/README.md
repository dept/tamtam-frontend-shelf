# Store utility for state management

## Table of contents

1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do

Build a state management system with vanilla JavaScript.
Inspired by this [css tricks article](https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/).

## Install

Import modules in your component/class

```javascript
import Component from '@utilities/store/lib/component';
import store from '@utilities/store';
```

## How to use

### Add a component

Extend the base component for each new component you make that needs to use the store.
Below you will find an example component.
This is a list of items, you can remove an item

```javascript
class MyComponent extends Component {
    // Pass our store instance and the HTML element up to the parent Component
    // The element you already have through moduleInit of MyComponent
    constructor(element) {
        super({
            store,
            element
        });
    }

    // Find all the buttons in the list and when they are clicked, we dispatch a
    // `clearItem` action which we pass the current item's index to
    bindEvents() {
        this.element.querySelectorAll('button').forEach((button, index) => {
            button.addEventListener('click', () => {
                store.dispatch('clearItem', { index });
            });
        });
    }

    updateElement(html) {
        this.element.innerHTML = html;
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        // If there are no items to show, render a little status instead
        if (store.state.items.length === 0) {
            return this.updateElement(`<p>You've done nothing yet 😢</p>`);
        }

        // Loop the items and generate a list of elements
        return this.updateElement(`
            <ul>
                ${store.state.items
                    .map(item => {
                        return `
                        <li>${item} <button aria-label="Delete this item">×</button></li>
                    `;
                    })
                    .join('')}
            </ul>
        `);
    }
}

export default MyComponent;
```

### Adding an action

You can mutate the state by dispatching an action and create a mutation in mutations.js.

-   add an action in actions.js
-   add a mutation in mutations.js

```javascript
store.dispatch('nameOfAction', value);
```

## Dependencies

This package doest not have any dependencies.

## Developers

-   [Daphne Smit](mailto:daphne.smit@deptagency.com)
