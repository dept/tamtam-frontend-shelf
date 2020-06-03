// @ts-ignore
import raf from 'raf'
import Events from '@utilities/events'

const ST_HOOK = 'a[href^="#"]'
const ST_DURATION = 500
const ST_OFFSET = 50

class ScrollTo {
  constructor() {
    this.bindEvents()
    this.initElements()
  }

  /**
   * Bind event
   */
  bindEvents() {
    Events.$on('scroll-to::scroll', (event, data) => this.scroll(data))
  }

  scroll(data) {
    if (!data) return

    const { target, duration = ST_DURATION, offset = ST_OFFSET, scrollElement = false } = data

    if (!target) return

    const scrollConfig = {
      position: target.getBoundingClientRect(),
      duration,
      offset: parseInt(offset, 10),
      scrollElement,
    }

    scrollTo(scrollConfig)
  }

  initElements() {
    this.elements = getElements()

    Array.from(this.elements).forEach(element => {
      if (element.scrollToisInitialised) return

      element.addEventListener('click', event => this.onClick(event, element))

      element.scrollToisInitialised = true
    })
  }

  onClick(event, element) {
    const elementHref = element.getAttribute('href')
    const target = elementHref && elementHref.split('#')
    const targetEl = target && target[1] !== '' ? document.querySelector(`#${target[1]}`) : false

    if (targetEl) {
      event.preventDefault()
      const scrollConfig = {
        position: targetEl.getBoundingClientRect(),
        duration: element.dataset.scrollDuration
          ? parseInt(element.dataset.scrollDuration, 10)
          : ST_DURATION,
        offset: element.dataset.scrollOffset
          ? parseInt(element.dataset.scrollOffset, 10)
          : ST_OFFSET,
        scrollElement: element.dataset.scrollElement,
      }
      scrollTo(scrollConfig)
    }
  }

  scrollTo(target, duration, offset, scrollElement) {
    const scrollConfig = {
      position: target.getBoundingClientRect(),
      duration: typeof duration !== 'undefined' ? parseInt(duration, 10) : ST_DURATION,
      offset: typeof offset !== 'undefined' ? parseInt(offset, 10) : ST_OFFSET,
      scrollElement: scrollElement,
    }

    return scrollTo(scrollConfig)
  }
}

/**
 * Gets all elements matching the ST_HOOK
 * @returns {NodeListOf<Element & { scrollToisInitialised: boolean, dataset: any }>} All matching HTMLElements
 */
function getElements() {
  return document.querySelectorAll(ST_HOOK)
}

function getScrollPosition(scrollElement) {
  return scrollElement ? scrollElement.scrollTop : window.scrollY || window.pageYOffset
}

function getStartPosition(scrollElement) {
  return scrollElement
    ? scrollElement.scrollTop
    : Math.max(document.body.scrollTop, document.documentElement.scrollTop)
}

/**
 * Scrolls the window to the top
 */
function scrollTo({ position, duration, offset, scrollElement }) {
  return new Promise(resolve => {
    const animateArguments = setAnimateArguments(position, offset, scrollElement)
    const { to, start, change, increment, direction } = animateArguments
    let { currentTime } = animateArguments

    const animate = () => {
      currentTime += increment
      const val = parseInt(easeInOutQuad(currentTime, start, change, duration).toFixed(0), 10)

      if (scrollElement) {
        scrollElement.scrollTop = val
      } else {
        document.body.scrollTop = val
        document.documentElement.scrollTop = val
      }

      if ((val >= to && direction === 1) || (val <= to && direction === 0)) resolve()
      else raf(animate)
    }
    animate()
  })
}

function setAnimateArguments(position, offset, scrollElement) {
  const scrollPosition = getScrollPosition(scrollElement)
  const to = parseInt((position.top + scrollPosition - offset).toFixed(0), 10)
  const start = getStartPosition(scrollElement)

  return {
    to,
    start,
    change: to - start,
    currentTime: 0,
    increment: 10,
    direction: to > start ? 1 : 0,
  }
}

function easeInOutQuad(t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

export default new ScrollTo()
