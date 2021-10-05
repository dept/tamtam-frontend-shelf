import Cookies, { CookieName } from '@/components/cookies'

import * as triggers from '../triggers'
import { VideoOptions } from '../video'

class YoutubeVideo {
  options: VideoOptions
  playerOptions: YT.PlayerOptions
  player: YT.Player
  videoInterval?: NodeJS.Timer

  constructor(options: VideoOptions) {
    this.options = options

    this.playerOptions = {
      videoId: this.options.videoId,
      host: 'https://www.youtube.com',
      playerVars: {
        start: this.options.videoTime,
        modestbranding: 1,
        controls: Number(this.options.videoControls),
        rel: 0,
        origin: window.location.href,
        loop: Number(this.options.videoLoop),
        autoplay: Number(this.options.videoAutoplay),
        mute: Number(this.options.videoMuted),
        playsinline: this.options.videoAutoplay || this.options.videoPlaysinline ? 1 : 0,
        ...(this.options.videoLoop ? { playlist: this.options.videoId } : {}),
      },
      events: {
        onReady: this.onReady.bind(this),
        onStateChange: this.onStateChange.bind(this),
      },
    }

    if (!Cookies.cookieIsValid(CookieName.ADVERTISING)) {
      this.playerOptions.host = 'https://www.youtube-nocookie.com'
    }

    this.init()
  }

  init() {
    if (!window.YT) {
      YoutubeVideo.loadAPI()
      this.checkAPIReady()
      return
    }

    this.checkAPIReady()
  }

  static loadAPI() {
    // This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.append(tag)
  }

  initPlayer() {
    window.youtubeIsReady = true
    if (this.videoInterval) clearInterval(this.videoInterval)

    this.player = new window.YT.Player(this.options.player, this.playerOptions)
  }

  checkAPIReady() {
    window.onYouTubeIframeAPIReady = () => this.initPlayer()

    this.videoInterval = setInterval(() => {
      if (window.youtubeIsReady) {
        this.initPlayer()
        this.videoInterval && clearInterval(this.videoInterval)
      }
    }, 200)
  }

  onReady() {
    triggers.onBindEvents(this.options)
    triggers.onReady(this.options)
  }

  onStateChange(event: YT.OnStateChangeEvent) {
    switch (event.data) {
      case YT.PlayerState.ENDED:
        triggers.onEnded(this.options)
        break
      case YT.PlayerState.PLAYING:
        triggers.onPlaying(this.options)
        break
      case YT.PlayerState.PAUSED:
        triggers.onPaused(this.options)
        break
      default:
        break
    }
  }

  play() {
    this.player.playVideo()
  }

  pause() {
    this.player.pauseVideo()
  }

  replay() {
    this.player.stopVideo()
    this.player.playVideo()
  }

  mute() {
    this.player.mute()
  }

  unMute() {
    this.player.unMute()
  }

  setVolume(value: number) {
    this.player.setVolume(value)
  }
}

export default YoutubeVideo
