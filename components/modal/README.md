
# Modal component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Create modalboxes with an easy to use macro.
* Open and close modalboxes.
* Bind custom events to DOM elements that should have modalbox behavior. (ie. Open and Close)

## Install
```javascript
import './src/modules/util/focus-trap';
import './src/modules/modal';
```

## How to use

### Default

Create modalbox in HTML.
```htmlmixed
{% from 'components/modal.html' import modal  %}

{% call modal({
    id : 'modal-example'
}) %}

    Your content here.

{% endcall %}

<button type="button" aria-controls="modal-example" aria-title="Open modalbox">
    Open example modalbox
</button>

```

### Custom

Custom html element
```htmlmixed
<div id="modal-custom">
    I am a custom modalbox

    <button type="button" js-hook-button-modal-close aria-title="Close modalbox">
        Close
    </button>
</div>

<button type="button" aria-controls="modal-custom" aria-title="Open modalbox">
    Open example modalbox
</button>

```

Bind custom html element to modal.
```javascript
Events.$trigger('modal::bind', '#modal-custom');
```

## Dependencies
* [core-js/fn/array/from](https://www.npmjs.com/package/core-js) for IE11 support
* [Events library](/utilities/events/)
* [Focus trap utility](/utilities/focus-trap/)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
* [Jeroen Reumkens (co author)](mailto:jeroen.reumkens@tamtam.nl)