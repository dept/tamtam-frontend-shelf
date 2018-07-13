
# Accordion component
## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

![Accordion Demo](https://media.giphy.com/media/DAFNXViloWqVspasDJ/giphy.gif)

## What does it do
* Creates an accordion with multiple items
* Auto closes accordion items when opening another one
* Triggers `opened` and `closed` event

## Install
Import module
```javascript
import moduleInit from '@utilities/module-init';
import '@utilities/events';

moduleInit.async('[js-hook-accordion]', () => import(/* webpackChunkName: "Accordion" */'@components/accordion'));
```

## How to use

### Default

Create an accordion in html and add items.
```htmlmixed
{% import 'accordion.html' as accordion %}

{% call accordion.default({
    autoclose: false // optional
}) %}

    {% call accordion.item({
        "id" : "1",
        "title" : {
            "default" : "Open 1",
            "close" : "Close 1"
        },
        open: true
    }) %}

        Content 1

    {% endcall %}

    {% call accordion.item({
        "id" : "2",
        "title" : {
            "default" : "Open 2",
            "close" : "Close 2"
        }
    }) %}

        Content 2

    {% endcall %}

{% endcall %}

```

### Listen to events
Each accordion item will trigger a generic and specific `accordion::opened` and `accordion::closed` event.
```javascript
// accordion has been opened
Events.$on('accordion::opened', doSomething);
Events.$on('accordion[{id}]::opened', doSomethingSpecific);

// accordion has been closed
Events.$on('accordion::closed', doSomething);
Events.$on('accordion[{id}]::closed', doSomethingSpecific);
```

## Dependencies
* [moduleInit utility](https://bitbucket.org/tamtam-nl/tamtam-frontend-setup/src/master/source/utilities/module-init.js) from the TamTam Frontend Setup
* [Events utility](/utilities/events/)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
