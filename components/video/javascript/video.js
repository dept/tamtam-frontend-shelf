import YouTubePlayer from 'youtube-player';
import VimeoPlayer from '@vimeo/player';
import Events from './util/events';


const PLAYER_HOOK = '[js-hook-video]';


class Video {

    constructor() {

        this.videos = getVideos();

        this._bindEvent();

        Events.$trigger('video::update');

    }

    /**
     * Bind event
     */
    _bindEvent() {

        Events.$on('video::update', () => {

            this._initVideos();

        });

    }

    /**
     * Init all videos
     */
    _initVideos() {

        Object.keys(this.videos).forEach(index => {

            const element = this.videos[index];
            const {videoType, videoId, videoTime} = element.dataset;

            if (!videoType || !videoId) { return; }

            const playerOptions = {
                element,
                videoType,
                videoId,
                videoTime
            }

            if (type === 'vimeo') {

                initVimeoVideo(playerOptions);

            } else {

                initYoutubeVideo(playerOptions);

            }

        });

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
        videoId: options.id,
        playerVars: {
            start: options.time
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
        id: options.id
    });

    player.ready().then(() => {

        if (options.time) {
            player.setCurrentTime(options.time)
                .then(() => player.pause());
        }

        Events.$trigger('video::ready', { data: options })

    });

    player.on('play', () => Events.$trigger('video::play', { data: options }));
    player.on('pause', () => Events.$trigger('video::pause', { data: options }));
    player.on('ended', () => Events.$trigger('video::pause', { data: options }));

}


function getVideos() {

    return document.querySelectorAll(PLAYER_HOOK);

}


export default new Video();