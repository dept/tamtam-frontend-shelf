
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
import './src/modules/video';
```

## How to use

### Create new player
Create modalbox in HTML.
```htmlmixed
{% from 'components/video.html' import video  %}

<div class="c-video" 
    id="video-GrDHJK9UYpU"
    data-video-type="youtube"
    data-video-id="GrDHJK9UYpU"
    data-video-time="10"
    js-hook-video >
</div>

```

## Dependencies
* [Events library](/utilities/events/)
* [youtube-player](https://github.com/gajus/youtube-player)
* [@vimeo/player](https://www.npmjs.com/package/@vimeo/player)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)