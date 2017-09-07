
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
import Video from './src/modules/video';
```

## How to use

### Initialise player
Create player in HTML.
```javascript
new Video({ platforms: ['youtube', 'vimeo'] });

Events.$trigger('video::update');
```

### Create new player
Create player in HTML.
```htmlmixed
{% from 'components/video.html' import video  %}

{{ video({
    id: 'GrDHJK9UYpU',
    platform: 'youtube',
    title: 'title here',
    description: 'description here',
    thumbnail: '/assets/images/thumbs/thumb.jpg',
    embed_url: 'https://www.youtube.com/watch?v=GrDHJK9UYpU',
    total_time: 'T1M33S',
    start_time: '10'
}) }}
```

## Dependencies
* [Events library](/utilities/events/)
* [youtube-player](https://github.com/gajus/youtube-player)
* [@vimeo/player](https://www.npmjs.com/package/@vimeo/player)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)