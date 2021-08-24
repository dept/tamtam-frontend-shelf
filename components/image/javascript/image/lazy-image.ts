import Events from '@/utilities/events'
import InView from '@/utilities/in-view'

const LAZY_IMAGE_HOOK = '.c-image'
const LAZY_SHADOW_IMAGE_HOOK = '[js-hook-shadow-image]'
const LAZY_IMAGE_SRC_HOOK = 'data-src'
const LAZY_IMAGE_SRCSET_HOOK = 'data-srcset'
const LAZY_IMAGE_ANIMATE_IN_CLASS = 'image--is-loaded'

class LazyImage {
  images = getImageNodes<HTMLElement>(LAZY_IMAGE_HOOK)
  shadowImages = getImageNodes<HTMLImageElement>(LAZY_SHADOW_IMAGE_HOOK)

  constructor() {
    this._bindEvents()
    this._setObserverables()
  }
  _bindEvents() {
    Events.$on<HTMLElement>('lazyimage::load', (_, element) => this._loadImage(element))
    Events.$on('lazyimage::update', () => this._updateImages())
    this.shadowImages.forEach(shadowImage => LazyImage._removeShadowImage(shadowImage))
  }
  _setObserverables() {
    InView.addElements(this.images, 'lazyimage::load')
  }
  static _removeShadowImage(image?: HTMLImageElement | null) {
    image?.addEventListener('transitionend', () => image.remove(), false)
  }
  /**
   * Load the image
   */
  _loadImage(element: HTMLElement) {
    const image = element.querySelector('img')
    if (!image) return
    const src = image.getAttribute(LAZY_IMAGE_SRC_HOOK)
    const srcset = image.getAttribute(LAZY_IMAGE_SRCSET_HOOK)
    // If there is no data-src set just render the element.
    if (!src || (!src && image.src)) {
      this._renderImage(element)
      return
    }
    image.src = ''
    image.onload = () => this._renderImage(element)
    image.src = src

    if (srcset) image.srcset = srcset
  }
  /**
   * Set image source
   */
  _renderImage(element: HTMLElement) {
    const image = element.querySelector<HTMLImageElement>('img')
    if (!image) return
    element.classList.add(LAZY_IMAGE_ANIMATE_IN_CLASS)
    image.removeAttribute(LAZY_IMAGE_SRC_HOOK)
    image.removeAttribute(LAZY_IMAGE_SRCSET_HOOK)
  }
  /**
   * Update new images
   */
  _updateImages() {
    this.images = getImageNodes(LAZY_IMAGE_HOOK)

    this.images.forEach(image => {
      const shadowImage = image.querySelector<HTMLImageElement>(LAZY_SHADOW_IMAGE_HOOK)
      if (shadowImage) LazyImage._removeShadowImage(shadowImage)
    })

    this._setObserverables()
  }
}

function getImageNodes<T extends Element>(selector: string) {
  return Array.from(document.querySelectorAll<T>(selector))
}

export default new LazyImage()
