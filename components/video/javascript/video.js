import 'core-js/fn/array/reduce';
import 'core-js/fn/array/from';

import YouTubePlayer from 'youtube-player';
import VimeoPlayer from '@vimeo/player';
import Events from './util/events';


const PLAYER_HOOK = '[js-hook-video]';

class VideoInit {

    constructor(options) {

        this.options = options;
        this.videos = getVideos([].concat(this.options.platforms));

        this._bindEvent();

    }

    /**
     * Bind event
     */
    _bindEvent() {

        Events.$on('video::update', () => {

            this._iteratePlatforms();

        });

    }

    /**
     * Iterate over platform types
     */
    _iteratePlatforms() {

        Object.keys(this.videos).forEach(platform => this._initVideos(this.videos[platform]));

    }

    /**
     * Init all videos
     */
    _initVideos(videos) {

        videos.forEach(video => {

            const options = _constructVideoOptions(video);

            switch (options.videoPlatform) {

                case 'vimeo':
                    initVimeoVideo(options);
                    break;

                case 'youtube':
                    initYoutubeVideo(options);
                    break;

                default:
                    console.warn('No valid video platform found');
                    break;

            }


        });


    }

}

function getVideos(platforms) {

    return filterPlatforms(platforms, document.querySelectorAll(PLAYER_HOOK));

}

function filterPlatforms(platforms, videos) {

    let filteredByPlatform = {};

    platforms.map(platform => {
        filteredByPlatform[platform] = [];
        Array.from(videos).filter(video => (video.dataset.videoPlatform === platform) ? filteredByPlatform[platform].push(video) : false).reduce((a, b) => b, [])
    });

    return filteredByPlatform;

}

function _constructVideoOptions(element) {

    const { videoPlatform, videoId, videoTime } = element.dataset;
    if (!videoPlatform || !videoId || element._initialised) { return false; }

    element._initialised = true;

    return {
        element,
        videoPlatform,
        videoId,
        videoTime
    }

}


/**
 * 
 * States
 * -1: 'unstarted'
 *  0: 'ended'
 *  1: 'playing'
 *  2: 'paused'
 *  3: 'buffering'
 *  5: 'video cued'
 */
function initYoutubeVideo(options) {

    const player = YouTubePlayer(options.element, {
        videoId: options.videoId,
        playerVars: {
            start: options.videoTime
        }
    });

    player.on('ready', () => Events.$trigger('video::ready', { data: options }));

    player.on('stateChange', event => {

        switch (event.data) {

            // finished
            case 0:
                Events.$trigger('video::pause', { data: options });
                break;

            // playing
            case 1:
                Events.$trigger('video::play', { data: options });
                break;

            // paused
            case 2:
                Events.$trigger('video::pause', { data: options });
                break;

            // do nothing
            default:
                break;

        }

    });

}

function initVimeoVideo(options) {

    const player = new VimeoPlayer(options.element, {
        id: options.videoId
    });

    player.ready().then(() => {

        if (options.videoTime) {
            player.setCurrentTime(options.videoTime)
                .then(() => player.pause());
        }

        Events.$trigger('video::ready', { data: options })

    });

    player.on('play', () => Events.$trigger('video::play', { data: options }));
    player.on('pause', () => Events.$trigger('video::pause', { data: options }));
    player.on('ended', () => Events.$trigger('video::pause', { data: options }));

}

export default VideoInit;