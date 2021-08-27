# Image component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do
* Lazyloads images when in view

## Install
Import module
```javascript
import '@components/image';
```

## How to use

### Default

```javascript
import '@components/image';
```

```htmlmixed
{% from 'image.html' import image  %}

{{ image({
    objectFit: true,
    preload: '//satyr.dev/16x9',
    image: '//satyr.dev/1440x810',
    srcset: '//satyr.dev/320x180 320w, //satyr.dev/480x270 480w, //satyr.dev/768x432 768w, //satyr.dev/1024x576 1024w, //satyr.dev/1280x720 1280w, //satyr.dev/1440x810 1440w, //satyr.dev/1920x1080 1920w'
}) }}
```

## Dependencies
* [In-view libary](/utilities/in-view/)
* [Events libary](/utilities/events/)

## Developers
* [Jeroen Reumkens](mailto:jeroen-reumkens@tamtam.nl)
* [Adrian Klingen (co author)](mailto:adrian.klingen@deptagency.com)
