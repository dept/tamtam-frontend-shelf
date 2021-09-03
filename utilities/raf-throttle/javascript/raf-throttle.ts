type RafThrottleEntry = {
  element: Window | Element
  event: string
  namespace: string
  fn: (event: Event) => void
  delay?: number
}

type RafThrottleEventOptions = Pick<
  RafThrottleEntry,
  'element' | 'event' | 'namespace' | 'delay'
> & {
  callback: RafThrottleEntry['fn']
  eventOptions?: Record<string, any>
}

type RafThrottleAddEventOptions = RafThrottleEventOptions
type RafThrottleRemoveEventOptions = Omit<RafThrottleEventOptions, 'callback' | 'eventOptions'>

class RafThrottle {
  namespaces: Record<string, any> = {}
  timeoutList: Record<string, any> = {}
  runningList: Record<string, any> = {}

  /**
   * Public function to set the assigned entries
   */
  set(entries: RafThrottleEntry[]) {
    this._addEvents(entries)
  }

  /**
   * Public function to remove an assigned entry
   */
  remove(entries: RafThrottleEntry[]) {
    if (entries) {
      this._removeEvents(entries)
    }
  }

  /*
   * Private methods
   */

  /**
   * Loop over entries and entry them
   */
  _addEvents(entries: RafThrottleEntry[]) {
    entries.forEach(entry => {
      const eventOptions: RafThrottleAddEventOptions = {
        element: entry.element,
        event: entry.event,
        namespace: generateNamespace(entry.event, entry.namespace),
        callback: (event: Event) => this._trigger(entry, event),
        eventOptions: { passive: true },
        delay: entry.delay,
      }

      this.timeoutList[eventOptions.namespace] = null
      this.runningList[eventOptions.namespace] = false

      this._addThrottledEvent(eventOptions)
    })
  }

  /**
   * Loop over entries and remove them
   */
  _removeEvents(entries: RafThrottleEntry[]) {
    entries.forEach(entry => {
      const eventOptions: RafThrottleRemoveEventOptions = {
        element: entry.element,
        event: entry.event,
        namespace: generateNamespace(entry.event, entry.namespace),
      }

      this._removeThrottledEvent(eventOptions)
    })
  }

  /**
   * Append requestAnimationFrame before firing event
   */
  _trigger(entry: RafThrottleEntry, event: Event) {
    const eventNamespace = generateNamespace(entry.event, entry.namespace)

    if (entry.delay) {
      if (this.timeoutList[eventNamespace]) {
        this.runningList[eventNamespace] = false
        clearTimeout(this.timeoutList[eventNamespace])
      }

      this.timeoutList[eventNamespace] = setTimeout(
        () => this.createRafInstance(entry, event, eventNamespace),
        entry.delay,
      )
    } else {
      this.createRafInstance(entry, event, eventNamespace)
    }
  }

  /**
   * Create requestAnimationFrame instance for entry
   */
  createRafInstance(
    entry: RafThrottleEntry,
    event: Event,
    eventNamespace: RafThrottleEntry['namespace'],
  ) {
    if (this.runningList[eventNamespace]) return

    window.requestAnimationFrame(() => {
      entry.fn(event)
      this.runningList[eventNamespace] = false
    })

    this.runningList[eventNamespace] = true
  }

  /**
   * Bind a namespaced eventlistener to given element
   * @param {Options} options
   */
  _addThrottledEvent(options: RafThrottleAddEventOptions) {
    const { element, event, namespace, callback } = options
    let { eventOptions } = options

    this.namespaces[namespace] = callback
    eventOptions = eventOptions || undefined

    element.addEventListener(event, callback, eventOptions)
  }

  /**
   * Remove a namespaced eventlistener to given element
   */
  _removeThrottledEvent(options: RafThrottleRemoveEventOptions) {
    const { element, event, namespace } = options
    if (this.namespaces[namespace]) {
      element.removeEventListener(event, this.namespaces[namespace])
      delete this.namespaces[namespace]
    }
  }
}

/**
 * Merges the event and the namespace together
 */
function generateNamespace(
  eventName: RafThrottleEntry['event'],
  namespace: RafThrottleEntry['namespace'],
) {
  return `${eventName}.${namespace}`
}

export default new RafThrottle()
