import 'core-js/fn/array/reduce';
import 'core-js/fn/array/from';

import Events from '../util/events';
import YoutubeVideo from './platforms/youtube';
import VimeoVideo from './platforms/vimeo';

const VIDEO_HOOK = '[js-hook-video]';
const PLAYER_HOOK = '[js-hook-video-player]';

const VIDEO_PLAY_HOOK = '[js-hook-video-play]';
const VIDEO_PAUSE_HOOK = '[js-hook-video-pause]';
const VIDEO_REPLAY_HOOK = '[js-hook-video-replay]';

const VIDEO_READY_CLASS = 'video--is-initialised';
const VIDEO_PLAYING_CLASS = 'video--is-playing';
const VIDEO_PAUSED_CLASS = 'video--is-paused';
const VIDEO_REPLAY_CLASS = 'video--is-ended';

class Video {

    constructor(options) {

        this.options = options;
        this.videos = getVideos([].concat(this.options.platforms));

        this._bindEvent();

    }

    /**
     * Bind generic events
     */
    _bindEvent() {

        Events.$on('video::update', () => {

            this._iteratePlatforms();

        });

        Events.$on('video::ready', (event, data) => {

            data.element.classList.add(VIDEO_READY_CLASS);
            data.element.classList.add(VIDEO_PAUSED_CLASS);

        });

        Events.$on('video::playing', (event, data) => {

            data.element.classList.remove(VIDEO_REPLAY_CLASS);
            data.element.classList.remove(VIDEO_PAUSED_CLASS);
            data.element.classList.add(VIDEO_PLAYING_CLASS);

        });

        Events.$on('video::paused', (event, data) => {

            data.element.classList.remove(VIDEO_PLAYING_CLASS);
            data.element.classList.add(VIDEO_PAUSED_CLASS);

        });

        Events.$on('video::ended', (event, data) => {

            data.element.classList.remove(VIDEO_PLAYING_CLASS);
            data.element.classList.add(VIDEO_REPLAY_CLASS);

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
     * @param {Array} videos
     */
    _initVideos(videos) {

        videos.forEach(video => {

            const options = _constructVideoOptions(video);

            switch (options.videoPlatform) {

                case 'vimeo':
                    options.element.playerInstance = new VimeoVideo(options);
                    bindPlayerEvents(options);
                    break;

                case 'youtube':
                    options.element.playerInstance = new YoutubeVideo(options);
                    bindPlayerEvents(options);
                    break;

                default:
                    console.warn('No valid video platform found');
                    break;

            }

        });


    }

}

/**
 * Get all videos matching the hook
 * @param {Array} platforms
 * @returns {Object}
 */
function getVideos(platforms) {

    return filterPlatforms(platforms, document.querySelectorAll(VIDEO_HOOK));

}

/**
 * Filter videos by platform
 * @param {Array} platforms
 * @param {NodeList} videos
 * @returns {Object}
 */
function filterPlatforms(platforms, videos) {

    let filteredByPlatform = {};

    platforms.map(platform => {
        filteredByPlatform[platform] = [];
        Array.from(videos).filter(video => (video.dataset.videoPlatform === platform) ? filteredByPlatform[platform].push(video) : false).reduce((a, b) => b, [])
    });

    return filteredByPlatform;

}

/**
 * Construct the video options object
 * @param {NodeList} element
 * @returns {Object}
 */
function _constructVideoOptions(element) {

    const { videoPlatform, videoId, videoTime, videoControls } = element.dataset;
    const instanceId = element.id;
    const player = element.querySelector(PLAYER_HOOK);

    if (!videoPlatform || !videoId || element._initialised) { return false; }

    element._initialised = true;

    return {
        element,
        player,
        instanceId,
        videoPlatform,
        videoId,
        videoTime,
        videoControls
    }

}

/**
 * Bind all the player specific events
 * @param {NodeList} options
 */
function bindPlayerEvents(options) {

    Events.$on(`video::play(${options.instanceId})`, () => {
        options.element.playerInstance.play();
    });

    Events.$on(`video::pause(${options.instanceId})`, () => {
        options.element.playerInstance.pause();
    });

    Events.$on(`video::replay(${options.instanceId})`, () => {
        options.element.playerInstance.replay();
    });

    Events.$on(`video::mute(${options.instanceId})`, () => {
        options.element.playerInstance.mute();
    });

    Events.$on(`video::unmute(${options.instanceId})`, () => {
        options.element.playerInstance.unMute();
    });

    Events.$on(`video::volume(${options.instanceId})`, (event, data) => {
        options.element.playerInstance.setVolume(data.data);
    });


    options.element.querySelector(VIDEO_PLAY_HOOK).addEventListener('click', () => {
        Events.$trigger(`video::play(${options.instanceId})`);
    });

    options.element.querySelector(VIDEO_PAUSE_HOOK).addEventListener('click', () => {
        Events.$trigger(`video::pause(${options.instanceId})`);
    });

    options.element.querySelector(VIDEO_REPLAY_HOOK).addEventListener('click', () => {
        Events.$trigger(`video::replay(${options.instanceId})`);
    });

}

export default Video;
