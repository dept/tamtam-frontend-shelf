import Events from '@utilities/events'

class GTM {
  constructor() {
    this._bindEvents()
  }

  _bindEvents() {
    Events.$on('gtm::push', (_event, data) => this.push(data))
  }

  push(data) {
    /**
     * @type {object}
     */
    let { dataLayer } = window

    dataLayer = dataLayer || []
    dataLayer.push(data)
  }
}

export default new GTM()
