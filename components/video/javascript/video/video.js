import 'core-js/fn/array/reduce';
import 'core-js/fn/array/from';

import Events from '../util/events';

const VIDEO_HOOK = '[js-hook-video]';
const PLAYER_HOOK = '[js-hook-video-player]';

const VIDEO_PLAY_HOOK = '[js-hook-video-play]';
const VIDEO_PAUSE_HOOK = '[js-hook-video-pause]';
const VIDEO_REPLAY_HOOK = '[js-hook-video-replay]';

const VIDEO_READY_CLASS = 'video--is-initialised';
const VIDEO_PLAYING_CLASS = 'video--is-playing';
const VIDEO_PAUSED_CLASS = 'video--is-paused';
const VIDEO_REPLAY_CLASS = 'video--is-ended';

const VIDEOS = document.querySelectorAll(VIDEO_HOOK);

class Video {

    constructor() {

        this.videos = [];

        this._bindEvent();

        this.registeredPlatforms = {};

    }

    registerPlatforms(platforms) {

        if (typeof platforms !== 'object') { return; }
        this.registeredPlatforms = platforms;

    }

    /**
     * Bind generic events
     */
    _bindEvent() {

        Events.$on('video::inview', (event, element) => {

            if (!element.inviewProperties.bottom && !element.inviewProperties.top && !element.dataset.videoLoop) {
                Events.$trigger(`video[${element.id}]::pause`);
            }

            if (element._initialised) {
                return;
            }

            this._initVideo(element);

        });

        Events.$on('video::update', (event, element) => {

            if (!element) {
                this._iterateVideos();
            } else {
                this._initVideo(element);
            }

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

        Events.$on('video::bind-player-events', (event, data) => {
            if (data) {
                bindPlayerEvents(data);
            }
        });

    }

    /**
     * Iterate over platform types
     */
    _iterateVideos() {

        this.videos = this.videos.concat(getVideos(this.registeredPlatforms));

        this.videos.forEach(video => {
            this._initVideo(video);
        });

    }

    /**
     * Init all videos
     * @param {Array} videos
     */
    _initVideo(video) {

        if (video._initialised) {
            return;
        }

        const platformClass = this.registeredPlatforms[video.dataset.videoPlatform];
        const options = constructVideoOptions(video);

        if (Object.keys(options).length) {
            options.element.playerInstance = new platformClass(options);
        }

    }

}

/**
 * Get all videos matching the hook
 * @param {Array} platforms
 * @returns {Object}
 */
function getVideos(platforms) {

    if (!VIDEOS) { return []; }
    return Array.from(VIDEOS).filter(video => platforms.hasOwnProperty(video.dataset.videoPlatform) && !video._initialised ? video : false);

}

/**
 * Construct the video options object
 * @param {NodeList} element
 * @returns {Object}
 */
function constructVideoOptions(element) {

    const {
        videoPlatform,
        videoId,
        videoSources,
        videoClosedcaptions,
        videoTime,
        videoInfo,
        videoControls,
        videoMuted,
        videoAutoplay,
        videoLoop,
        videoPlaysinline,
    } = element.dataset;

    const instanceId = element.id;
    const player = element.querySelector(PLAYER_HOOK);

    if (!videoPlatform || !videoId || element._initialised) { return {}; }

    element._initialised = true;

    return {
        element,
        player,
        instanceId,
        videoPlatform,
        videoId,
        videoInfo,
        videoSources,
        videoClosedcaptions,
        // Boolean options:
        videoTime: parseInt(videoTime, 10),
        videoControls: parseInt(videoControls, 10),
        videoMuted: parseInt(videoMuted, 10),
        videoAutoplay: parseInt(videoAutoplay, 10),
        videoPlaysinline: parseInt(videoPlaysinline, 10),
        videoLoop: parseInt(videoLoop, 10)
    };

}

/**
 * Bind all the player specific events
 * @param {NodeList} options
 */
function bindPlayerEvents(options) {

    Events.$on(`video[${options.instanceId}]::play`, () => {
        options.element.playerInstance.play();
    });

    Events.$on(`video[${options.instanceId}]::pause`, () => {
        options.element.playerInstance.pause();
    });

    Events.$on(`video[${options.instanceId}]::replay`, () => {
        options.element.playerInstance.replay();
    });

    Events.$on(`video[${options.instanceId}]::mute`, () => {
        options.element.playerInstance.mute();
    });

    Events.$on(`video[${options.instanceId}]::unmute`, () => {
        options.element.playerInstance.unMute();
    });

    Events.$on(`video[${options.instanceId}]::volume`, (event, data) => {
        options.element.playerInstance.setVolume(data.data);
    });

    const playButton = options.element.querySelector(VIDEO_PLAY_HOOK);
    if (playButton) {
        options.element.querySelector(VIDEO_PLAY_HOOK).addEventListener('click', () => {
            Events.$trigger(`video[${options.instanceId}]::play`);
        });
    }

    const pauseButton = options.element.querySelector(VIDEO_PLAY_HOOK);
    if (pauseButton) {
        options.element.querySelector(VIDEO_PAUSE_HOOK).addEventListener('click', () => {
            Events.$trigger(`video[${options.instanceId}]::pause`);
        });
    }

    const replayButton = options.element.querySelector(VIDEO_PLAY_HOOK);
    if (replayButton) {
        options.element.querySelector(VIDEO_REPLAY_HOOK).addEventListener('click', () => {
            Events.$trigger(`video[${options.instanceId}]::replay`);
        });
    }

}

export default new Video();
