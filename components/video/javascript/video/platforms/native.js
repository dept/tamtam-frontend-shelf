/**
 *  @shelf-version: 1.0.0
 */

import Events from '../../util/events';

class NativeVideo {

    constructor(options) {

        this.options = options;

        if (!this.options.videoSources) { return; }

        this.sources = JSON.parse(this.options.videoSources);

        this._initPlayer();
        this._bindEvents();

    }

    /**
     * Init the player instance
     */
    _initPlayer() {

        this.sourceData = getClosestVideoSource(this.sources);
        this.player = document.createElement('video');

        this.player.src = this.sourceData.url;

        if (parseInt(this.options.videoLoop, 10)) {
            this.player.setAttribute('loop', 'loop');
        }

        if (parseInt(this.options.videoPlaysinline, 10)) {
            // For mobile autoplay
            this.player.setAttribute('playsinline', 'playsinline');
        }

        if (parseInt(this.options.videoAutoplay, 10)) {
            this.player.setAttribute('autoplay', 'autoplay');

            // For mobile autoplay
            this.player.setAttribute('playsinline', 'playsinline');
        }

        if (parseInt(this.options.videoMuted, 10)) {
            this.player.setAttribute('muted', 'muted');
            this.player.muted = true;
        }

        if (parseInt(this.options.videoTime, 10)) {
            this.player.currentTime = this.options.videoTime;
        }

        this.options.player.appendChild(this.player);

    }

    /**
     * Bind events
     */
    _bindEvents() {

        Events.$trigger('video::bind-player-events', { data: this.options });

        this.player.addEventListener('loadedmetadata', () => {
            Events.$trigger('video::ready', { data: this.options });
            Events.$trigger(`video::ready(${this.options.instanceId})`, { data: this.options });
        });

        this.player.addEventListener('playing', () => {
            Events.$trigger('video::playing', { data: this.options });
            Events.$trigger(`video::playing(${this.options.instanceId})`, { data: this.options });
        });

        this.player.addEventListener('pause', () => {
            Events.$trigger('video::paused', { data: this.options });
            Events.$trigger(`video::paused(${this.options.instanceId})`, { data: this.options });
        });

        this.player.addEventListener('ended', () => {
            Events.$trigger('video::ended', { data: this.options });
            Events.$trigger(`video::ended(${this.options.instanceId})`, { data: this.options });
        });

    }

    /**
     * Bind generic play event
     */
    play() {

        if (parseInt(this.options.videoControls, 10)) {
            this.player.controls = 1;
        }

        this.player.play();

    }

    /**
     * Bind generic pause event
     */
    pause() {

        if (parseInt(this.options.videoControls, 10)) {
            this.player.controls = 0;
        }

        this.player.pause();

    }

    /**
     * Bind generic replay event
     */
    replay() {

        this.player.currentTime = 0;
        this.player.play();

    }

    /**
     * Bind generic mute event
     */
    mute() {

        this.player.setAttribute('muted', 'muted');
        this.player.muted = true;

    }

    /**
     * Bind generic unmute event
     */
    unMute() {

        this.player.muted = false;
        this.player.removeAttribute('muted');

    }

    /**
     * Bind generic setVolume event
     */
    setVolume(value) {

        this.player.volume = value;

    }

}

function getClosestVideoSource(sources) {

    const windowWidth = window.innerWidth;
    let closestSource = null;

    sources.map(el => {
        if (closestSource == null || Math.abs(el.size - windowWidth) < Math.abs(closestSource.size - windowWidth)) {
            closestSource = el;
        }
    });

    return closestSource;

}

export default NativeVideo;
