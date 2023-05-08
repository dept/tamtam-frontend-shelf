import Events from '@/utilities/events'

const ST_HOOK = 'a[href^="#"]'
const ST_DURATION = 500
const ST_OFFSET = 50

type ScrollToEventProps = {
  target: HTMLElement
  duration?: number
  offset?: number
  scrollElement?: HTMLElement
}

type ScrollToProps = {
  position: DOMRect
  duration: number
  offset: number
  scrollElement?: HTMLElement
}

type ScrollToElement = HTMLElement & {
  _scrollToisInitialised?: boolean
}

class ScrollTo {
  constructor() {
    this._bindEvents()
    this._initElements()
  }

  /**
   * Bind event
   */
  _bindEvents() {
    Events.$on<ScrollToEventProps>('scroll-to::scroll', (_event, data) => {
      if (!data?.target) return

      const { target, duration = ST_DURATION, offset = ST_OFFSET, scrollElement } = data

      this.scrollToAndSetFocus({
        target,
        duration,
        offset,
        scrollElement,
      })
    })

    document.addEventListener(
      'focus',
      function () {
        console.log('focused: ', document.activeElement)
      },
      true,
    )
  }

  _initElements() {
    document.querySelectorAll<HTMLElement>(ST_HOOK).forEach((element: ScrollToElement) => {
      if (element._scrollToisInitialised) return

      element.addEventListener('click', event => {
        const elementHref = element.getAttribute('href')
        const target = elementHref?.split('#')[1]
        const targetEl = target ? document.getElementById(target) : null

        if (targetEl) {
          event.preventDefault()
          this.scrollToAndSetFocus({
            target: targetEl,
            duration: element.dataset.scrollDuration
              ? parseInt(element.dataset.scrollDuration, 10)
              : ST_DURATION,
            offset: element.dataset.scrollOffset
              ? parseInt(element.dataset.scrollOffset, 10)
              : ST_OFFSET,
          })
        }
      })

      element._scrollToisInitialised = true
    })
  }

  scrollTo({
    target,
    duration = ST_DURATION,
    offset = ST_OFFSET,
    scrollElement,
  }: ScrollToEventProps) {
    this.scrollToAndSetFocus({
      target,
      duration,
      offset,
      scrollElement,
    })
  }

  scrollToAndSetFocus({
    target,
    duration = ST_DURATION,
    offset = ST_OFFSET,
    scrollElement,
  }: ScrollToEventProps) {
    scrollTo({
      position: target.getBoundingClientRect(),
      duration,
      offset,
      scrollElement,
    }).then(() => {
      const focusTarget = findClosestFocusTarget(target)
      focusTarget.focus()
    })
  }
}

/**
 * Scrolls the window to the top
 */
function scrollTo({ position, duration, offset, scrollElement }: ScrollToProps) {
  return new Promise<void>(resolve => {
    const scrollPosition = scrollElement
      ? scrollElement.scrollTop
      : window.scrollY || window.pageYOffset
    const to = parseInt((position.top + scrollPosition - offset).toFixed(0), 10)
    const start = scrollElement
      ? scrollElement.scrollTop
      : Math.max(document.body.scrollTop, document.documentElement.scrollTop)
    const change = to - start
    let currentTime = 0
    const increment = 10
    const direction = to > start ? 1 : 0

    const animate = () => {
      currentTime += increment
      const val = parseInt(easeInOutQuad(currentTime, start, change, duration).toFixed(0), 10)

      if (scrollElement) {
        scrollElement.scrollTop = val
      } else {
        document.body.scrollTop = val
        document.documentElement.scrollTop = val
      }

      if ((val >= to && direction === 1) || (val <= to && direction === 0)) {
        resolve()
      } else {
        window.requestAnimationFrame(animate)
      }
    }

    animate()
  })
}

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

function findClosestFocusTarget(el: HTMLElement) {
  const elements = el.querySelectorAll<HTMLElement>(
    'a:not([tabindex="-1"]):not([data-focus-trap-ignore]), area:not([tabindex="-1"]):not([data-focus-trap-ignore]), input:not([disabled]):not([tabindex="-1"]):not([type="hidden"]):not([data-focus-trap-ignore]), select:not([disabled]):not([tabindex="-1"]):not([data-focus-trap-ignore]), textarea:not([disabled]):not([tabindex="-1"]):not([data-focus-trap-ignore]), button:not([disabled]):not([tabindex="-1"]):not([data-focus-trap-ignore]), iframe:not([tabindex="-1"]):not([data-focus-trap-ignore])',
  )
  return elements.length ? elements[0] : el
}

export default new ScrollTo()
