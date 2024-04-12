import Events from '@/utilities/events'

type ActivateProps = {
  element: HTMLElement
  autoFocus?: boolean
}

type TrapProps = HTMLElement

class FocusTrap {
  activated = false
  focusTrapElement: HTMLElement | null
  originalFocus: Element | null
  autoFocus?: boolean | null = null

  constructor() {
    this.bindEvents()
  }

  bindEvents() {
    /**
     *  Bind event listeners so other function can invoke the trap.
     */
    Events.$on<ActivateProps>('focustrap::activate', (_, data) => this.activate(data))
    Events.$on('focustrap::deactivate', () => this.deactivate())

    /**
     * The document has an event handler to check the focus
     * This only triggers the trap when it's activated.
     */
    document.addEventListener(
      'focus',
      event => {
        if (this.activated && this.focusTrapElement) {
          Events.$trigger('focustrap::trap', { data: event.target })
        }
      },
      true,
    )

    /**
     * The document also has a trap event which is only called when the trap is active
     * And the element is set.
     * On event it will check if the focused element is inside the trap and if not, it will reset to the trap.
     */
    Events.$on<TrapProps>('focustrap::trap', (_event, data) => {
      if (this.focusTrapElement && !this.focusTrapElement.contains(data)) {
        this.focusClosestFocusTarget()
      }
    })
  }

  /**
   * Public method to change the trap
   */
  activate(data: ActivateProps) {
    this.activated = true
    this.focusTrapElement = data.element
    this.originalFocus = document.activeElement
    this.autoFocus = data.autoFocus

    if (this.autoFocus) this.focusClosestFocusTarget()
  }

  /**
   * Finds and focuses the first focusable element inside the trap
   */
  focusClosestFocusTarget() {
    if (this.focusTrapElement) {
      const focusTarget = findClosestFocusTarget(this.focusTrapElement)
      focusTarget.focus()
    }
  }

  /**
   * Public method to cancel the trap
   */
  deactivate() {
    this.activated = false
    this.focusTrapElement = null
    this.autoFocus = false

    if (this.originalFocus) {
      // @ts-ignore
      this.originalFocus.focus()
    }
  }
}

/**
 * Finds the closets focusable target
 */
function findClosestFocusTarget(el: HTMLElement) {
  const elements = el.querySelectorAll<HTMLElement>(
    'a:not([tabindex="-1"]):not([data-focus-trap-ignore]), area:not([tabindex="-1"]):not([data-focus-trap-ignore]), input:not([disabled]):not([tabindex="-1"]):not([type="hidden"]):not([data-focus-trap-ignore]), select:not([disabled]):not([tabindex="-1"]):not([data-focus-trap-ignore]), textarea:not([disabled]):not([tabindex="-1"]):not([data-focus-trap-ignore]), button:not([disabled]):not([tabindex="-1"]):not([data-focus-trap-ignore]), iframe:not([tabindex="-1"]):not([data-focus-trap-ignore])',
  )
  return elements.length ? elements[0] : el
}

export default new FocusTrap()
