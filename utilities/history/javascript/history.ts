import Events from '@/utilities/events'

type HistoryEventProps = {
  state: any
  url?: string
}

type HistoryCallbackEvent = {
  eventName: 'pushState' | 'replaceState'
  callbackEventName: 'onreplacestate' | 'onpushstate'
}

const callbackEvents: HistoryCallbackEvent[] = [
  {
    eventName: 'pushState',
    callbackEventName: 'onpushstate',
  },
  {
    eventName: 'replaceState',
    callbackEventName: 'onreplacestate',
  },
]

class History {
  constructor() {
    prepareHistoryEvents()
    this.bindEvents()
  }

  /**
   * Bind events
   */
  bindEvents() {
    Events.$on<HistoryEventProps>('history::push', (_, data) => this.pushHistory(data))
    Events.$on<HistoryEventProps>('history::replace', (_, data) => this.replaceHistory(data))
  }

  /**
   * Create a new URL entry in your History
   */
  pushHistory(data: HistoryEventProps) {
    const pushOptions = {
      state: data.state || {},
      url: data.url,
    }

    window.history.pushState(pushOptions.state, document.title, pushOptions.url)
  }

  /**
   * Overwrite current URL entry in your History
   */
  replaceHistory(data: HistoryEventProps) {
    const replaceOptions = {
      state: data.state || {},
      url: data.url,
    }

    window.history.replaceState(replaceOptions.state, document.title, replaceOptions.url)
  }
}

/**
 * Define the events where we are adding a callback to
 */
function prepareHistoryEvents() {
  callbackEvents.forEach(obj => addHistoryCallbackEvent(obj))

  // Add callback to all events
  // @ts-ignore
  window.onpopstate = history.onreplacestate = history.onpushstate = state =>
    Events.$trigger('history::update', { data: { state } })
}

/**
 * Define the events that will get a callback
 */
function addHistoryCallbackEvent(obj: HistoryCallbackEvent) {
  const historyEvent = history[obj.eventName]

  history[obj.eventName] = function (state) {
    //@ts-ignore
    if (typeof history[obj.callbackEventName] == 'function')
      //@ts-ignore
      history[obj.callbackEventName]({ state })

    // eslint-disable-next-line prefer-rest-params
    return historyEvent.apply(history, arguments)
  }
}

export default new History()
