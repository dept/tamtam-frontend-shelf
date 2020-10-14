
# Pagination

## Table of contents
1. [What does it do](#what-does-it-do)
2. [Install](#install)
3. [How to use](#how-to-use)
4. [Dependencies](#dependencies)
5. [Developers](#developers)

![Pagination Demo](./_demo/pagination.png)

## What does it do
* Renders range slider with min and max value
* The min and max value can be modified by using the input fields or the slider
* On smaller screens the slider is hidden because of the small buttons

## Install
```javascript
import moduleInit from '@utilities/module-init';
import '@utilities/events';

moduleInit.async('[js-hook-price-range]', () => import(/* webpackChunkName: "PriceRange" */ '@components/price-range'));
```

## How to use
Call the macro with optional `classes` object.
```htmlmixed
{% from 'range-slider.html' import rangeSlider %}

{{ rangeSlider({
    id: 'price-slider',
    rangeLabel: 'tot',
    currency: '€',
    minLabel: 'Minimum bedrag',
    min: 10,
    maxLabel: 'Maximum bedrag',
    max: 160
}) }}
```

## Dependencies
* [moduleInit utility](/utilities/module-init.js) from the Dept Frontend Setup
* [Events utility](/utilities/events/)
* [lodash/debounce](https://www.npmjs.com/package/lodash.debounce)


## Developers
* [Amanda van Noordenne](mailto:amanda.vannoordenne@deptagency.com)
