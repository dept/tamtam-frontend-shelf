
# Social sharing links

## Table of contents
1. [What does it do](#what-does-it-do)
2. [Install](#install)
3. [How to use](#how-to-use)
4. [Dependencies](#dependencies)
5. [Developers](#developers)


## What does it do
Listen to click events and open a native window popup with share dialogue. Always shares the current page url.<br>
Currently only supports Twitter, Facebook and Email.

## Install
```javascript
// Without enabling logging
import './src/modules/social-share';
```

## How to use
Create DOM elements (buttons) that trigger the share events.
```html
<button on:click.prevent="social-share::facebook">
    Share me on Facebook
</button>

<button on:click.prevent="social-share::twitter">
    Share me on the Twitters
</button>

<button on:click.prevent="social-share::email">
    Share me via E-mail
</button>
```

## Dependencies
* [Events component](/utilities/events/)

## Developers
* Jeroen Reumkens
