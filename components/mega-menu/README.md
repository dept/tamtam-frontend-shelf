
# Mega menu component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do
Add an accessible mega menu to your header

![Mega Menu Demo](https://media.giphy.com/media/cgdxJTC3dypYYF34lb/giphy.gif)

## Install
Import module
```javascript
moduleInit.async('[js-hook-mega-menu]', () => import(/* webpackChunkName: "MegaMenu" */'@components/mega-menu'));
```

## How to use

### Default

Import mega menu in HTML of header

```htmlmixed
<header class="c-header">
  <div class="o-container">
    <div class="u-flex u-flex-middle">
      <div class="header__logo">{% svg 'icons/logo' %}</div>
      <div class="header__mega-menu">{% include 'mega-menu.html' %}</div>
    </div>
  </div>
</header>

```


## Dependencies
* [DetectTouch utilitu](/utilities/detect-touch/)
* [Events utility](/utilities/events/)
* [Focus trap utility](/utilities/focus-trap/)
* [Screen Dimensions](/utilities/screen-dimensions/README.md)
* [Set tabindex of children utility](/utilities/set-tabindex-of-children)
* [Dom elements utility](/utilities/dom-elements)
* [lodash/debounce](https://www.npmjs.com/package/lodash.debounce)

## Developers
* [Daphne Smit](mailto:daphne.smit@deptagency.com)
