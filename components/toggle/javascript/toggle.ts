import Events from '@utilities/events'

const TOGGLE_ACTIVE_CLASS = 'toggle--is-active'

class Toggle {
  element: HTMLElement
  controls: string | null
  id: string | null
  links: HTMLElement[]
  activeClass: string
  _isActive = false
  interactiveElements: HTMLElement[]

  constructor(element: HTMLElement) {
    this.element = element
    this.controls = element.getAttribute('aria-controls')
    this.id = element.id || this.controls
    this.links = this.getToggleLinks()
    this.activeClass = element.dataset.toggleActiveClass || TOGGLE_ACTIVE_CLASS
    this.interactiveElements = Toggle.getInteractiveElements(this.links)

    this.bindEvents()
    this.setDefaultState()
  }

  set isActive(boolean) {
    this._isActive = boolean
  }

  get isActive() {
    return this._isActive
  }

  /**
   * Bind all events
   */
  bindEvents() {
    this.element.addEventListener('click', event => {
      this.toggleState()

      if (this.element.dataset.togglePreventDefault) {
        event.preventDefault()
      }
    })

    Events.$on(`toggle[${this.id}]::toggle`, event => {
      this.toggleState()
      event.preventDefault()
    })

    Events.$on(`toggle[${this.id}]::check-tabindex`, () => this.checkTabIndex())
  }

  /**
   * Toggles the entire UI state of the toggle component
   */
  toggleState() {
    if (this.element.dataset.toggleLive === 'true') {
      this.links = this.getToggleLinks()
    }

    this.toggleActiveClassNames()
    this.setAccesibilityState()
    this.triggerExternalEvents()

    Events.$trigger(`toggle[${this.id}]::check-tabindex`)
  }

  /**
   * Sets default ARIA, tabIndex and classname roles based on config
   */
  setDefaultState() {
    if (this.element.dataset.toggleDefaultActive === 'true') {
      this.toggleState()
    }

    this.setAccesibilityState()
    Events.$trigger(`toggle[${this.id}]::check-tabindex`)
  }

  /**
   * Toggles all element class names
   */
  toggleActiveClassNames() {
    this.toggleToggleElementActiveState()
    this.toggleLinksClassNames()
  }

  /**
   * Toggles the active classname of the toggle component and toggles aria attribute
   */
  toggleToggleElementActiveState() {
    this.element.classList.toggle(this.activeClass)
    this.isActive = this.element.classList.contains(this.activeClass)
  }

  /**
   * Toggles the active classname of the toggle components links
   */
  toggleLinksClassNames() {
    const toggleAction = this.isActive ? 'add' : 'remove'
    this.links.forEach(link => link.classList[toggleAction](this.activeClass))
  }

  /**
   * Toggles the ARIA attributes
   */
  setAccesibilityState() {
    this.element.setAttribute('aria-expanded', this.isActive.toString())
    this.links.forEach(link => link.setAttribute('aria-hidden', (!this.isActive).toString()))
  }

  /**
   * Triggers external events based on new state
   */
  triggerExternalEvents() {
    const newState = this.isActive ? 'opened' : 'closed'
    Events.$trigger(`toggle[${this.id}]::${newState}`)
    Events.$trigger(`toggle[${this.id}]::toggled`, {
      data: this.isActive,
    })
  }

  /**
   * Get all the external link elements from the toggle component
   */
  getToggleLinks() {
    const ariaControls = this.controls
    if (!ariaControls) return []

    const LINKS_SELECTOR = ariaControls
      .split(/[ ,]+/)
      .map(id => `#${id}`)
      .join(', ')

    return Array.from(document.querySelectorAll<HTMLElement>(LINKS_SELECTOR))
  }

  /**
   * Set initial tab index
   */
  checkTabIndex() {
    Toggle.setTabIndex(this.interactiveElements, this._isActive ? 0 : -1)
  }

  /**
   * Find all interactive children in a toggleable element that are hidden when toggled
   * @param elementsToToggle, array with all elements controlled by the toggle
   */
  static getInteractiveElements(elementsToToggle: Toggle['links']) {
    const itemsBelowToggle: Toggle['interactiveElements'] = []

    elementsToToggle.forEach(element => {
      const parentHeight = element.clientHeight
      const parentOffsetTop = element.offsetTop // In case parent isn't relatively positioned
      const interactiveChildren = element.querySelectorAll<HTMLElement>(
        'a, area, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, video',
      )

      const hiddenElements = [...interactiveChildren].filter(
        childElement => childElement.offsetTop - parentOffsetTop >= parentHeight,
      )

      itemsBelowToggle.push(...hiddenElements)
    })

    return itemsBelowToggle
  }

  /**
   * Set tab index for DOM elements
   */
  static setTabIndex(elements: Toggle['interactiveElements'], value: number) {
    elements.forEach(element => {
      element.tabIndex = value
    })
  }
}

export default Toggle
