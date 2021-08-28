import DetectTouch from '@utilities/detect-touch'
import { html } from '@utilities/dom-elements'
import ScreenDimensions from '@utilities/screen-dimensions'

type DOMRectPosition = Pick<DOMRect, 'top' | 'left' | 'right' | 'bottom'>

enum TOOLTIP_DIRECTIONS {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

const TRIANGLE = '[js-hook-triangle]'
const TOOLTIP_TRIGGER_CLASS = 'tooltip--trigger'
const TOOLTIP_ACTIVE_CLASS = 'tooltip--active'
const LINK_TAG = 'A'

// Change to the class of your nav if the nav is fixed
const NAV_CLASS = '.your-nav-class'
const CALCULATE_NAV_OFFSET = true

const TOOLTIP_PREFIX = 'tooltip--'
const TOOLTIP_PROPS = [
  `${TOOLTIP_PREFIX}left-top`,
  `${TOOLTIP_PREFIX}left-center`,
  `${TOOLTIP_PREFIX}left-bottom`,
  `${TOOLTIP_PREFIX}right-top`,
  `${TOOLTIP_PREFIX}right-center`,
  `${TOOLTIP_PREFIX}right-bottom`,
  `${TOOLTIP_PREFIX}top-left`,
  `${TOOLTIP_PREFIX}top-center`,
  `${TOOLTIP_PREFIX}top-right`,
  `${TOOLTIP_PREFIX}bottom-left`,
  `${TOOLTIP_PREFIX}bottom-center`,
  `${TOOLTIP_PREFIX}bottom-right`,
]

class Tooltip {
  element: HTMLElement
  triangle: HTMLElement | null
  nav: HTMLElement | null
  navHeight: number
  tooltipTriggers: HTMLElement[]
  tooltipTrigger: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
    this.triangle = this.element.querySelector<HTMLElement>(TRIANGLE)
    this.nav = document.querySelector<HTMLElement>(NAV_CLASS)
    this.tooltipTriggers = Array.from(
      document.querySelectorAll<HTMLElement>(`.${TOOLTIP_TRIGGER_CLASS}`),
    )
    this.tooltipTrigger = this.element.parentNode as HTMLElement

    if (DetectTouch.isTouchDevice) {
      this.tooltipTrigger.addEventListener('touchstart', event => this.handleTouch(event))
    } else {
      this.tooltipTrigger.addEventListener('mouseenter', () =>
        this.inScreen(Tooltip.getElementPositions(this.element)),
      )
      this.tooltipTrigger.addEventListener('focus', () =>
        this.inScreen(Tooltip.getElementPositions(this.element)),
      )
    }

    if (ScreenDimensions.isTabletPortraitAndBigger) {
      this.tooltipTrigger.addEventListener('mouseleave', () => this.resetElement())
      this.tooltipTrigger.addEventListener('blur', () => this.resetElement())
    }
  }

  handleTouch(event: TouchEvent) {
    const target = event.target as HTMLElement | null
    if (!this.tooltipTrigger.classList.contains(TOOLTIP_ACTIVE_CLASS)) {
      this.tooltipTrigger.classList.add(TOOLTIP_ACTIVE_CLASS)
    } else if (target?.tagName !== LINK_TAG) {
      this.tooltipTrigger.classList.remove(TOOLTIP_ACTIVE_CLASS)
    }

    /** Add touch event to the whole document. So the user can click
     * everywhere to close the toolbar. */
    document.addEventListener('touchstart', this.resetTouchEvent, false)
    this.inScreen(Tooltip.getElementPositions(this.element))
  }

  static getElementPositions(element: HTMLElement) {
    const { top, right, bottom, left } = element.getBoundingClientRect()

    return {
      top,
      right,
      bottom,
      left,
    }
  }

  resetTouchEvent = (event: TouchEvent) => this.resetTouch(event)

  resetTouch(event: TouchEvent) {
    const target = event.target as HTMLElement | null
    if (
      !target?.classList.contains(TOOLTIP_TRIGGER_CLASS) ||
      target?.closest(`.${TOOLTIP_TRIGGER_CLASS}`) !== this.tooltipTrigger
    ) {
      /** Remove the touch event. If you click on a toolbar again
       * the touch event isn't double. */
      document.removeEventListener('touchstart', this.resetTouchEvent)
      this.closeAllOtherTooltips()
      this.resetElement()
    }
  }

  closeAllOtherTooltips() {
    this.tooltipTriggers.forEach(tooltipTrigger => {
      if (tooltipTrigger === this.tooltipTrigger) {
        tooltipTrigger.classList.remove(TOOLTIP_ACTIVE_CLASS)
      }
    })
  }

  resetElement() {
    this.element.removeAttribute('style')
    this.triangle?.removeAttribute('style')

    const oldTipPosition = TOOLTIP_PREFIX + this.element.dataset.position

    const positionProp = this.getPositionProp()
    if (positionProp) this.element.classList.remove(positionProp)
    this.element.classList.add(oldTipPosition)
  }

  inScreen(position: DOMRectPosition) {
    if (CALCULATE_NAV_OFFSET) {
      this.navHeight = this.nav ? this.nav.offsetHeight : 0
    } else {
      this.navHeight = 0
    }
    Object.keys(position).forEach((key: keyof DOMRectPosition) => {
      const positionInScreen = this.oldPosition(key, position[key])
      if (positionInScreen < 0) {
        this.newPosition(key, positionInScreen)
      }
    })
  }

  oldPosition(key: keyof DOMRectPosition, position: number) {
    switch (key) {
      case TOOLTIP_DIRECTIONS.RIGHT:
        return html.offsetWidth - position
      case TOOLTIP_DIRECTIONS.BOTTOM:
        return window.innerHeight - position
      case TOOLTIP_DIRECTIONS.TOP:
        return position - this.navHeight
      default:
        return position
    }
  }

  static newPositionKey(key: keyof DOMRectPosition) {
    switch (key) {
      case TOOLTIP_DIRECTIONS.RIGHT:
        return TOOLTIP_DIRECTIONS.LEFT
      case TOOLTIP_DIRECTIONS.LEFT:
        return TOOLTIP_DIRECTIONS.RIGHT
      case TOOLTIP_DIRECTIONS.TOP:
        return TOOLTIP_DIRECTIONS.BOTTOM
      case TOOLTIP_DIRECTIONS.BOTTOM:
        return TOOLTIP_DIRECTIONS.TOP
      default:
        return key
    }
  }

  static reverseNumber(number: number) {
    return Math.abs(number < 0 ? number : -number)
  }

  newPosition(key: keyof DOMRectPosition, position: number) {
    const positionProp = this.getPositionProp()
    if (!positionProp) return
    if (ScreenDimensions.isTabletPortraitAndBigger) {
      this.newDesktopPosition(key, positionProp, position)
    } else {
      this.newMobilePosition(key, positionProp)
    }
  }

  getPositionProp() {
    return [...this.element.classList].find(positionProp => TOOLTIP_PROPS.includes(positionProp))
  }

  static getDesktopMargins(key: keyof DOMRectPosition, position: number) {
    const positionReverse = this.reverseNumber(position)

    switch (key) {
      case TOOLTIP_DIRECTIONS.TOP:
      case TOOLTIP_DIRECTIONS.LEFT:
        return {
          element: positionReverse,
          triangle: position,
        }
      default:
        return {
          element: position,
          triangle: positionReverse,
        }
    }
  }

  newDesktopPosition(key: keyof DOMRectPosition, positionProp: string, position: number) {
    /** If the tooltip is outside the screen, then check if the position isn't in the classname.
         So if the position is left-center and the tooltip is outside the topscreen then do this.
         Not if position is top-center and tooltip is outside the topscreen.
         */
    if (positionProp.indexOf('center') > 0 && positionProp.includes(key)) {
      const margins = Tooltip.getDesktopMargins(key, position)

      if (key === TOOLTIP_DIRECTIONS.BOTTOM || key === TOOLTIP_DIRECTIONS.TOP) {
        this.element.style.marginTop = `${margins.element}px`
        if (this.triangle) this.triangle.style.marginTop = `${margins.triangle}px`
      } else {
        this.element.style.marginLeft = `${margins.element}px`
        if (this.triangle) this.triangle.style.marginLeft = `${margins.triangle}px`
      }
    } else {
      this.element.classList.remove(positionProp)

      const newPosition = positionProp.replace(key, Tooltip.newPositionKey(key))
      this.element.classList.add(newPosition)
    }
  }

  newMobilePosition(key: keyof DOMRectPosition, positionProp: string) {
    if (key === TOOLTIP_DIRECTIONS.LEFT || key === TOOLTIP_DIRECTIONS.RIGHT) {
      this.element.classList.remove(positionProp)

      // Add class for more dynamic control on mobile
      this.element.classList.add(`${TOOLTIP_PREFIX}top-center`, `${TOOLTIP_PREFIX}full-width`)

      const { left } = Tooltip.getElementPositions(this.element)
      const margins = Tooltip.getDesktopMargins(TOOLTIP_DIRECTIONS.LEFT, left)

      this.element.style.marginLeft = `${margins.element}px`
      if (this.triangle) this.triangle.style.marginLeft = `${margins.triangle}px`
    }
  }
}

export default Tooltip
