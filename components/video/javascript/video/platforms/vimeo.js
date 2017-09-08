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

        this.player.ready().then(() => {

            if (this.options.videoTime) {
                this.player.setCurrentTime(this.options.videoTime)
                    .then(() => this.player.pause());
            }

            Events.$trigger('video::ready', { data: this.options });

        });

        this.player.on('play', () => Events.$trigger('video::playing', { data: this.options }));
        this.player.on('pause', () => Events.$trigger('video::paused', { data: this.options }));
        this.player.on('ended', () => Events.$trigger('video::ended', { data: this.options }));

    }

    play(){

        this.player.play();

    }

    pause(){

        this.player.pause();

    }

    replay(){

        this.player.unload();
        this.player.play();

    }

}

export default VimeoVideo;
