/**
 * Accordion item class
 * Will be created for each item inside an accordion
 */
import Events from '@utilities/events'
import ScreenDimensions from '@utilities/screen-dimensions'
import ScrollTo from '@utilities/scroll-to'
import setTabindexOfChildren from '@utilities/set-tabindex-of-children'

const ACCORDION_BUTTON_HOOK = '[js-hook-accordion-button]'
const ACCORDION_CONTENT_HOLDER_HOOK = '[js-hook-accordion-content-holder]'
const ACCORDION_CONTENT_HOOK = '[js-hook-accordion-content]'

const ACCORDION_OPEN_CLASS = 'accordion__item--is-active'
const ACCORDION_ANIMATING_CLASS = 'accordion__item--is-animating'

class AccordionItem {
  constructor(element) {
    this.item = element
    this.isOpen = this.item.classList.contains(ACCORDION_OPEN_CLASS)
    this.isAnimating = false

    this.button = this.item.querySelector(ACCORDION_BUTTON_HOOK)
    this.contentHolder = this.item.querySelector(ACCORDION_CONTENT_HOLDER_HOOK)
    this.content = this.item.querySelector(ACCORDION_CONTENT_HOOK)

    this.id = this.contentHolder.id

    setTabindexOfChildren(this.contentHolder, this.isOpen ? 0 : -1)

    this.bindEvents()
  }

  bindEvents() {
    this.contentHolder.addEventListener('transitionend', event => this.heightTransitionEnd(event))
  }

  set isOpen(boolean) {
    this._isOpen = boolean
  }

  get isOpen() {
    return this._isOpen
  }

  /**
   * Toggles the accordion item
   */
  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  /**
   * Opens the accordion item
   */
  open() {
    if (this.isOpen || this.isAnimating) return

    this.isOpen = true
    this.triggerAnimatingEvent(true)

    this.item.classList.add(ACCORDION_OPEN_CLASS)

    this.setHeight()
    this.setAccessibilityState()
  }

  /**
   * Closes the accordion item
   */
  close() {
    if (!this.isOpen || this.isAnimating) return

    this.isOpen = false
    this.triggerAnimatingEvent(true)

    this.item.classList.remove(ACCORDION_OPEN_CLASS)

    this.setHeight()
    this.setAccessibilityState()
  }

  /**
   * Sets correct aria-* values
   */
  setAccessibilityState() {
    this.button.setAttribute('aria-expanded', this.isOpen)
    this.contentHolder.setAttribute('aria-hidden', !this.isOpen)
    setTabindexOfChildren(this.content, this.isOpen ? 0 : -1)
  }

  /**
   * Sets the height based on the this.isOpen
   */
  setHeight() {
    const { height } = this.content.getBoundingClientRect()

    if (!this.isOpen) this.contentHolder.style.height = `${height}px`

    // The line below triggers a repaint and is necessary for the accordion to work.
    // https://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
    this.contentHolder.offsetHeight // eslint-disable-line

    this.contentHolder.style.height = this.isOpen ? `${height}px` : '0'
  }

  /**
   * Triggers when transitionend is fired
   * @param {Event} event
   */
  heightTransitionEnd(event) {
    if (event.propertyName !== 'height') return
    if (this.isOpen) this.contentHolder.style.height = 'auto'

    this.triggerAnimatingEvent(false)

    const bounding = this.item.getBoundingClientRect()

    // Check if the top or bottom of the item is in view
    if (this.isOpen && (bounding.top < 0 || bounding.bottom > ScreenDimensions.height)) {
      ScrollTo.scrollTo(this.item)
    }

    Events.$trigger(`accordion::${this.isOpen ? 'opened' : 'closed'}`, {
      data: {
        element: this.item,
        id: this.id,
      },
    })

    Events.$trigger(`accordion[${this.id}]::${this.isOpen ? `opened` : `closed`}`)
  }

  /**
   * Triggers the animating event for the accordion holder
   * @param {Boolean} bool
   */
  triggerAnimatingEvent(bool) {
    this.isAnimating = bool

    this.item.classList[this.isAnimating ? 'add' : 'remove'](ACCORDION_ANIMATING_CLASS)

    Events.$trigger(`accordion[${this.id}]::animating`, {
      data: {
        id: this.id,
        animating: this.isAnimating,
      },
    })
  }
}

export default AccordionItem
