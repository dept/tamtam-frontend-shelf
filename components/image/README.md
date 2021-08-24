# Image component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

![Video Demo](./_demo/video.gif)

## What does it do
* Lazyloads images when in view

## Install
Import module
```javascript
import '@/components/image';
```

## How to use

### Default

```javascript
import '@/components/image';
```

```htmlmixed
{% from 'image.html' import image  %}

{{ image({
    preload: 'https://i.vimeocdn.com/video/301621689_10.jpg',
    image: 'https://i.vimeocdn.com/video/301621689_1024.jpg',
    srcset: 'https://i.vimeocdn.com/video/301621689_320.jpg 320w, https://i.vimeocdn.com/video/301621689_480.jpg 480w, https://i.vimeocdn.com/video/301621689_768.jpg 768w, https://i.vimeocdn.com/video/301621689_1024.jpg 1024w, https://i.vimeocdn.com/video/301621689_1280.jpg 1280w, https://i.vimeocdn.com/video/301621689_1440.jpg 1440w'
}) }}
```

## Dependencies
* [In-view libary](/utilities/in-view/)
* [Events libary](/utilities/events/)


## Developers
* [Jeroen Reumkens](mailto:jeroen-reumkens@tamtam.nl)
* [Adrian Klingen (co author)](mailto:adrian.klingen@deptagency.com)
