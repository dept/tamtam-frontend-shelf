/**
 *  @shelf-version: 1.1.0
 */

import Events from '@utilities/events'
import RafThrottle from '@utilities/raf-throttle'

const STICKY_SCROLL_ELEMENT_HOOK = '[js-hook-sticky-scroll-element]'
const STICKY_STUCK_CLASS = 'sticky--is-stuck'
const STICKY_UNSTUCK_CLASS = 'sticky--is-unstuck'

class Sticky {
  constructor(element) {
    this.element = element
    this.id = element.getAttribute('id')
    this.scrollElement = element.querySelector(STICKY_SCROLL_ELEMENT_HOOK)
    this.threshold = element.dataset.stickyThreshold
      ? parseInt(element.dataset.stickyThreshold, 10)
      : 0

    this._bindStickyComponentEvents()

    Events.$trigger(`sticky[${this.id}]::update`)
  }

  /**
   * Bind all sticky component specific events
   */
  _bindStickyComponentEvents() {
    RafThrottle.set([
      {
        element: window,
        event: 'resize',
        namespace: `StickyComponentResize-${this.id}`,
        fn: () => this._setScrollElementSize(),
      },
    ])

    this._setScrollElementSize()

    Events.$on(`sticky[${this.id}]::recalc`, () => this._setScrollElementSize())
    Events.$on(`sticky[${this.id}]::update`, () =>
      setStickyValues(this.element, this.scrollElement, this.threshold, this.windowHeight),
    )
  }

  /**
   * Calculates the position of an element
   */
  _setScrollElementSize() {
    const isStuck = this.scrollElement.classList.contains(STICKY_STUCK_CLASS)

    if (isStuck) this.scrollElement.classList.remove(STICKY_STUCK_CLASS)

    this.scrollElement.style.width = ''
    this.scrollElement.position = this.scrollElement.getBoundingClientRect()

    if (isStuck) this.scrollElement.classList.add(STICKY_STUCK_CLASS)

    this.scrollElement.style.width = `${this.scrollElement.position.width}px`

    this.element.position = this.element.getBoundingClientRect()
    this.windowHeight = window.innerHeight
  }
}

/**
 * Sets the classes for the sticky element
 * @param {HTMLElement & {inviewProperties: any, position: any}} element sticky component lane element
 * @param {HTMLElement & {inviewProperties: any, position: any}} scrollElement Element that is updated
 * @param {number} threshold amount of offset before starting the animation
 * @param {number} windowHeight Height of window
 */
function setStickyValues(element, scrollElement, threshold, windowHeight) {
  if (elementCantBeSticky(element, scrollElement, threshold, windowHeight)) {
    resetStickyClasses(scrollElement)
    return
  }

  if (element.inviewProperties.position.top - threshold <= 0) {
    if (
      element.inviewProperties.position.top - scrollElement.position.height - threshold >=
      -element.inviewProperties.height
    ) {
      setStickyClasses(scrollElement, threshold)
    } else {
      setUnStickyClasses(scrollElement)
    }
  } else {
    resetStickyClasses(scrollElement)
  }
}

function elementCantBeSticky(element, scrollElement, threshold, windowHeight) {
  return (
    !element.inviewProperties ||
    windowHeight <= scrollElement.position.height + threshold ||
    element.position.height <= scrollElement.position.height
  )
}

function setStickyClasses(scrollElement, threshold) {
  scrollElement.style.top = `${threshold}px`
  scrollElement.classList.add(STICKY_STUCK_CLASS)
  scrollElement.classList.remove(STICKY_UNSTUCK_CLASS)
}

function setUnStickyClasses(scrollElement) {
  scrollElement.style.top = ''
  scrollElement.classList.add(STICKY_UNSTUCK_CLASS)
  scrollElement.classList.remove(STICKY_STUCK_CLASS)
}

function resetStickyClasses(scrollElement) {
  scrollElement.style.top = ''
  scrollElement.classList.remove(STICKY_STUCK_CLASS)
  scrollElement.classList.remove(STICKY_UNSTUCK_CLASS)
}

export default Sticky
