
# Javascript In-view libary

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Create and remove events and throttle them by using requestAnimationFrame

## Install
```node
npm i raf --save
```
```javascript
import RafThrottle from './src/modules/util/raf-throttle';
```

## How to use
### Import utility
```javascript

import RafThrottle from './src/modules/util/raf-throttle';

```

### Bind a new event

You can bind a new event on for instance window or document. Use a namespace to be able to remove it later.
```javascript
RafThrottle.set([
    { 
        element: window, 
        event: 'scroll.eventNamespace', 
        fn: () => exampleFunction(params) 
    }
]);

// Add event with an additional timeout in milliseconds
RafThrottle.set([
    { 
        element: window, 
        event: 'scroll.eventNamespace', 
        fn: () => exampleFunction(params), 
        delay: 1000 
    }
]);

```

### Remove a event

This will remove a previously bound event.
```javascript
RafThrottle.remove([
    { 
        element: window, 
        event: 'scroll.eventNamespace'
    }
]);

```

## Dependencies
* [RAF](https://www.npmjs.com/package/raf)
* [Events library](/utilities/events/)
* [Raf throttle library](/utilities/raf-throttle/)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
