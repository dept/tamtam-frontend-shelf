import * as triggers from '../triggers'
import { VideoOptions } from '../video'

type NativeVideoSourceType = {
  url: string
  type: string
}

type NativeVideoSourceSize = {
  size: number
  source: NativeVideoSourceType[]
}

type NativeVideoClosedCaption = {
  url: string
  label: string
  lang: string
}

class NativeVideo {
  sourcesJSON: NativeVideoSourceSize[]
  options: VideoOptions
  sourceData: NativeVideoSourceSize
  player: HTMLVideoElement

  constructor(options: VideoOptions) {
    this.options = options

    if (this.parseSources()) {
      this.initPlayer()
      this.bindEvents()
    }
  }

  /**
   * Init the player instance
   */
  initPlayer() {
    const closestSource = getClosestVideoSource(this.sourcesJSON)
    if (!closestSource) return

    this.sourceData = closestSource

    this.player = document.createElement('video')

    this._addMediaSources()

    if (this.options.videoClosedcaptions) {
      this._addClosedCaptions()
    }

    if (this.options.videoControls) {
      this.player.setAttribute('controls', 'controls')
    }

    if (this.options.videoLoop) {
      this.player.setAttribute('loop', 'loop')
    }

    if (this.options.videoPlaysinline || this.options.videoAutoplay) {
      // For mobile autoplay
      this.player.setAttribute('playsinline', 'playsinline')
    }

    if (this.options.videoAutoplay) {
      this.player.setAttribute('autoplay', 'autoplay')
    }

    if (this.options.videoMuted) {
      this.mute()
    }

    this.options.player.appendChild(this.player)
  }

  /**
   * Bind events
   */
  bindEvents() {
    triggers.onBindEvents(this.options)

    this.player.addEventListener('loadedmetadata', () => {
      if (this.options.videoTime) this.player.currentTime = this.options.videoTime
      if (this.options.videoControls) this.player.controls = true

      triggers.onReady(this.options)
    })

    this.player.addEventListener('playing', () => {
      if (this.options.videoControls) this.player.controls = false

      triggers.onPlaying(this.options)
    })

    this.player.addEventListener('pause', () => {
      if (this.options.videoControls) this.player.controls = true

      triggers.onPaused(this.options)
    })

    this.player.addEventListener('ended', () => {
      triggers.onEnded(this.options)
    })
  }

  parseSources() {
    try {
      if (!this.options.videoSources) return false
      this.sourcesJSON = JSON.parse(this.options.videoSources)
      if (typeof this.sourcesJSON === 'object') {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.error('Failed to parse sources. Are you sure this is an object?')
      return false
    }
  }

  _addMediaSources() {
    this.sourceData.source.forEach(source => {
      const sourceElement = document.createElement('source')
      sourceElement.type = source.type
      sourceElement.src = source.url
      this.player.appendChild(sourceElement)
    })
  }

  _addClosedCaptions() {
    try {
      if (!this.options.videoClosedcaptions) return
      const closedcaptions: NativeVideoClosedCaption[] = JSON.parse(
        this.options.videoClosedcaptions,
      )

      closedcaptions.forEach(cc => {
        const ccElement = document.createElement('track')
        ccElement.src = cc.url
        ccElement.kind = 'subtitles'
        ccElement.label = cc.label
        ccElement.srclang = cc.lang
        this.player.appendChild(ccElement)
      })
    } catch (e) {
      console.error('Failed to parse closed captions. Are you sure this is an object?')
    }
  }

  /**
   * Bind generic play event
   */
  play() {
    this.player.play()
  }

  /**
   * Bind generic pause event
   */
  pause() {
    this.player.pause()
  }

  /**
   * Bind generic replay event
   */
  replay() {
    this.player.currentTime = 0
    this.player.play()
  }

  /**
   * Bind generic mute event
   */
  mute() {
    this.player.setAttribute('muted', 'muted')
    this.player.muted = true
  }

  /**
   * Bind generic unmute event
   */
  unMute() {
    this.player.muted = false
    this.player.removeAttribute('muted')
  }

  /**
   * Bind generic setVolume event
   */
  setVolume(value: number) {
    this.player.volume = value
  }
}

function getClosestVideoSource(sources: NativeVideoSourceSize[]) {
  const windowWidth = window.innerWidth
  let closestSource: NativeVideoSourceSize | null = null

  try {
    sources.map(source => {
      if (
        closestSource == null ||
        Math.abs(source.size - windowWidth) < Math.abs(closestSource.size - windowWidth)
      ) {
        closestSource = source
      }
    })

    return closestSource
  } catch (e) {
    console.error('Failed to find closest source. Are you sure this is an object?')
    return closestSource
  }
}

export default NativeVideo
