
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
import './src/modules/modal';
```

## How to use

### Default modal
#### Add to page

Create modalbox in HTML.
```htmlmixed
{% from 'components/modal.html' import modal  %}

{% call modal({
    id : 'modal-example'
}) %}

    Your content here.

{% endcall %}
```
Add a button to trigger the modal
```htmlmixed
<button type="button" aria-controls="modal-example" aria-title="Open modalbox">
    Open example modalbox
</button>
```
#### Toggle modal via JS
```
Events.$trigger('modal::open', {
    data: {id: 'modal-example'}
});

Events.$trigger('modal::close', {
    data: {id: 'modal-example'}
});

// If you don't pass any parameters to the close event, all open modals are closed.
Events.$trigger('modal::close');
```


### Custom modal
#### Add to page
You might want to register a custom element element which behaves just like a normal modal. 
You can do this by adding this new html element including trigger to the DOM, and register it
on the Modal class.

```htmlmixed
<div id="modal-custom">
    I am a custom modalbox

    <button type="button" data-js-hook="button-modal-close" aria-title="Close modalbox">
        Close
    </button>
</div>

<button type="button" aria-controls="modal-custom" aria-title="Open modalbox">
    Open custom modalbox
</button>

```

#### Register custom modal via JS
```javascript
const registerOptions = {
    selector: '#modal-custom',  // required
    noBodyClass: false          // optional
};

Events.$trigger('modal::register', registerOptions);
// or
Modal.registerCustomModal(registerOptions);
```

#### Open custom modal via JS
Opening of the modal is the same as for the normal modals.

## Dependencies
* [core-js/fn/array/from](https://www.npmjs.com/package/core-js) for IE11 support
* [Events component](/utilities/events/)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
* [Jeroen Reumkens (co author)](mailto:jeroen.reumkens@tamtam.nl)
