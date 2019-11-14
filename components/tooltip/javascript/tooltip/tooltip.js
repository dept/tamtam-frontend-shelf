import { html } from '@utilities/dom-elements'
import ScreenDimensions from '@utilities/screen-dimensions'
import DetectTouch from '@utilities/detect-touch'

const DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
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
  constructor(element) {
    this.element = element
    this.triangle = this.element.querySelector(TRIANGLE)
    /** @type {HTMLElement} */
    this.nav = document.querySelector(NAV_CLASS)
    this.tooltipTriggers = Array.from(document.querySelectorAll(`.${TOOLTIP_TRIGGER_CLASS}`))
    this.tooltipTrigger = this.element.parentNode

    this.resetTouchEvent = event => this.resetTouch(event)

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

  handleTouch(event) {
    if (!this.tooltipTrigger.classList.contains(TOOLTIP_ACTIVE_CLASS)) {
      this.tooltipTrigger.classList.add(TOOLTIP_ACTIVE_CLASS)
    } else if (event.target.tagName !== LINK_TAG) {
      this.tooltipTrigger.classList.remove(TOOLTIP_ACTIVE_CLASS)
    }

    /** Add touch event to the whole document. So the user can click
     * everywhere to close the toolbar. */
    document.addEventListener('touchstart', this.resetTouchEvent, false)
    this.inScreen(Tooltip.getElementPositions(this.element))
  }

  static getElementPositions(element) {
    const { top, right, bottom, left } = element.getBoundingClientRect()

    return {
      top,
      right,
      bottom,
      left,
    }
  }

  resetTouch(event) {
    if (
      !event.target.classList.contains(TOOLTIP_TRIGGER_CLASS) ||
      event.target.closest(`.${TOOLTIP_TRIGGER_CLASS}`) !== this.tooltipTrigger
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
    this.triangle.removeAttribute('style')

    const oldTipPosition = TOOLTIP_PREFIX + this.element.dataset.position

    const positionProp = this.getPositionProp()
    this.element.classList.remove(positionProp)
    this.element.classList.add(oldTipPosition)
  }

  inScreen(position) {
    if (CALCULATE_NAV_OFFSET) {
      this.navHeight = this.nav ? this.nav.offsetHeight : 0
    } else {
      this.navHeight = 0
    }
    Object.keys(position).forEach(key => {
      const positionInScreen = this.oldPosition(key, position[key])
      if (positionInScreen < 0) {
        this.newPosition(key, positionInScreen)
      }
    })
  }

  oldPosition(key, position) {
    switch (key) {
      case DIRECTIONS.RIGHT:
        return html.offsetWidth - position
      case DIRECTIONS.BOTTOM:
        return window.innerHeight - position
      case DIRECTIONS.TOP:
        return position - this.navHeight
      default:
        return position
    }
  }

  static newPositionKey(key) {
    switch (key) {
      case DIRECTIONS.RIGHT:
        return DIRECTIONS.LEFT
      case DIRECTIONS.LEFT:
        return DIRECTIONS.RIGHT
      case DIRECTIONS.TOP:
        return DIRECTIONS.BOTTOM
      case DIRECTIONS.BOTTOM:
        return DIRECTIONS.TOP
      default:
        return key
    }
  }

  static reverseNumber(number) {
    return number < 0 ? Math.abs(number) : -Math.abs(number)
  }

  newPosition(key, position) {
    const positionProp = this.getPositionProp()

    if (ScreenDimensions.isTabletPortraitAndBigger) {
      this.newDesktopPosition(key, positionProp, position)
    } else {
      this.newMobilePosition(key, positionProp)
    }
  }

  getPositionProp() {
    return [...this.element.classList]
      .filter(positionProp => TOOLTIP_PROPS.indexOf(positionProp) !== -1)
      .reduce((_a, b) => b, {})
  }

  static getDesktopMargins(key, position) {
    const positionReverse = this.reverseNumber(position)

    switch (key) {
      case DIRECTIONS.TOP:
      case DIRECTIONS.LEFT:
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

  newDesktopPosition(key, positionProp, position) {
    /** If the tooltip is outside the screen, then check if the position isn't in the classname.
         So if the position is left-center and the tooltip is outside the topscreen then do this.
         Not if position is top-center and tooltip is outside the topscreen.
         */
    if (positionProp.indexOf('center') > 0 && positionProp.indexOf(key) === -1) {
      const margins = Tooltip.getDesktopMargins(key, position)

      if (key === DIRECTIONS.BOTTOM || key === DIRECTIONS.TOP) {
        this.element.style.marginTop = `${margins.element}px`
        this.triangle.style.marginTop = `${margins.triangle}px`
      } else {
        this.element.style.marginLeft = `${margins.element}px`
        this.triangle.style.marginLeft = `${margins.triangle}px`
      }
    } else {
      this.element.classList.remove(positionProp)

      const newPosition = positionProp.replace(key, Tooltip.newPositionKey(key))
      this.element.classList.add(newPosition)
    }
  }

  newMobilePosition(key, positionProp) {
    if (key === DIRECTIONS.LEFT || key === DIRECTIONS.RIGHT) {
      this.element.classList.remove(positionProp)

      // Add class for more dynamic control on mobile
      this.element.classList.add(`${TOOLTIP_PREFIX}top-center`, `${TOOLTIP_PREFIX}full-width`)

      const { left } = Tooltip.getElementPositions(this.element)
      const margins = Tooltip.getDesktopMargins(DIRECTIONS.LEFT, left)

      this.element.style.marginLeft = `${margins.element}px`
      this.triangle.style.marginLeft = `${margins.triangle}px`
    }
  }
}

export default Tooltip
