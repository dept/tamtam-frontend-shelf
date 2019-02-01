
# Sanitise type 'number'inputs

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Cleans input type="number" fields from anything other than numerals. Prevents characters that are not numerals from being typed or copy pasted as well.

## Install
Init utility
```javascript
moduleInit.async('input[type="number"]', () =>
  import(/* webpackChunkName: "js/NumberInput" */ '@utilities/number-input'),
);
```

## Dependencies
This package doesn't not have any dependencies.

## Developers
* [Matt van Voorst](mailto:matt.vanvoorst@deptagency.com)
