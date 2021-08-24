import { body } from '@/utilities/dom-elements'
import RafThrottle from '@/utilities/raf-throttle'

type ScreenDimensionsQueries =
  | 'isMobile'
  | 'isMobileAndBigger'
  | 'isMobilePlus'
  | 'isMobilePlusAndBigger'
  | 'isTabletPortrait'
  | 'isTabletPortraitAndBigger'
  | 'isTabletLandscape'
  | 'isTabletLandscapeAndBigger'
  | 'isLaptop'
  | 'isLaptopAndBigger'
  | 'isDesktop'
  | 'isDesktopAndBigger'
  | 'isWidescreen'

type MediaQueries = {
  reference: ScreenDimensionsQueries
  breakpoint: number
}[]

const MEDIA_QUERIES: MediaQueries = [
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
  public isMobile: boolean
  public isMobileAndBigger: boolean
  public isMobilePlus: boolean
  public isMobilePlusAndBigger: boolean
  public isTabletPortrait: boolean
  public isTabletPortraitAndBigger: boolean
  public isTabletLandscape: boolean
  public isTabletLandscapeAndBigger: boolean
  public isLaptop: boolean
  public isLaptopAndBigger: boolean
  public isDesktop: boolean
  public isDesktopAndBigger: boolean
  public isWidescreen: boolean

  private height: number
  private width: number

  get screenHeight() {
    return this.height
  }

  get screenWidth() {
    return this.width
  }

  constructor() {
    RafThrottle.set([
      {
        element: window,
        event: 'resize',
        namespace: 'ScreenDimensionsWidthChange',
        fn: () => this.updateWidth(),
      },
    ])

    MEDIA_QUERIES.forEach((mqObject, index) => {
      const breakpoint = mqObject.breakpoint

      installMediaQueryWatcher(`(min-width: ${breakpoint}px)`, matches => {
        this[`${mqObject.reference}AndBigger` as ScreenDimensionsQueries] = matches
        document.documentElement.style.setProperty(
          '--scrollbar-width',
          window.innerWidth - body.clientWidth + 'px',
        )
      })

      if (!index) {
        installMediaQueryWatcher(`(max-width: ${breakpoint}px)`, matches => {
          this[mqObject.reference] = matches
        })
      } else if (MEDIA_QUERIES[index + 1]) {
        installMediaQueryWatcher(
          `(min-width: ${breakpoint}px) and (max-width: ${
            MEDIA_QUERIES[index + 1].breakpoint - 1
          }px)`,
          matches => {
            this[mqObject.reference] = matches
          },
        )
      } else {
        installMediaQueryWatcher(`(min-width: ${breakpoint}px)`, matches => {
          this[mqObject.reference] = matches
        })
      }
    })

    this.updateWidth()
  }

  updateWidth() {
    this.width = window.innerWidth
    this.height = window.innerHeight
  }
}

const installMediaQueryWatcher = (
  mediaQuery: string,
  layoutChangedCallback: (matches: boolean, mediaQuery: string) => void,
) => {
  const mql = window.matchMedia(mediaQuery)
  mql.addListener(event => layoutChangedCallback(event.matches, event.media))
  layoutChangedCallback(mql.matches, mql.media)
}

export default new ScreenDimensions()
