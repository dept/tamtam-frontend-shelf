
# Javascript In-view libary

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Trigger when element enters viewport

## Install

```javascript
import './src/modules/util/in-view';
```

## How to use

### Bind inview on element

You can add the `js-hook-inview` attribute to an element. Inview will automatically detect it on window load.
```html

<div js-hook-inview>

    Track me

</div>

```

### Add options to element

You can add the following options:
* `offset` must be a number. Will allow you to trigger an element later or earlier.
* `threshold` must be a value between 0 and 1. Will allow you to specify how far the element has to be in view before it will trigger.
* `triggers` must be a string. When element is in view it will fire the events, can be multiple events seperated by comma.

```html

<div js-hook-inview
    data-inview-offset-top="100"
    data-inview-offset-bottom="100"
    data-inview-offset-left="100"
    data-inview-offset-right="100"
    data-inview-threshold="0.5"
    data-inview-persistent="true"
    data-inview-trigger="event::example, event2::example">

    Track me

</div>

```

### Manually trigger element update
You can manually trigger an in-view update ie. after lazyloading new elements into the DOM

```javascript

import Events from './src/modules/util/events';

Events.$trigger('in-view::update');

```

## Dependencies
* [RAF](https://www.npmjs.com/package/raf)
* [Events library](/utilities/events/)
* [Raf throttle library](/utilities/raf-throttle/)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
