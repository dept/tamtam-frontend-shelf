
# Carousel component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Developers](#markdown-header-developers)

## What does it do
* Create carousel with an easy to use macro.
* Create custom carousels

## Install
Import module
```javascript
moduleInit.async('[js-hook-carousel]', () => import(/* webpackChunkName: "Carousel" */'@components/carousel'));
```

## How to use

### Default

Create carousel in HTML.
```htmlmixed
{% from 'carousel.html' import carousel  %}

You can add the following options:
* `slidesMobile` must be an integer. Amount of slides on mobile view.
* `slidesTabletPortrait` must be an integer. Amount of slides on tablet portrait view. Without a value, `slidesMobile` will be used as a fallback.
* `slidesTabletLandscape` must be an integer. Amount of slides on tablet landscape view. Without a value, `slidesTabletPortrait` will be used as a fallback.
* `slidesDesktop` must be an integer. Amount of slides on desktop view. Without a value, `slidesTabletLandscape` will be used as a fallback.
* `gutter` must be an integer. Default gutter between slides.
* `gutterMobile` must be an integer. Gutter between slides on mobile view. Without a value, `gutter` will be used as a fallback.
* `gutterTabletPortrait` must be an integer. Gutter between slides on tablet portrait view. Without a value, `gutterMobile` will be used as a fallback.
* `gutterTabletLandscape` must be an integer. Gutter between slides on tablet landscape view. Without a value, `gutterTabletPortrait` will be used as a fallback.
* `gutterDesktop` must be an integer. Gutter between slides on desktop view. Without a value, `gutterTabletLandscape` will be used as a fallback.
* `nav` boolean. When set to false, navigation (dots) will not be shown.
* `navContainer` id of element for custom navigation (dots). Make sure it has the same amoet of child elements as slides.
* `controls` boolean. When set to false, ncontrols (prev/next)will not be shown.
* `prevButtonID` id of element for custom prev button.
* `nextButtonID` id of element for custom next button.
* `mode` string. gallery or carousel(default).
* `autoplay` boolean.
* `autoplayTimeout` integer. Milliseconds the slide pauses on autoplay.
* `loop` boolean. Moves throughout all the slides seamlessly.
* `speed` integer. In ms.
* `slideBy` integer | “page”. Number of slides going on one “click”.


{% call carousel({
    id: '1234567890',
    slidesMobile:           1,
    slidesTabletPortrait:   2,
    slidesTabletLandscape:  3,
    gutter:                 '20',
    nav:                    true,
    controls:               true
}) %}

    Your slides here. Each child component will be a separate slide. You can use images, cards, custom components...

{% endcall %}

```

### Custom

Custom html element
```htmlmixed
<div class="custom-carousel" 
    data-id="carousel-custom" 
    data-slides-mobile="1" 
    data-slides-tablet-portrait="2" 
    data-nav="false" 
    data-controls="true" 
    data-prev-button="custom-carousel-prev" data-next-button="custom-carousel-next" js-hook-carousel>
    
    Your slides here. Each child component will be a separate slide. You can use images, cards, custom components...

</div>

<div class="custom-carousel__controls">
    <button id="custom-carousel-prev">prev</button>
    <button id="custom-carousel-next">next</button>
</div>
```

## Developers
* [Frank van der Hammen](mailto:frank.vanderhammen@deptagency.com)
