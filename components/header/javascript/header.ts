import RafThrottle from '@utilities/raf-throttle'

const HEADER_SHADOW_CLASS = 'header--has-shadow'
class Header {
  element: HTMLElement
  height = 0
  scrollValue = 0
  prevScrollValue = 0
  translateValue = 0
  _initialized = false
  scrollingDistanceHeight: number
  stickyElementTop: number
  isScrollingDown: boolean

  constructor(element: HTMLElement) {
    this.element = element

    if (!this.element) return
    this.bindEvents()
  }

  private get fixed() {
    return this.element.hasAttribute('fixed')
  }

  private get condenses() {
    return this.element.hasAttribute('condenses')
  }

  private get reveals() {
    return this.element.hasAttribute('reveals')
  }

  private get shadow() {
    return this.element.hasAttribute('shadow')
  }

  private set shadow(val) {
    this.element.classList[val ? 'add' : 'remove'](HEADER_SHADOW_CLASS)
  }

  private get maxHeaderHeight() {
    return this.fixed ? this.scrollingDistanceHeight : this.height
  }

  /**
   * Gets element with [sticky] attribute
   * Takes the first direct child when [sticky] attribute is not set
   */
  private get stickyElement() {
    const elements = this.element.childNodes

    let stickyElement

    for (let i = 0, len = elements.length; i < len; i++) {
      if (elements[i].nodeType === Node.ELEMENT_NODE) {
        const element = elements[i] as HTMLElement

        if (element.hasAttribute('sticky')) {
          stickyElement = element
        }

        if (!stickyElement) {
          stickyElement = element
        }
      }
    }

    return stickyElement
  }

  private bindEvents() {
    RafThrottle.set([
      {
        element: window,
        event: 'scroll',
        namespace: 'HeaderScroll',
        fn: () => this.scrollHandler(),
      },
    ])

    if (!this._initialized) this.scrollHandler()
  }

  private get isOnScreen() {
    return this.height !== 0 && this.translateValue < this.height
  }

  private scrollHandler() {
    this.height = this.element.offsetHeight
    this.scrollingDistanceHeight = this.stickyElement
      ? this.height - this.stickyElement.offsetHeight
      : 0
    this.stickyElementTop = this.stickyElement ? this.stickyElement.offsetTop : 0

    this.scrollValue = window.pageYOffset

    this.calculateHeaderTranslateValue()
  }

  /**
   * Calculates the header translate value based on the options that are set
   */

  private calculateHeaderTranslateValue() {
    const scrollDiff = this.scrollValue - this.prevScrollValue

    if (this.condenses || !this.fixed) {
      if (this.reveals) {
        this.translateValue = Math.min(
          this.maxHeaderHeight,
          Math.max(0, this.translateValue + scrollDiff),
        )
      } else {
        this.translateValue = Math.min(this.maxHeaderHeight, Math.max(0, this.scrollValue))
      }
    }

    if (this.scrollValue >= this.scrollingDistanceHeight) {
      this.translateValue =
        this.condenses && !this.fixed
          ? Math.max(this.scrollingDistanceHeight, this.translateValue)
          : this.translateValue
    }

    this.isScrollingDown = this.scrollValue > this.prevScrollValue
    this.prevScrollValue = this.scrollValue

    if (this.reveals || this.stickyElement || (this.fixed && this.condenses)) {
      this.transformHeader(this.scrollValue <= 0 ? 0 : this.translateValue)
    }

    if (this.shadow) {
      this.applyShadow()
    }
  }

  private applyShadow() {
    if (this.fixed) {
      this.element.classList.add(HEADER_SHADOW_CLASS)
    }

    if (this.scrollValue <= 0 || !this.isOnScreen) {
      this.element.classList.remove(HEADER_SHADOW_CLASS)
    }

    if (this.isOnScreen && this.scrollValue > 0 && !this.isScrollingDown) {
      this.element.classList.add(HEADER_SHADOW_CLASS)
    }
  }

  /**
   * Applies the calculated value from calculateHeaderTranslateValue to the header
   * and applies it to the sticky element when a sticky element is available
   */

  private transformHeader(value: number) {
    this.element.style.setProperty('--header-translate-value', `-${value}px`)

    if (this.stickyElement) {
      this.element.style.setProperty(
        '--header-sticky-element-translate-value',
        `${Math.min(value, this.scrollingDistanceHeight) - this.stickyElementTop}px`,
      )

      if (this.condenses && value >= this.stickyElementTop) {
        this.element.style.setProperty(
          '--header-sticky-element-translate-value',
          `${Math.min(value, this.scrollingDistanceHeight) - this.stickyElementTop}px`,
        )
      } else {
        this.element.style.setProperty('--header-sticky-element-translate-value', `0px`)
      }
    }

    this._initialized = true
  }
}

export default Header
