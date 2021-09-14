import Events from '@utilities/events'
import InView from '@utilities/in-view'

const LAZY_IMAGE_HOOK = '.c-image'
const LAZY_IMAGE_SRC_HOOK = 'data-src'
const LAZY_IMAGE_SRCSET_HOOK = 'data-srcset'
const LAZY_IMAGE_ANIMATE_IN_CLASS = 'image--is-loaded'

class LazyImage {
  constructor() {
    this.images = getImageNodes(LAZY_IMAGE_HOOK)
    this._bindEvents()
    this._setObserverables()
  }

  _bindEvents() {
    Events.$on('lazyimage::load', (e, element) => this._loadImage(element))
    Events.$on('lazyimage::update', () => this._updateImages())
  }

  _setObserverables() {
    InView.addElements(this.images, 'lazyimage::load')
  }

  /**
   * Load the image
   * @param {HTMLElement} element Figure element
   */
  _loadImage(element) {
    const image = element.querySelector('img')
    if (!image) return
    const src = image.getAttribute(LAZY_IMAGE_SRC_HOOK)
    const srcset = image.getAttribute(LAZY_IMAGE_SRCSET_HOOK)

    // If there is no data-src set just render the element.
    if (!src && image.src) {
      this._renderImage(element)
      return
    }

    image.src = ''
    image.onload = () => this._renderImage(element)
    image.src = src
    if (SUPPORTS_SRCSET && srcset) {
      image.srcset = srcset
    }

  }
  /**
   * Set image source
   * @param {HTMLElement} element Figure element
   */
  _renderImage(element) {
    const image = element.querySelector('img')
    element.classList.add(LAZY_IMAGE_ANIMATE_IN_CLASS)
    image.removeAttribute(LAZY_IMAGE_SRC_HOOK)
    image.removeAttribute(LAZY_IMAGE_SRCSET_HOOK)
  }
  /**
   * Update new images
   */
  _updateImages() {
    this.images = getImageNodes(LAZY_IMAGE_HOOK)
    this._setObserverables()
  }
}

/**
 * Check if srcset is supported
 * @param {String} selector Lookup identifier
 * @returns {Array}
 */
function getImageNodes(selector) {
  return Array.from(document.querySelectorAll(selector))
}
export default new LazyImage()
