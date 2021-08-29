import Cookies, { CookieName } from '@components/cookies'
import Player, { Options } from '@vimeo/player'

import * as triggers from '../triggers'
import { VideoOptions } from '../video'

class VimeoVideo {
  options: VideoOptions
  playerOptions: Options
  player: Player
  initialPlay?: boolean

  constructor(options: VideoOptions) {
    this.options = options

    this.initPlayer()
    this.bindEvents()
  }

  initPlayer() {
    const {
      videoId: id,
      videoAutoplay: autoplay,
      videoLoop: loop,
      videoPlaysinline: playsinline,
      videoMuted: muted,
      videoControls: controls,
    } = this.options

    this.player = new Player(this.options.player, {
      id: Number(id),
      title: false,
      portrait: false,
      autoplay,
      loop,
      dnt: !Cookies.cookieIsValid(CookieName.ADVERTISING),
      playsinline: autoplay ? true : playsinline,
      muted: autoplay ? true : muted,
      controls,
    })
  }

  bindEvents() {
    triggers.onBindEvents(this.options)

    this.player.ready().then(() => {
      if (this.options.videoTime && !this.initialPlay) {
        this.setStartTime(this.options.videoTime)
      }

      triggers.onReady(this.options)
    })

    // Workaround on iOS where the play event would not be triggered on autoplay - https://github.com/vimeo/player.js/issues/315
    if (this.options.videoAutoplay) {
      this.player.on('timeupdate', () => {
        this.player.off('timeupdate')
        triggers.onPlaying(this.options)
      })
    }

    this.player.on('play', () => {
      this.player.off('timeupdate') // Remove timeupdate event listener on play.
      triggers.onPlaying(this.options)
    })

    this.player.on('pause', () => {
      triggers.onPaused(this.options)
    })

    this.player.on('ended', () => {
      triggers.onEnded(this.options)
    })
  }

  play() {
    this.player.play()
  }

  pause() {
    this.player.pause()
  }

  replay() {
    this.player.unload()
    this.player.play()
  }

  mute() {
    this.player.setVolume(0)
  }

  unMute() {
    this.player.setVolume(1)
  }

  setVolume(value: number) {
    this.player.setVolume(value)
  }

  setStartTime(seconds: number) {
    this.player
      .setCurrentTime(seconds)
      .then(() => {
        this.initialPlay = true
      })
      .catch(() => {
        this.initialPlay = false
        console.error('Unable to set start time for video', this.options.videoId)
      })
  }
}

export default VimeoVideo
