import Cookies from '@components/cookies';
import Events from '@utilities/events';

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

        if (!Cookies.cookieIsValid(Cookies.cookieNameAdvertising)) {
            Events.$trigger('video::cookie-invalid', { data: this.options.element });
            return;
        }

        import(/* webpackChunkName: "Youtube-Player" */'youtube-player')
            .then(Player => {

                this._initPlayer(Player);
                this._bindEvents();

            });

    }

    _initPlayer(Player) {

        this.player = new Player(this.options.player, {
            videoId: this.options.videoId,
            playerVars: {
                start: this.options.videoTime,
                modestbranding: 0,
                showinfo: 0,
                controls: this.options.videoControls || 0,
                rel: 0
            }
        });

    }

    _bindEvents() {

        Events.$trigger('video::bind-player-events', { data: this.options });

        this.player.on('ready', () => {

            Events.$trigger('video::ready', { data: this.options });
            Events.$trigger(`video[${this.options.instanceId}]::ready`, { data: this.options });

        });

        this.player.on('stateChange', event => {

            switch (event.data) {

                // finished
                case 0:
                    Events.$trigger('video::ended', { data: this.options });
                    Events.$trigger(`video[${this.options.instanceId}]::ended`, { data: this.options });
                    break;

                // playing
                case 1:
                    Events.$trigger('video::playing', { data: this.options });
                    Events.$trigger(`video[${this.options.instanceId}]::playing`, { data: this.options });
                    break;

                // paused
                case 2:
                    Events.$trigger('video::paused', { data: this.options });
                    Events.$trigger(`video[${this.options.instanceId}]::paused`, { data: this.options });
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
