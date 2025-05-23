# Toggle component

## Table of contents

1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do

- Basic generic toggle functionality that is used solely for triggering active classes
- Use cases: simple dropdown, toggle switch, hamburger switch

## Install

Import module

```javascript
import moduleInit from '@/utilities/module-init'
import '@/utilities/events'

moduleInit.async('[js-hook-toggle]', () => import('@/components/toggle'))
```

## How to use

### Default

Add the js-hook-toggle attribute to any HTML you like:

```htmlmixed
<button class="c-toggle-button"
    js-hook-toggle
    data-toggle-default-active="true"
    data-toggle-active-class="is--custom-active-class-state">
    ...
</button>
```

On click, this will toggle the classname specified in the `data-toggle-active-class` attribute (defaults to `toggle--is-active`)
on this particular element.

### Toggle links

Additionally, on any place in the DOM, you can have elements listen to the active state of this toggle component.
All there is to do is add `aria-controls` with the id(s) (comma separated) of the toggle as parameter:

```htmlmixed
<button class="c-toggle-button"
    js-hook-toggle
    aria-controls="totally-different-component-id">
    ...
</button>

<div class="c-totally-different-component"
    id="totally-different-component-id">
    ...
</div>
```

### Live

If you are working with dynamically added DOM elements, you can set an additional parameter on the toggle component
to "live" listen to its links. By default, for performance reasons, this feature is disabled.

```htmlmixed
<button class="c-toggle-button"
    id="this-specific-toggle-button"
    js-hook-toggle
    data-toggle-live="true">
    ...
</button>
```

### Listen to events

If some other JS component is depending on the active state event of the toggle component, there is an option
to externally listen to that event:

```javascript
// toggle has been opened
Events.$on('toggle[{id}]::opened', doSomethingAfterToggleOpened)

// toggle has been closed
Events.$on('toggle[{id}]::closed', doSomethingAfterToggleClosed)

// toggle has been toggled
Events.$on('toggle[{id}]::toggled', (event, isActive) => doSomethingAfterToggleToggled(isActive))
```

### Trigger event

Vice versa, the toggle component can be triggered externally as well:

```javascript
// trigger specific toggle component
Events.$trigger('toggle[{id}]::toggle')
```

or inline with HTML attributes

```htmlmixed
<button class="c-i-am-a-button" on:click.id-specific="toggle[this-specific-toggle-button]::toggle">
    ...
</button>
```

## Dependencies

- [moduleInit utility](https://bitbucket.org/tamtam-nl/tamtam-frontend-setup/src/source/javascript/src/modules/util/module-init.js) from the Dept Frontend Setup
- [Events utility](/utilities/events/)

## Developers

- [Kees van Lierop](mailto:kees.vanlierop@deptagency.com)
