import Events from '@utilities/events'
const TAB_ACTIVE_CLASS = 'tabs__tab--is-active'
const TABPANEL_ACTIVE_CLASS = 'tabpanel--is-active'
const TABS_CLASS = '.c-tabs'

const ARIA_CONTROLS = 'aria-controls'
const ARIA_SELECTED = 'aria-selected'
const ARIA_HIDDEN = 'aria-hidden'
const TAB_BUTTON_HOOK = '[js-hook-tab]'

class Tabs {
  element: HTMLElement
  controls: string | null
  tabComponent: HTMLElement | null
  tabs: HTMLElement[] | null
  content: HTMLElement | null

  constructor(element: HTMLElement) {
    this.element = element
    this.controls = element.getAttribute(ARIA_CONTROLS)
    this.content = document.querySelector(`#${this.controls}`)
    this.tabComponent = this.element.closest<HTMLElement>(TABS_CLASS)

    if (!this.tabComponent || !this.content) return

    this.tabs = [...this.tabComponent.querySelectorAll<HTMLElement>(TAB_BUTTON_HOOK)]

    this.bindEvents()
  }

  /**
   * Bind all events
   */
  private bindEvents() {
    this.element.addEventListener('click', () => {
      this.addState()
    })

    Events.$on(`tab[${this.element.id}]::active`, () => {
      this.addState()
    })
  }

  private addState() {
    this.tabs!.forEach(tab => {
      const controls = tab.getAttribute(ARIA_CONTROLS)
      const content = document.querySelector(`#${controls}`)

      if (controls !== this.controls) {
        tab.setAttribute(ARIA_SELECTED, 'false')
        tab.classList.remove(TAB_ACTIVE_CLASS)

        content!.setAttribute(ARIA_HIDDEN, 'true')
        content!.classList.remove(TABPANEL_ACTIVE_CLASS)
      }
    })

    this.element.setAttribute(ARIA_SELECTED, 'true')
    this.element.classList.add(TAB_ACTIVE_CLASS)

    this.content!.setAttribute(ARIA_HIDDEN, 'false')
    this.content!.classList.add(TABPANEL_ACTIVE_CLASS)
  }
}

export default Tabs
