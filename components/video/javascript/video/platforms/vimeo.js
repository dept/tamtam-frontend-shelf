/**
 *  @shelf-version: 1.0.0
 */

import Events from '../../util/events';
import VimeoPlayer from '@vimeo/player';

class VimeoVideo {

    constructor(options) {

        this.options = options;

        this._initPlayer();
        this._bindEvents();

    }

    /**
     * Init the player instance
     */
    _initPlayer() {

        this.player = new VimeoPlayer(this.options.player, {
            id: this.options.videoId,
            title: this.options.videoInfo || false,
            portrait: this.options.videoInfo|| false
        });

    }

    /**
     * Bind events
     */
    _bindEvents() {

        this.player.ready().then(() => {

            if (this.options.videoTime) {
                this.player.setCurrentTime(this.options.videoTime)
                    .then(() => this.player.pause());
            }

            Events.$trigger('video::ready', { data: this.options });
            Events.$trigger(`video::ready(${this.options.instanceId})`, { data: this.options });

        });

        this.player.on('play', () => Events.$trigger('video::playing', { data: this.options }));
        this.player.on('pause', () => Events.$trigger('video::paused', { data: this.options }));
        this.player.on('ended', () => Events.$trigger('video::ended', { data: this.options }));

    }

    /**
     * Bind generic play event
     */
    play() {

        this.player.play();

    }

    /**
     * Bind generic pause event
     */
    pause() {

        this.player.pause();

    }

    /**
     * Bind generic replay event
     */
    replay() {

        this.player.unload();
        this.player.play();

    }

    /**
     * Bind generic mute event
     */
    mute() {

        this.player.setVolume(0);

    }

    /**
     * Bind generic unmute event
     */
    unMute() {

        this.player.setVolume(1);

    }

    /**
     * Bind generic setVolume event
     */
    setVolume(value) {

        this.player.setVolume(value);

    }

}

export default VimeoVideo;
