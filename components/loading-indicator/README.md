# Loading indicator utility

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* After calling the event, show a full page loader or append the loader to a smaller container element
* Only one loader can be active at a time

## Install
Import module
```javascript
import '@components/loading-indicator';
```

## How to use

In the component, call the loader::show event to append and active the full page loader.

```javascript
Events.$trigger('loader::show');
```
<br/>

Options can also be passed to the event to toggle a light themed loader, or to append the loader to an element as alternative to the full page loader. A string can be passed to add additional classes to the loader. 

```javascript
Events.$trigger('loader::show', {
  data: {
    targetElement: foo,
    classes: 'bar',
    lightTheme: true,
  },
});
``` 

<br/>

Hide and remove the loader.

```javascript
Events.$trigger('loader::hide');
```

## Dependencies
* [Events utility](/utilities/events/)

## Developers
* [Matt van Voorst](mailto:matt.vanvoorst@deptagency.com)
* [Daphne Smit (co author)](mailto:daphne.smit@deptagency.com)
