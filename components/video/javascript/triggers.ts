import Events from '@/utilities/events'

import { VideoOptions } from './video'

export const onBindEvents = (options: VideoOptions) => {
  Events.$trigger('video::bind-player-events', { data: options })
}

export const onReady = (options: VideoOptions) => {
  Events.$trigger('video::ready', { data: options })
  Events.$trigger(`video[${options.instanceId}]::ready`, {
    data: options,
  })
}

export const onPlaying = (options: VideoOptions) => {
  Events.$trigger('video::playing', { data: options })
  Events.$trigger(`video[${options.instanceId}]::playing`, {
    data: options,
  })
}

export const onEnded = (options: VideoOptions) => {
  Events.$trigger('video::ended', { data: options })
  Events.$trigger(`video[${options.instanceId}]::ended`, {
    data: options,
  })
}

export const onPaused = (options: VideoOptions) => {
  Events.$trigger('video::paused', { data: options })
  Events.$trigger(`video[${options.instanceId}]::paused`, {
    data: options,
  })
}
