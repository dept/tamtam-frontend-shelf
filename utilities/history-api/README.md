
# DOM Elements

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Listens for events to update the url on history with push state / replace state.

## Install
```javascript
import './src/modules/util/history.js';
```

## How to use
### Trigger push state or replace state from anywhere in your site.
```javascript

Events.$trigger('history::push', {
    data: '/your-new-url'
});

Events.$trigger('history::replace', {
    data: '/your-new-url'
});

```

## Dependencies
* [Events library](/utilities/events/)

## Developers
* [Jeroen Reumkens](mailto:jeroen.reumkens@tamtam.nl)
