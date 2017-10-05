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

        if (parseInt(this.options.videoLoop)) {
            this.player.setAttribute('loop', 'loop');
        }

        if (parseInt(this.options.videoAutoplay)) {
            this.player.setAttribute('autoplay', 'autoplay');
            this.player.setAttribute('playsinline', 'playsinline'); // For mobile autoplay
        }

        if (parseInt(this.options.videoMuted)) {
            this.player.setAttribute('muted', 'true');
        }

        if (parseInt(this.options.videoTime)) {
            this.player.currentTime = this.options.videoTime;
        }

        this.options.player.appendChild(this.player);

    }

    /**
     * Bind events
     */
    _bindEvents() {

        this.player.addEventListener('loadedmetadata', () => {

            Events.$trigger('video::ready', { data: this.options });
            Events.$trigger(`video::ready(${this.options.instanceId})`, { data: this.options });

        });

        this.player.addEventListener('playing', () => Events.$trigger('video::playing', { data: this.options }));
        this.player.addEventListener('pause', () => Events.$trigger('video::paused', { data: this.options }));
        this.player.addEventListener('ended', () => Events.$trigger('video::ended', { data: this.options }));

    }

    /**
     * Bind generic play event
     */
    play() {

        if (parseInt(this.options.videoControls)) {
            this.player.controls = 1;
        }

        this.player.play();

    }

    /**
     * Bind generic pause event
     */
    pause() {

        if (parseInt(this.options.videoControls)) {
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

    }

    /**
     * Bind generic unmute event
     */
    unMute() {

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

    sources.map((el) => {
        if (closestSource == null || Math.abs(el.size - windowWidth) < Math.abs(closestSource.size - windowWidth)) {
            closestSource = el;
        }
    });

    return closestSource;

}

export default NativeVideo;
