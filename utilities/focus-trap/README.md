# Focus trap utility

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* After the acivation hook, the focus stays inside the supplied element

## Install

```javascript
import './src/modules/util/focus-trap';
```

## How to use

### Activate focustrap

In the component, call the focustrap::activate event to set the trap.

```javascript

Events.$trigger('focustrap::activate', {
    data: {
        element: document.querySelector('my-focus-trap-element')
    }
});

```

### Deactivate

Whenever the component leaves its active state, call focustrap::deactivate to remove the trap and return to its
original focus.

```javascript

Events.$trigger('focustrap::deactivate');

```

### Add options to element

You can add the following options:
* `autoFocus` must be a boolean. If true, on activation the first focusable element will be auto focussed. Default true.

```javascript

Events.$trigger('focustrap::activate', {
    data: {
        element: document.querySelector('my-focus-trap-element'),
        autoFocus: false
    }
});

```

## Dependencies
* [Events library](/utilities/events/)

## Developers
* [Daphne Smit](mailto:daphne@tamtam.nl)
* [Adrian Klingen (co author)](mailto:adrian@tamtam.nl)
