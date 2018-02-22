import Events from '../../util/events';
import VimeoPlayer from '@vimeo/player';

class VimeoVideo {

    constructor(options) {

        this.options = options;

        this._initPlayer();
        this._bindEvents();

    }

    _initPlayer() {

        this.player = new VimeoPlayer(this.options.player, {
            id: this.options.videoId,
            title: false,
            portrait: false
        });

    }

    _bindEvents() {

        Events.$trigger('video::bind-player-events', { data: this.options });

        this.player.ready().then(() => {

            if (this.options.videoTime && !this.initialPlay) {
                this.setStartTime(this.options.videoTime);
            }

            Events.$trigger('video::ready', { data: this.options });
            Events.$trigger(`video[${this.options.instanceId}]::ready`, { data: this.options });

        });

        this.player.on('play', () => {
            Events.$trigger('video::playing', { data: this.options });
            Events.$trigger(`video[${this.options.instanceId}]::playing`, { data: this.options });
        });

        this.player.on('pause', () => {
            Events.$trigger('video::paused', { data: this.options });
            Events.$trigger(`video[${this.options.instanceId}]::paused`, { data: this.options });
        });

        this.player.on('ended', () => {
            Events.$trigger('video::ended', { data: this.options });
            Events.$trigger(`video[${this.options.instanceId}]::ended`, { data: this.options });
        });

    }

    play() {

        this.player.play();

    }

    pause() {

        this.player.pause();

    }

    replay() {

        this.player.unload();
        this.player.play();

    }

    mute() {

        this.player.setVolume(0);

    }

    unMute() {

        this.player.setVolume(1);

    }

    setVolume(value) {

        this.player.setVolume(value);

    }

    setStartTime(seconds) {

        this.player.setCurrentTime(seconds)
            .then(() => this.initialPlay = true)
            .catch(() => {
                this.initialPlay = false;
                console.error('Unable to set start time for video', this.options.id);
            });

    }

}

export default VimeoVideo;
