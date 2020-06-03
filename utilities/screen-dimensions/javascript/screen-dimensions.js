/* eslint-disable max-lines-per-function */

import RafThrottle from '@utilities/raf-throttle'

const MEDIA_QUERIES = [
  {
    reference: 'isMobile',
    breakpoint: 320,
  },
  {
    reference: 'isMobilePlus',
    breakpoint: 480,
  },
  {
    reference: 'isTabletPortrait',
    breakpoint: 768,
  },
  {
    reference: 'isTabletLandscape',
    breakpoint: 1024,
  },
  {
    reference: 'isLaptop',
    breakpoint: 1240,
  },
  {
    reference: 'isDesktop',
    breakpoint: 1600,
  },
  {
    reference: 'isWidescreen',
    breakpoint: 1920,
  },
]

class ScreenDimensions {
  constructor() {
    this.bindEvents()

    this.bindQueryEvents()

    this.updateWidth()
  }

  get screenHeight() {
    return this.height
  }

  get screenWidth() {
    return this.width
  }

  bindEvents() {
    RafThrottle.set([
      {
        element: window,
        event: 'resize',
        namespace: 'ScreenDimensionsWidthChange',
        fn: () => this.updateWidth(),
      },
    ])
  }

  bindQueryEvents() {
    MEDIA_QUERIES.forEach((mqObject, index) => {
      this.installDefaultQueryWatcher(mqObject.breakpoint, mqObject.reference)
      this.installOtherQueryWatchers(mqObject.breakpoint, mqObject.reference, index)
    })
  }

  installDefaultQueryWatcher(breakpoint, reference) {
    installMediaQueryWatcher(`(min-width: ${breakpoint}px)`, matches => {
      this[`${reference}AndBigger`] = matches
    })
  }

  installOtherQueryWatchers(breakpoint, reference, index) {
    let mediaQuery = `(min-width: ${breakpoint}px)`

    if (!index) {
      mediaQuery = `(max-width: ${breakpoint}px)`
    } else if (MEDIA_QUERIES[index + 1]) {
      const maxBreakPoint = MEDIA_QUERIES[index + 1].breakpoint - 1
      mediaQuery = `(min-width: ${breakpoint}px) and (max-width: ${maxBreakPoint}px)`
    }

    installMediaQueryWatcher(mediaQuery, matches => {
      this[reference] = matches
    })
  }

  updateWidth() {
    ;(this.width = window.innerWidth), (this.height = window.innerHeight)
  }
}

const installMediaQueryWatcher = (mediaQuery, layoutChangedCallback) => {
  const mql = window.matchMedia(mediaQuery)
  mql.addListener(event => layoutChangedCallback(event.matches, event.media))
  layoutChangedCallback(mql.matches, mql.media)
}

export default new ScreenDimensions()
