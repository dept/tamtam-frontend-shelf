import 'intersection-observer'
import Events from '@utilities/events'

/**
 * @type {Window|Element}
 */

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

class InView {
  constructor() {
    this.nodes = getNodes()
    this.observer = null
    this.setObserver()
    this.bindEvents()
  }

  bindEvents() {
    Events.$on('in-view::update', (_event, data) => {
      const elements = data && data.elements ? data.elements : undefined
      const hook = data && data.hook ? data.hook : undefined
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
        const attribute = node.getAttribute(INVIEW_THRESHOLD_HOOK)
        node.__inviewThreshold = attribute ? parseFloat(attribute) || false : false
      }
      if (!node.__inviewInitialized && this.observer) {
        this.observer.observe(node)
      }
      if (!node.__inviewInitialized) {
        node.__inviewInitialized = true
      }
    })
  }

  onObserve(entries) {
    entries.forEach(entry => this.whenElementInViewport(entry, this.observer))
  }

  whenElementInViewport(entry, observer) {
    const element = entry.target
    const triggers = element.__inviewTriggerHook

    element.inviewProperties = calculateInviewProperties(entry)

    if (elementIsPastBottom(entry, element)) {
      element.classList.remove(INVIEW_OUTVIEW_CLASS)
      triggerEvents(getTriggers(triggers), element)

      if (!element.__inviewPersistent) observer.unobserve(entry.target)
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

  addElements(elements = getNodes(), hook = false) {
    elements.forEach(element => {
      if (element.__inviewInitialized) {
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

function elementIsPastBottom(entry, element) {
  return (
    // Element is past bottom of the screen
    element.inviewProperties.scrolledPastViewport.bottom &&
    (element.inviewProperties.scrolledPastViewport.left ||
      element.inviewProperties.scrolledPastViewport.right) &&
    // Element does not have a threshold or it has a threshold and the threshold is met
    (!element.__inviewThreshold ||
      (element.__inviewThreshold && element.__inviewThreshold <= entry.intersectionRatio))
  )
}

function triggerEvents(triggers, data) {
  triggers.forEach(trigger => {
    Events.$trigger(trigger, { data })
  })
}

function getTriggers(triggers) {
  return triggers ? triggers.split(',') : []
}

/**
 * @typedef {Element & {
 *  __inviewTriggerHook: any
 *  __inviewPersistent: any
 *  __inviewThreshold: any
 *  __inviewInitialized: any
 * }} InViewElement
 * @return {InViewElement[]}
 */
function getNodes() {
  return Array.from(document.querySelectorAll(INVIEW_JS_HOOK))
}

/**
 * Checks if given element is in viewport
 * @param {Object} entry Intersection observer entry
 */
function calculateInviewProperties(entry) {
  const rootHeight = entry.rootBounds ? entry.rootBounds.height : 0
  const rootWidth = entry.rootBounds ? entry.rootBounds.width : 0

  return getInViewDirections(entry, rootHeight, rootWidth)
}

/**
 * Get matching in view directions
 * @param entry
 * @param rootHeight
 * @param rootWidth
 * @returns {Object}
 */
function getInViewDirections(entry, rootHeight, rootWidth) {
  const { width, height, top, bottom, left, right } = entry.boundingClientRect
  const scrolledPastViewportObject = scrolledPastViewport(
    entry.boundingClientRect,
    rootHeight,
    rootWidth,
    elementIsVisible(width, height),
  )

  return {
    position: { top, right, bottom, left },
    scrolledPastViewport: scrolledPastViewportObject,
    isInViewport: isInViewport(entry, scrolledPastViewportObject),
    height,
    width,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }
}

function scrolledPastViewport(boundingClientRect, rootHeight, rootWidth, isVisible) {
  const { top, left, height } = boundingClientRect
  return {
    top: top + height < 0 && isVisible,
    bottom: top <= rootHeight && isVisible,
    right: left <= rootWidth && isVisible,
    left: left <= 0 && isVisible,
  }
}

function isInViewport(entry, scrolledPastViewport) {
  return {
    horizontal: entry.isIntersecting && (scrolledPastViewport.left || scrolledPastViewport.right),
    vertical: entry.isIntersecting && (scrolledPastViewport.top || scrolledPastViewport.bottom),
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

function elementIsVisible(width, height) {
  return width > 0 || height > 0
}

export default new InView()
