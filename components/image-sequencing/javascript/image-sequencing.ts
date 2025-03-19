import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import Environment from '@/utilities/environment'

const JS_HOOK_IMAGE_SEQUENCING_CANVAS = '[js-hook-image-sequencing-canvas]'

class ImageSequencing {
  element: HTMLElement
  canvas: HTMLCanvasElement
  pinContainer: HTMLElement
  imageFallback: string | undefined
  imageBaseURL: string | undefined
  imageExtension: string | undefined
  frameCount: number

  constructor(element: HTMLElement) {
    this.element = element
    this.canvas = <HTMLCanvasElement>this.element.querySelector(JS_HOOK_IMAGE_SEQUENCING_CANVAS)
    this.pinContainer = <HTMLElement>this.element.parentElement
    this.imageFallback = this.element.dataset.imageFallback
    this.imageBaseURL = this.element.dataset.imageBaseUrl
    this.imageExtension = this.element.dataset.imageExtension
    this.frameCount = this.element.dataset.frameCount ? Number(this.element.dataset.frameCount) : 0

    if (this.canvas && this.pinContainer && this.imageBaseURL && this.imageExtension && this.frameCount) {
      this.#init()
    }
  }

  /**
   * Asynchronously loads a single image from its URL.
   * @param {string} src - The URL from which to fetch the image.
   * @returns {Promise<HTMLImageElement>} A Promise resolving to the loaded image.
   */
  #loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  /**
   * Constructs the complete URL for an image based on its index in the sequence.
   * @param {number} index - The index of the image within the sequence.
   * @returns {string} The fully constructed image URL.
   */
  #getImagePath(index: number) {
    return `${this.imageBaseURL}${(index + 1).toString().padStart(4, '0')}.${this.imageExtension}`
  }

  /**
   * Asynchronously fetches all images for the sequence from their respective URLs.
   * @returns {Promise<HTMLImageElement[]>} A Promise resolving to an array containing all loaded images.
   */
  async #getAllImages() {
    const images = []

    for (const [index] of Array.from({ length: this.frameCount }).entries()) {
      try {
        const image = await this.#loadImage(this.#getImagePath(index))
        images.push(image)
      } catch (err) {
        console.error(`Error loading image at index ${index}:`, err)
        throw err
      }
    }

    return images
  }

  /**
   * Sets up the animation sequence using GSAP and triggers it on scroll events.
   */
  async #setSequence() {
    try {
      const context = this.canvas.getContext('2d')
      const scrollAmountInPx = this.element.dataset.scrollAmountInPx
      const frameState = { frame: 0 }
      const images = await this.#getAllImages()

      gsap.to(frameState, {
        frame: this.frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: this.element,
          start: 'top top',
          end: `+=${scrollAmountInPx ? scrollAmountInPx + 'px' : '5000px'}`,
          markers: Environment.isLocal,
          pin: this.pinContainer,
          scrub: 0.5,
        },
        onUpdate: () => {
          context?.clearRect(0, 0, this.canvas.width, this.canvas.height)
          context?.drawImage(images[frameState.frame], 0, 0)
        },
      })
    } catch (err) {
      console.error('Error setting the image sequence: ', err)
      this.#setFallback()
    }
  }

  /**
   * Sets a fallback image in case the image sequence fails to load.
   * Removes the canvas and replaces it with a single <img> element.
   */
  #setFallback() {
    if (this.imageFallback) {
      const fallbackImage = document.createElement('img')

      Object.assign(fallbackImage, {
        src: this.imageFallback,
        alt: '',
        role: 'decorative',
        className: 'image-sequencing__fallback-image',
      })

      this.element.replaceChildren(fallbackImage)
    }
  }

  /**
   * Registers the ScrollTrigger plugin with GSAP to enable scroll-based animations.
   * According to GSAP documentation, there is no harm in registering the same plugin multiple times.
   * @see {@link https://greensock.com/docs/v3/GSAP/gsap.registerPlugin/}
   */
  #registerGsap() {
    gsap.registerPlugin(ScrollTrigger)
  }

  /**
   * Initializes the image sequence by registering required plugins and setting up the animation.
   */
  #init() {
    this.#registerGsap()
    this.#setSequence()
  }
}

export default ImageSequencing
