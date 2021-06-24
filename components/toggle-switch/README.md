
# Toggle switch component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do
* Simple UI toggle switch with Event triggers

## Install
Import module
```javascript
import moduleInit from '@utilities/module-init';
import '@utilities/events';

moduleInit.async('[js-hook-toggle-switch]', () => import(/* webpackChunkName: "Toggle" */'@components/toggle-switch'));
```

## How to use

### Default
```
{{ toggleSwitch() }}
```

### States 
```html
<!-- Disabled -->
{{ toggleSwitch({
    disabled: true
}) }}

<!-- Checked -->
{{ toggleSwitch({
    checked: true
}) }}

<!-- Disabled & checked -->
{{ toggleSwitch({
    disabled: true,
    checked: true
}) }}
```

### Listen to events
There are 2 different events to trigger the component externally:
``` javascript
// Triggers when switch is checked
Events.$trigger('toggle-switch::checked')

// Triggers when switch is unchecked
Events.$trigger('toggle-switch::unchecked')
```

## Dependencies
* [moduleInit utility](/utilities/module-init.js) 
* [Events utility](/utilities/events/)

## Developers
* [Peppe-Quint Boogaard](mailto:peppe-quint.boogaard@deptagency.com)