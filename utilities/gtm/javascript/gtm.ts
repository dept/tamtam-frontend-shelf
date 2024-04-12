import Events from '@/utilities/events'

export type GTMEntry = Record<string, any>

class GTM {
  constructor() {
    this._bindEvents()
  }

  _bindEvents() {
    Events.$on<GTMEntry>('gtm::push', (_, data) => this.push(data))
  }

  push(data: GTMEntry) {
    let { dataLayer } = window

    dataLayer = dataLayer || []
    dataLayer.push(data)
  }
}

export default new GTM()
