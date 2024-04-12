
# Accordion component
## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do
* Creates an accordion with multiple items
* Auto closes accordion items when opening another one
* Triggers `opened` and `closed` event

## Install
Import module
```javascript
import moduleInit from '@/utilities/module-init';
import '@/utilities/events';

moduleInit.async('[js-hook-accordion]', () => import('@/components/accordion'));
```

## How to use

### Default

Create an accordion in html and add items.
```htmlmixed
{% import 'accordion.html' as accordion %}

{% call accordion.default({
    autoclose: "true" //optional
}) %}

    {% call accordion.item({
        id : "acc1",
        title : "Open 1",
        open: true
    }) %}

       Content 1

    {% endcall %}

    {% call accordion.item({
        id : "acc2",
        title : "Open 2"
    }) %}

        Content 2

    {% endcall %}

{% endcall %}
```

Or create an accordion with tabs on desktop.
```htmlmixed
{% import 'accordion.html' as accordion %}

{% call accordion.default({
    autoclose: "true",
    tabsOnDesktop: [
    {
        label: 'Open 1',
        id: 'acctab1',
        active: true
    },
    {
        label: 'Open 2',
        id: 'acctab2'
    },
    ]
}) %}

    {% call accordion.item({
        id : "acctab1",
        title : "Open 1",
        open: true
    }) %}

        Content 1

    {% endcall %}

    {% call accordion.item({
        id : "acctab2",
        title : "Open 2"
    }) %}

        Content 2

    {% endcall %}

{% endcall %}
```

### Listen to events
Each accordion item will trigger a generic and specific `accordion::opened` and `accordion::closed` event.
```javascript
// accordion has been opened
Events.$on('accordion[{id}]::opened', doSomethingSpecific);

// accordion has been closed
Events.$on('accordion[{id}]::closed', doSomethingSpecific);
```

## Dependencies
* [moduleInit utility](/utilities/module-init.js) from the Dept Frontend Setup
* [Events utility](/utilities/events/)

## Developers
* [Adrian Klingen](mailto:adrian.klingen@deptagency.com)
* [Frank van der Hammen](mailto:frank.vanderhammen@deptagency.com)
