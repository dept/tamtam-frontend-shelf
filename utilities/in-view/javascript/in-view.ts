import Events from '@/utilities/events'

const SCROLL_ELEMENT: Window | HTMLElement = window

const OBSERVER_DEFAULT_OFFSET_Y = 0
const OBSERVER_DEFAULT_OFFSET_X = 0
const OBSERVER_DEFAULT_THRESHOLD = buildThresholdList()

const INVIEW_JS_HOOK = '[js-hook-inview]'
const INVIEW_TRIGGERS_HOOK = 'data-inview-trigger'
const INVIEW_OUTVIEW_CLASS = 'is--out-view'
const INVIEW_THRESHOLD_HOOK = 'data-inview-threshold'
const INVIEW_PERSISTENT_HOOK = 'data-inview-persistent'

const CONFIG = {
  rootMargin: `${OBSERVER_DEFAULT_OFFSET_Y}px ${OBSERVER_DEFAULT_OFFSET_X}px`,
  threshold: OBSERVER_DEFAULT_THRESHOLD,
}

type InViewProperties = {
  position: {
    top: number
    right: number
    bottom: number
    left: number
  }
  scrolledPastViewport: {
    top: boolean
    bottom: boolean
    right: boolean
    left: boolean
  }
  isInViewport: {
    horizontal: boolean
    vertical: boolean
  }
  height: number
  width: number
  windowHeight: number
  windowWidth: number
}

export type InViewElement = Element & {
  __inviewTriggerHook?: string | null
  __inviewPersistent?: boolean
  __inviewThreshold?: number
  __inviewInitialised?: boolean
  inviewProperties?: InViewProperties
}

type InViewUpdateProps = {
  elements?: HTMLElement[]
  hook?: string
}

class InView {
  nodes: InViewElement[] = getNodes()
  observer: IntersectionObserver | null = null

  constructor() {
    this.setObserver()
    this.bindEvents()
  }

  bindEvents() {
    Events.$on<InViewUpdateProps>('in-view::update', (_, data) => {
      const elements = data?.elements || undefined
      const hook = data?.hook || undefined
      this.addElements(elements, hook)
    })
  }

  setObserver() {
    this.observer = new IntersectionObserver(this.onObserve.bind(this), CONFIG)
    this.bindObservedNodes()
  }

  bindObservedNodes() {
    this.nodes.forEach(node => {
      if (!node.__inviewTriggerHook) {
        node.__inviewTriggerHook = node.getAttribute(INVIEW_TRIGGERS_HOOK)
      }
      if (!node.__inviewPersistent) {
        node.__inviewPersistent = node.getAttribute(INVIEW_PERSISTENT_HOOK) === 'true'
      }
      if (!node.__inviewThreshold) {
        const threshold = node.getAttribute(INVIEW_THRESHOLD_HOOK)
        node.__inviewThreshold = threshold ? parseFloat(threshold) || 0 : 0
      }
      if (!node.__inviewInitialised && this.observer) {
        this.observer.observe(node)
      }
      if (!node.__inviewInitialised) {
        node.__inviewInitialised = true
      }
    })
  }

  onObserve(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => this.whenElementInViewport(entry, this.observer!))
  }

  whenElementInViewport(entry: IntersectionObserverEntry, observer: IntersectionObserver) {
    const element = entry.target as InViewElement
    const triggers = element.__inviewTriggerHook

    element.inviewProperties = calculateInviewProperties(entry)

    if (
      // Element is past bottom of the screen
      element.inviewProperties.scrolledPastViewport.bottom &&
      (element.inviewProperties.scrolledPastViewport.left ||
        element.inviewProperties.scrolledPastViewport.right) &&
      // Element does not have a threshold or it has a threshold and the threshold is met
      (!element.__inviewThreshold ||
        (element.__inviewThreshold && element.__inviewThreshold <= entry.intersectionRatio))
    ) {
      element.classList.remove(INVIEW_OUTVIEW_CLASS)
      triggerEvents(getTriggers(triggers), element)

      if (!element.__inviewPersistent) observer.unobserve(element)
    } else {
      element.classList.add(INVIEW_OUTVIEW_CLASS)

      if (
        element.__inviewPersistent &&
        (element.inviewProperties.scrolledPastViewport.left ||
          element.inviewProperties.scrolledPastViewport.right)
      )
        triggerEvents(getTriggers(triggers), element)
    }
  }

  addElements(elements = getNodes(), hook?: string) {
    elements.forEach((element: InViewElement) => {
      if (element.__inviewInitialised) {
        return
      }
      if (hook) {
        element.__inviewTriggerHook = hook
      }

      this.nodes.push(element)

      this.bindObservedNodes()
    })
  }
}

function triggerEvents(triggers: string[], data: InViewElement) {
  triggers.forEach(trigger => {
    Events.$trigger(trigger, { data })
  })
}

function getTriggers(triggers?: string | null) {
  return triggers ? triggers.split(',') : []
}

function getNodes() {
  return Array.from(document.querySelectorAll<HTMLElement>(INVIEW_JS_HOOK))
}

/**
 * Checks if given element is in viewport
 * @param {Object} entry Intersection observer entry
 */
function calculateInviewProperties(entry: IntersectionObserverEntry): InViewProperties {
  let scrollTop
  let scrollLeft

  if (SCROLL_ELEMENT instanceof Window) {
    scrollTop = SCROLL_ELEMENT.pageYOffset || document.documentElement.scrollTop
    scrollLeft = SCROLL_ELEMENT.pageXOffset || document.documentElement.scrollLeft
  } else {
    scrollTop = SCROLL_ELEMENT.scrollTop || document.documentElement.scrollTop
    scrollLeft = SCROLL_ELEMENT.scrollLeft || document.documentElement.scrollLeft
  }

  const { top, bottom, left, right } = getElementOffset(entry)
  const position = { top, bottom, left, right }

  const rootHeight = entry.rootBounds ? entry.rootBounds.height : 0
  const rootWidth = entry.rootBounds ? entry.rootBounds.width : 0

  return getInViewDirections({
    entry,
    position,
    rootHeight,
    rootWidth,
    scrollTop,
    scrollLeft,
  })
}

/**
 * Returns the offsetTop and offsetLeft of given element
 */
function getElementOffset(entry: IntersectionObserverEntry): InViewProperties['position'] {
  let targetElement: HTMLElement = entry.target as HTMLElement
  const elementStyles = window.getComputedStyle(targetElement)

  const margin = {
    top: (elementStyles.marginTop && parseInt(elementStyles.marginTop, 10) / 2) || 0,
    right: (elementStyles.marginRight && parseInt(elementStyles.marginRight, 10) / 2) || 0,
    bottom: (elementStyles.marginBottom && parseInt(elementStyles.marginBottom, 10) / 2) || 0,
    left: (elementStyles.marginLeft && parseInt(elementStyles.marginLeft, 10) / 2) || 0,
  }
  let top = 0 + margin.top + margin.bottom
  let left = 0 + margin.left + margin.right

  do {
    top += targetElement.offsetTop || 0
    left += targetElement.offsetLeft || 0
    targetElement = targetElement.offsetParent as HTMLElement
  } while (targetElement)

  return {
    top,
    left,
    right: left + entry.boundingClientRect.width,
    bottom: top + entry.boundingClientRect.height,
  }
}

/**
 * Get matching in view directions
 */
function getInViewDirections(
  options: {
    entry: IntersectionObserverEntry
    rootHeight: number
    rootWidth: number
    scrollTop: number
    scrollLeft: number
  } & Pick<InViewProperties, 'position'>,
): InViewProperties {
  const { width, height } = options.entry.boundingClientRect

  const topPosition = options.entry.boundingClientRect.top
  const bottomPosition = options.entry.boundingClientRect.bottom
  const leftPosition = options.entry.boundingClientRect.left
  const rightPosition = options.entry.boundingClientRect.right

  const isVisible = elementIsVisible(width, height)

  const scrolledPastViewport = {
    top: isVisible && topPosition + height < 0,
    bottom: isVisible && topPosition <= options.rootHeight,
    right: isVisible && leftPosition <= options.rootWidth,
    left: isVisible && leftPosition <= 0,
  }

  const isInViewport = {
    horizontal:
      options.entry.isIntersecting && (scrolledPastViewport.left || scrolledPastViewport.right),
    vertical:
      options.entry.isIntersecting && (scrolledPastViewport.top || scrolledPastViewport.bottom),
  }

  return {
    position: {
      top: topPosition,
      right: rightPosition,
      bottom: bottomPosition,
      left: leftPosition,
    },
    scrolledPastViewport,
    isInViewport,
    height,
    width,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }
}

function buildThresholdList() {
  const numSteps = 1000
  const thresholds = []

  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps
    thresholds.push(ratio)
  }

  thresholds.push(0)
  return thresholds
}

function elementIsVisible(width: number, height: number) {
  return width > 0 || height > 0
}

export default new InView()
