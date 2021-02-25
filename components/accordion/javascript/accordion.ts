import Events from '@utilities/events'

const HOOK_ACCORDION_DETAIL = '[js-hook-accordion-item]'
const HOOK_ACCORDION_SUMMARY = '[js-hook-accordion-summary]'
const HOOK_ACCORDION_CONTENT = '[js-hook-accordion-content]'

const CLASS_ACCORDION_TAB_ACTIVE = 'accordion__tab-button--is-active'

interface Settings {
  autoclose: boolean
  tabsOnDesktop: boolean
  breakpointDesktop: number
  animateOptions: AnimationOptions
}

interface AnimationOptions {
  duration: number
  easing: string
}

interface AccordionItem {
  id: string,
  detail: HTMLDetailsElement
  summary: HTMLElement
  content: HTMLElement
  animation?: Animation
  isClosing: boolean
  isExpanding: boolean
}

class Accordion {
  private element: HTMLElement
  private settings: Settings
  private accordionItems: AccordionItem[]

  constructor(element: HTMLElement) {
    this.element = element

    this.createDetailsArray()
    this.bindEvents()

    this.settings = {
      autoclose: !!this.element.dataset.autoclose,
      tabsOnDesktop: !!this.element.dataset.tabsOnDesktop,
      breakpointDesktop: 1024,
      animateOptions: {
        duration: 200,
        easing: 'ease-out',
      },
    }
  }

  createDetailsArray() {
    const accordionItems = [...this.element.querySelectorAll<HTMLDetailsElement>(HOOK_ACCORDION_DETAIL)]
    this.accordionItems = accordionItems.map((item) => ({
      id: item.id,
      detail: item,
      summary: item.querySelector<HTMLElement>(HOOK_ACCORDION_SUMMARY)!,
      content: item.querySelector<HTMLElement>(HOOK_ACCORDION_CONTENT)!,
      isClosing: false,
      isExpanding: false,
    }))
  }

  bindEvents() {
    this.accordionItems.forEach((accordionItem) => {
      accordionItem.summary?.addEventListener('click', (e) => this.handleSummaryClick(e, accordionItem))

      Events.$on(`accordion[${accordionItem.id}]::open`, () => {
        if (!accordionItem.isExpanding && !accordionItem.animation) {
          this.open(accordionItem)
        }
      })

      Events.$on(`accordion[${accordionItem.id}]::close`, () => {
        if (!accordionItem.isClosing && !accordionItem.animation) {
          this.close(accordionItem)
        }
      })

      Events.$on(`accordion[${accordionItem.id}]::toggle`, () => {
        if (!accordionItem.animation) {
          accordionItem.detail.open ? this.close(accordionItem) : this.open(accordionItem)
        }
      })
    })
  }

  handleSummaryClick(e: MouseEvent, item: AccordionItem) {
    e.preventDefault()

    if (item.isClosing || !item.detail.open) {
      this.open(item)
    } else if (item.isExpanding || item.detail.open) {
      this.close(item)
    }
  }

  close(item: AccordionItem) {
    item.isClosing = true

    const startHeight = `${item.detail?.offsetHeight || 0}px`
    const endHeight = `${item.summary?.offsetHeight || 0}px`

    item.animation?.cancel()

    item.animation = item.detail.animate(
      this.getAnimationObj(startHeight, endHeight, false),
      this.settings.animateOptions,
    )

    item.animation.onfinish = () => this.onAnimationFinish(item, false)
    item.animation.oncancel = () => (item.isClosing = false)

    this.element
      .querySelector(`[aria-controls=${item.id}]`)
      ?.classList.remove(CLASS_ACCORDION_TAB_ACTIVE)
  }

  open(item: AccordionItem) {
    if (
      this.settings.autoclose ||
      (this.settings.tabsOnDesktop && window.innerWidth >= this.settings.breakpointDesktop)
    )
      this.closeAll()

    item.detail.style.height = `${item.detail.offsetHeight}px`
    item.detail.open = true
    window.requestAnimationFrame(() => this.expand(item))

    this.element
      .querySelector(`[aria-controls=${item.id}]`)
      ?.classList.add(CLASS_ACCORDION_TAB_ACTIVE)
  }

  expand(item: AccordionItem) {
    item.isExpanding = true
    const startHeight = `${item.detail.offsetHeight}px`
    const endHeight = `${item.summary.offsetHeight + item.content.offsetHeight}px`

    item.animation?.cancel()

    item.animation = item.detail.animate(
      this.getAnimationObj(startHeight, endHeight, true),
      this.settings.animateOptions,
    )

    item.animation.onfinish = () => this.onAnimationFinish(item, true)
    item.animation.oncancel = () => (item.isExpanding = false)
  }

  onAnimationFinish(item: AccordionItem, open: boolean) {
    item.detail.open = open
    item.isClosing = false
    item.isExpanding = false
    delete item.animation
    item.detail.style.height = item.detail.style.overflow = ''

    Events.$trigger(`accordion[${item.id}]::${item.detail.open ? `opened` : `closed`}`)
  }

  closeAll() {
    this.accordionItems.forEach((accordionItem) => this.close(accordionItem))
  }

  getAnimationObj(startHeight: string, endHeight: string, open: boolean) {
    return this.settings.tabsOnDesktop && window.innerWidth >= this.settings.breakpointDesktop
      ? { opacity: open ? [0, 1] : [1, 0] }
      : { height: [startHeight, endHeight] }
  }
}

export default Accordion
