# Viewer 360

## Table of contents
- [Viewer 360](#viewer-360)
  - [Table of contents](#table-of-contents)
  - [What does it do](#what-does-it-do)
  - [Install](#install)
  - [How to use](#how-to-use)
  - [Dependencies](#dependencies)
  - [Developers](#developers)


## What does it do
* Rotate a 3D image using an image sequence in canvas

## Install
Import module and init with moduleInit on a DOM element
```javascript
moduleInit.async('[js-hook-viewer-360]', () => import(/* webpackChunkName: "Viewer360" */'@components/viewer360'));
```

## How to use

Create 360 viewer in html:

```htmlmixed

{% from 'viewer360.html' import viewer360  %}

{{ viewer360({
    folder: 'https://scaleflex.ultrafast.io/https://scaleflex.airstore.io/demo/chair-360-36/',
    filename: 'chair_{index}.jpg',
    amount: 36,
    keys: true,
    autoplay: true,
    controls: true
}) }}
```

## Dependencies
* [Events utility](/utilities/events/)
* [Loading indicator](components/loading-indicator/)

## Developers
* [Daphne Smit](mailto:daphne.smit@deptagency.com)
