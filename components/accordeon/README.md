
# Accordeon component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Creates an accordeon with multiple items
* Auto closes accordeon items when opening another one
* Triggers `opened` and `closed` event

## Install
```javascript
import moduleInit from './src/modules/util/module-init';
import './src/modules/util/events';
import './src/modules/accordeon';

moduleInit('[js-hook-accordeon]', Accordeon);
```

## How to use

### Default

Create an accordeon in html and add items.
```htmlmixed
{% import 'components/accordeon.html' as accordeon %}

{% call accordeon.default({
    autoclose: false // optional
}) %}

    {% call accordeon.item({
        "id" : "1",
        "title" : {
            "default" : "Open 1",
            "close" : "Close 1"
        },
        open: true
    }) %}

        Content 1

    {% endcall %}

    {% call accordeon.item({
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
Each accordeon item will trigger a generic `accordeon::opened` and `accordeon::closed` event. Containing the accordeon item and id
```javascript
// Accordeon has been opened
Events.$on('accordeon::opened', doSomething());

// Accordeon has been closed
Events.$on('accordeon::closed', doSomething());
```

## Dependencies
* [core-js/fn/array/from](https://www.npmjs.com/package/core-js) for IE11 support
* [Events library](/utilities/events/)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
