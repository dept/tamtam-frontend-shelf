/**
 *  @shelf-version: 1.0.0
 */

import 'core-js/fn/symbol';
import 'core-js/fn/symbol/iterator';
import Events from '../../util/events';
import YouTubePlayer from 'youtube-player';

class YoutubeVideo {

    constructor(options) {

        this.options = options;

        this._initPlayer();
        this._bindEvents();

    }

    /**
     * Init the player instance
     */
    _initPlayer() {

        this.player = YouTubePlayer(this.options.player, {
            videoId: this.options.videoId,
            playerVars: {
                start: this.options.videoTime,
                modestbranding: 0,
                showinfo: this.options.videoInfo || false,
                controls: parseInt(this.options.videoControls) || 0
            }
        });

    }

    /**
     * Bind events
     */
    _bindEvents() {

        this.player.on('ready', () => {

            Events.$trigger('video::ready', { data: this.options });
            Events.$trigger(`video::ready(${this.options.instanceId})`, { data: this.options });

        });

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
        this.player.on('stateChange', event => {

            switch (event.data) {

                // finished
                case 0:
                    Events.$trigger('video::ended', { data: this.options });
                    break;

                // playing
                case 1:
                    Events.$trigger('video::playing', { data: this.options });
                    break;

                // paused
                case 2:
                    Events.$trigger('video::paused', { data: this.options });
                    break;

                // do nothing
                default:
                    break;

            }

        });
    }

    /**
     * Bind generic play event
     */
    play() {

        this.player.playVideo();

    }

    /**
     * Bind generic pause event
     */
    pause() {

        this.player.pauseVideo();

    }

    /**
     * Bind generic replay event
     */
    replay() {

        this.player.stopVideo();
        this.player.playVideo();

    }

    /**
     * Bind generic mute event
     */
    mute() {

        this.player.mute();

    }

    /**
     * Bind generic unmute event
     */
    unMute() {

        this.player.unMute();

    }

    /**
     * Bind generic setVolume event
     */
    setVolume(value) {

        this.player.setVolume(value);

    }

}

export default YoutubeVideo;
