import Events from '@/utilities/events'
import { InViewElement } from '@/utilities/in-view'

import { VideoPlatformOption } from './platforms'
import NativeVideo from './platforms/native'
import VimeoVideo from './platforms/vimeo'
import YoutubeVideo from './platforms/youtube'

export type VideoElement = HTMLElement & InViewElement & { _videoIsInitialised?: boolean }

export type VideoOptions = {
  element: HTMLElement
  player: HTMLElement
  instanceId: string
  videoPlatform: string
  videoId: string
  videoSources?: string
  videoClosedcaptions?: string
  videoTime?: number
  videoControls?: boolean
  videoMuted?: boolean
  videoAutoplay?: boolean
  videoPlaysinline?: boolean
  videoLoop?: boolean
  playerInstance?: YoutubeVideo | VimeoVideo | NativeVideo
}

export type VideoModulesByPlatform = {
  [key in VideoPlatformOption]?: typeof YoutubeVideo | typeof VimeoVideo | typeof NativeVideo
}

const VIDEO_HOOK = '[js-hook-video]'
const PLAYER_HOOK = '[js-hook-video-player]'

const VIDEO_PLAY_HOOK = '[js-hook-video-play]'
const VIDEO_PAUSE_HOOK = '[js-hook-video-pause]'
const VIDEO_REPLAY_HOOK = '[js-hook-video-replay]'

const VIDEO_READY_CLASS = 'video--is-initialised'
const VIDEO_PLAYING_CLASS = 'video--is-playing'
const VIDEO_PAUSED_CLASS = 'video--is-paused'
const VIDEO_REPLAY_CLASS = 'video--is-ended'
const VIDEO_COOKIE_INVALID_CLASS = 'video--has-invalid-cookie'

const VIDEOS = Array.from(document.querySelectorAll<VideoElement>(VIDEO_HOOK))

class Video {
  registeredPlatforms: VideoModulesByPlatform = {}
  videos: VideoElement[] = []

  registerPlatforms(platforms: VideoModulesByPlatform) {
    if (typeof platforms !== 'object') return
    this.registeredPlatforms = platforms
    this.videos = this.videos.concat(getVideos(this.registeredPlatforms))

    this._bindEvent()
  }

  /**
   * Bind generic events
   */
  _bindEvent() {
    this.videos.forEach(video => {
      Events.$on<VideoElement>(`video[${video.id}]::inview`, (_, element) => {
        if (!element.inviewProperties?.isInViewport.vertical && !element.dataset.videoLoop) {
          Events.$trigger(`video[${element.id}]::pause`)
        }

        if (!element._videoIsInitialised && element.inviewProperties?.scrolledPastViewport.bottom) {
          this.initVideo(element)
        }
      })
    })

    Events.$on<VideoElement>('video::update', (_, element) => {
      if (!element) {
        this.iterateVideos()
      } else {
        this.initVideo(element)
      }
    })

    Events.$on<VideoOptions>('video::ready', (_, { element }) => {
      element.classList.add(VIDEO_READY_CLASS)
      element.classList.add(VIDEO_PAUSED_CLASS)
    })

    Events.$on<VideoOptions>('video::playing', (_, { element }) => {
      element.classList.remove(VIDEO_REPLAY_CLASS)
      element.classList.remove(VIDEO_PAUSED_CLASS)
      element.classList.add(VIDEO_PLAYING_CLASS)
    })

    Events.$on<VideoOptions>('video::paused', (_, { element }) => {
      element.classList.remove(VIDEO_PLAYING_CLASS)
      element.classList.add(VIDEO_PAUSED_CLASS)
    })

    Events.$on<VideoOptions>('video::ended', (_, { element }) => {
      element.classList.remove(VIDEO_PLAYING_CLASS)
      element.classList.add(VIDEO_REPLAY_CLASS)
    })

    Events.$on<VideoOptions>('video::bind-player-events', (_, data) => {
      if (data) bindPlayerEvents(data)
    })

    Events.$on<VideoElement>('video::cookie-invalid', (_, element) => {
      element?.classList.add(VIDEO_COOKIE_INVALID_CLASS)
    })
  }

  /**
   * Iterate over platform types
   */
  iterateVideos() {
    this.videos.forEach(video => {
      this.initVideo(video)
    })
  }

  /**
   * Init all videos
   */
  initVideo(video: VideoElement) {
    if (video._videoIsInitialised) return

    const platformClass =
      this.registeredPlatforms[video.dataset.videoPlatform as VideoPlatformOption]
    const options = constructVideoOptions(video)

    if (options && platformClass) {
      options.playerInstance = new platformClass(options)
    }
  }
}

/**
 * Get all videos matching the hook
 */
function getVideos(platforms: VideoModulesByPlatform) {
  return VIDEOS.filter(
    video =>
      Object.prototype.hasOwnProperty.call(platforms, video.dataset.videoPlatform) &&
      !video._videoIsInitialised,
  )
}

/**
 * Construct the video options object
 */
function constructVideoOptions(element: VideoElement): VideoOptions | undefined {
  const {
    videoPlatform,
    videoId,
    videoSources,
    videoClosedcaptions,
    videoTime = '0',
    videoControls = '0',
    videoMuted = '0',
    videoAutoplay = '0',
    videoLoop = '0',
    videoPlaysinline = '0',
  } = element.dataset

  const instanceId = element.id
  const player = element.querySelector<HTMLElement>(PLAYER_HOOK)

  if (!videoPlatform || !videoId || !player || element._videoIsInitialised) return undefined

  element._videoIsInitialised = true

  return {
    element,
    player,
    instanceId,
    videoPlatform,
    videoId,
    videoSources,
    videoClosedcaptions,
    videoTime: parseInt(videoTime, 10),
    videoControls: Boolean(parseInt(videoControls, 10)),
    videoMuted: Boolean(parseInt(videoMuted, 10)),
    videoAutoplay: Boolean(parseInt(videoAutoplay, 10)),
    videoPlaysinline: Boolean(parseInt(videoPlaysinline, 10)),
    videoLoop: Boolean(parseInt(videoLoop, 10)),
  }
}

/**
 * Bind all the player specific events
 */
function bindPlayerEvents(options: VideoOptions) {
  Events.$on(`video[${options.instanceId}]::play`, () => {
    options.playerInstance?.play()
  })

  Events.$on(`video[${options.instanceId}]::pause`, () => {
    options.playerInstance?.pause()
  })

  Events.$on(`video[${options.instanceId}]::replay`, () => {
    options.playerInstance?.replay()
  })

  Events.$on(`video[${options.instanceId}]::mute`, () => {
    options.playerInstance?.mute()
  })

  Events.$on(`video[${options.instanceId}]::unmute`, () => {
    options.playerInstance?.unMute()
  })

  Events.$on<{ data: number }>(`video[${options.instanceId}]::volume`, (_event, data) => {
    options.playerInstance?.setVolume(data.data)
  })

  const playButton = options.element.querySelector(VIDEO_PLAY_HOOK)
  if (playButton) {
    playButton.addEventListener('click', () => {
      Events.$trigger(`video[${options.instanceId}]::play`)
    })
  }

  const pauseButton = options.element.querySelector(VIDEO_PAUSE_HOOK)
  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      Events.$trigger(`video[${options.instanceId}]::pause`)
    })
  }

  const replayButton = options.element.querySelector(VIDEO_REPLAY_HOOK)
  if (replayButton) {
    replayButton.addEventListener('click', () => {
      Events.$trigger(`video[${options.instanceId}]::replay`)
    })
  }
}

export default new Video()
