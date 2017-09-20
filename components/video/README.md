
# Video component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Plays Youtube & Vimeo video
* Fires generic video ready, play & pause events.

## Install
```node
npm i youtube-player --save
npm i @vimeo/player --save
```
```javascript
import './src/modules/in-view';
import Video from './src/modules/video';
```

## How to use

### Default

```javascript
new Video({ platforms: ['youtube', 'vimeo'] });
```

Create player in HTML. The player will use the [in-view library](/utilities/in-view/) to initialise the videos when they're in view.
```htmlmixed
{% from 'components/video.html' import video  %}

{{ video({
    instance_id: 1,
    id: 'GrDHJK9UYpU',
    platform: 'youtube',
    title: 'title here',
    description: 'description here',
    thumbnail: '/assets/images/thumbs/thumb.jpg',
    total_time: 'T1M33S',
    start_time: '10',
    classes: 'additional-class',
    controls: 1,
    info: 1
}) }}
```

### Without in-view
This will initialise all the players on the page. If autoplay parameter is set, it will also autoplay all videos.
```javascript
new Video({ platforms: ['youtube', 'vimeo'] });

Events.$trigger('video::update');
```

Create the player the same as in the previous demo. But now add a `inview: false` as parameter.
```htmlmixed
{% from 'components/video.html' import video  %}

{{ video({
    instance_id: 1,
    id: 'GrDHJK9UYpU',
    platform: 'youtube',
    title: 'title here',
    description: 'description here',
    thumbnail: '/assets/images/thumbs/thumb.jpg',
    total_time: 'T1M33S',
    start_time: '10',
    classes: 'additional-class',
    controls: 1,
    info: 1,
    inview: false
}) }}
```


## Dependencies
* [core-js/fn/symbol](https://www.npmjs.com/package/core-js) for IE11 support
* [core-js/fn/symbol/iterator](https://www.npmjs.com/package/core-js) for IE11 support
* [core-js/fn/array/from](https://www.npmjs.com/package/core-js) for IE11 support
* [core-js/fn/array/reduce](https://www.npmjs.com/package/core-js) for IE11 support
* [Events library](/utilities/events/)
* [In-view library](/utilities/in-view/)
* [youtube-player](https://github.com/gajus/youtube-player)
* [@vimeo/player](https://www.npmjs.com/package/@vimeo/player)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
