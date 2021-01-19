import Events from '@utilities/events'

const HOOK_ACCORDION_DETAIL = '[js-hook-accordion-detail]'
const HOOK_ACCORDION_SUMMARY = '[js-hook-accordion-summary]'
const HOOK_ACCORDION_CONTENT = '[js-hook-accordion-content]'

const CLASS_ACCORDION_TAB_ACTIVE = 'accordion__tab-button--is-active'

class Accordion {
  constructor(element) {
    this.element = element

    this.createDetailsArray().then(() => this.bindEvents())

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
    return new Promise(resolve => {
      this.details = []
      const details = [...this.element.querySelectorAll(HOOK_ACCORDION_DETAIL)]

      details.forEach(detail => {
        this.details[detail.id] = {
          id: detail.id,
          detail: detail,
          summary: detail.querySelector(HOOK_ACCORDION_SUMMARY),
          content: detail.querySelector(HOOK_ACCORDION_CONTENT),
          animation: null,
          isClosing: false,
          isExpanding: false,
        }
      })

      resolve()
    })
  }

  bindEvents() {
    Object.entries(this.details).forEach(detail => {
      const [key, value] = detail

      value.summary.addEventListener('click', e => this.handleSummaryClick(e, value))

      Events.$on(`accordion[${key}]::open`, () => {
        if (!value.isExpanding && !value.animation) {
          this.open(value)
        }
      })

      Events.$on(`accordion[${key}]::close`, () => {
        if (!value.isClosing && !value.animation) {
          this.close(value)
        }
      })

      Events.$on(`accordion[${key}]::toggle`, () => {
        if (!value.animation) {
          value.detail.open ? this.close(value) : this.open(value)
        }
      })
    })
  }

  handleSummaryClick(e, item) {
    e.preventDefault()

    if (item.isClosing || !item.detail.open) {
      this.open(item)
    } else if (item.isExpanding || item.detail.open) {
      this.close(item)
    }
  }

  close(item) {
    item.isClosing = true

    const startHeight = `${item.detail.offsetHeight}px`
    const endHeight = `${item.summary.offsetHeight}px`

    if (item.animation) {
      item.animation.cancel()
    }

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

  open(item) {
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

  expand(item) {
    item.isExpanding = true
    const startHeight = `${item.detail.offsetHeight}px`
    const endHeight = `${item.summary.offsetHeight + item.content.offsetHeight}px`

    if (item.animation) {
      item.animation.cancel()
    }

    item.animation = item.detail.animate(
      this.getAnimationObj(startHeight, endHeight, true),
      this.settings.animateOptions,
    )

    item.animation.onfinish = () => this.onAnimationFinish(item, true)
    item.animation.oncancel = () => (item.isExpanding = false)
  }

  onAnimationFinish(item, open) {
    item.detail.open = open
    item.animation = null
    item.isClosing = false
    item.isExpanding = false
    item.detail.style.height = item.detail.style.overflow = ''

    Events.$trigger(`accordion[${item.id}]::${item.detail.open ? `opened` : `closed`}`)
  }

  closeAll() {
    Object.values(this.details).forEach(detail => {
      this.close(detail)
    })
  }

  getAnimationObj(startHeight, endHeight, open) {
    return this.settings.tabsOnDesktop && window.innerWidth >= this.settings.breakpointDesktop
      ? { opacity: open ? [0, 1] : [1, 0] }
      : { height: [startHeight, endHeight] }
  }
}

export default Accordion
