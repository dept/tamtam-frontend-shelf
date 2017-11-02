import 'core-js/fn/symbol';
import 'core-js/fn/symbol/iterator';
import Events from '../../util/events';
import YouTubePlayer from 'youtube-player';

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
class YoutubeVideo {

    constructor(options) {

        this.options = options;

        this._initPlayer();
        this._bindEvents();

    }

    _initPlayer() {

        this.player = YouTubePlayer(this.options.player, {
            videoId: this.options.videoId,
            playerVars: {
                start: this.options.videoTime,
                modestbranding: 0,
                showinfo: 0,
                controls: parseInt(this.options.videoControls) || 0,
                rel: 0
            }
        });

    }

    _bindEvents() {

        this.player.on('ready', () => {

            Events.$trigger('video::ready', { data: this.options });
            Events.$trigger(`video::ready(${this.options.instanceId})`, { data: this.options });

        });

        this.player.on('stateChange', event => {

            switch (event.data) {

                // finished
                case 0:
                    Events.$trigger('video::ended', { data: this.options });
                    Events.$trigger(`video::ended(${this.options.instanceId})`, { data: this.options });
                    break;

                    // playing
                    case 1:
                    Events.$trigger('video::playing', { data: this.options });
                    Events.$trigger(`video::playing(${this.options.instanceId})`, { data: this.options });
                    break;

                    // paused
                    case 2:
                    Events.$trigger('video::paused', { data: this.options });
                    Events.$trigger(`video::paused(${this.options.instanceId})`, { data: this.options });
                    break;

                // do nothing
                default:
                    break;

            }

        });
    }

    play() {

        this.player.playVideo();

    }

    pause() {

        this.player.pauseVideo();

    }

    replay() {

        this.player.stopVideo();
        this.player.playVideo();

    }

    mute() {

        this.player.mute();

    }

    unMute() {

        this.player.unMute();

    }

    setVolume(value) {

        this.player.setVolume(value);

    }

}

export default YoutubeVideo;
