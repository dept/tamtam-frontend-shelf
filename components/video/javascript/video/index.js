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
        this._iterateVideos();

    }

    /**
     * Bind generic events
     */
    _bindEvent() {

        Events.$on('video::inview', (event, element) => {

            if (!element._inViewport.bottom && !element._inViewport.top && !element.dataset.videoLoop) {
                Events.$trigger(`video::pause(${element.id})`);
            }

            if (element._initialised) {
                return;
            }

            this._initVideo([element]);

        });

        Events.$on('video::update', () => {

            this._iterateVideos();

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
    _iterateVideos() {

        this.videos = getVideos(this.registeredPlatforms);

        this.videos.forEach(video => {
            this._initVideo(video)
        });

    }

    /**
     * Init all videos
     * @param {Array} videos
     */
    _initVideo(video) {

        const platformClass = this.registeredPlatforms[video.dataset.videoPlatform];
        const options = _constructVideoOptions(video);

        options.element.playerInstance = new platformClass(options);
        bindPlayerEvents(options);

    }

}

/**
 * Get all videos matching the hook
 * @param {Array} platforms
 * @returns {Object}
 */
function getVideos(platforms) {

    if (!VIDEOS) { return false; }
    return Array.from(VIDEOS).filter(video => platforms.hasOwnProperty(video.dataset.videoPlatform) ? video : false);

}

/**
 * Construct the video options object
 * @param {NodeList} element
 * @returns {Object}
 */
function _constructVideoOptions(element) {

    const {
        videoPlatform,
        videoId,
        videoTime,
        videoInfo,
        videoControls,
        videoMuted,
        videoAutopause,
        videoAutoplay,
        videoLoop,
        videoSources
    } = element.dataset;

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
        videoInfo,
        videoControls,
        videoMuted,
        videoAutopause,
        videoAutoplay,
        videoLoop,
        videoSources
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

    const playButton = options.element.querySelector(VIDEO_PLAY_HOOK);
    if (playButton) {
        options.element.querySelector(VIDEO_PLAY_HOOK).addEventListener('click', () => {
            Events.$trigger(`video::play(${options.instanceId})`);
        });
    }

    const pauseButton = options.element.querySelector(VIDEO_PLAY_HOOK);
    if (pauseButton) {
        options.element.querySelector(VIDEO_PAUSE_HOOK).addEventListener('click', () => {
            Events.$trigger(`video::pause(${options.instanceId})`);
        });
    }

    const replayButton = options.element.querySelector(VIDEO_PLAY_HOOK);
    if (replayButton) {
        options.element.querySelector(VIDEO_REPLAY_HOOK).addEventListener('click', () => {
            Events.$trigger(`video::replay(${options.instanceId})`);
        });
    }

}

export default Video;
