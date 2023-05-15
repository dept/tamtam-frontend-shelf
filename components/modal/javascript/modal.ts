import API from '@/utilities/api'
import { body, html } from '@/utilities/dom-elements'
import Events from '@/utilities/events'

const JS_HOOK_MODAL_CLOSE_BTN = '[js-hook-modal-close-btn]'
const JS_HOOK_MODAL_CONTENT = '[js-hook-modal-content]'

class Modal {
  element: HTMLDialogElement
  btnsOpen: NodeListOf<HTMLButtonElement>
  btnClose: HTMLButtonElement | null
  modalContent: HTMLElement | null
  scrollElement = document.scrollingElement || html
  scrollTop = 0
  closeAllOthers: boolean
  dynamicContentUrl: string | false
  enableDocumentScrollWhileOpen: boolean
  autoClose: number | false
  dynamicContentLoaded: boolean

  constructor(element: HTMLDialogElement) {
    this.element = element
    this.btnsOpen = document.querySelectorAll(`[aria-controls=${this.element.id}]`)
    this.btnClose = this.element.querySelector(JS_HOOK_MODAL_CLOSE_BTN)
    this.modalContent = this.element.querySelector(JS_HOOK_MODAL_CONTENT)
    this.closeAllOthers = this.element.dataset.modalCloseAllOthers === 'true'
    this.dynamicContentUrl = this.element.dataset.modalDynamicContentUrl || false
    this.enableDocumentScrollWhileOpen =
      this.element.dataset.modalEnableDocumentScrollWhileOpen === 'true'
    this.autoClose = this.element.dataset.autoClose
      ? parseInt(this.element.dataset.autoClose)
      : false
    this.dynamicContentLoaded = false

    this.#bindEvents()
  }

  handleOpen = () => this.#open()
  handleClose = () => this.#close()

  #bindEvents() {
    this.btnsOpen.forEach(el => {
      el.addEventListener('click', this.handleOpen)
    })

    this.btnClose?.addEventListener('click', this.handleClose)

    this.element.addEventListener('click', event => this.#backdropClick(event))

    Events.$on(`modal[${this.element.id}]::open`, this.handleOpen)
    Events.$on(`modal[${this.element.id}]::close`, this.handleClose)
    Events.$on(`modal[${this.element.id}]::remove`, () => this.#unbindAll())
  }

  #open() {
    if (!this.enableDocumentScrollWhileOpen) {
      this.#setScrollPosition()
    }

    if (this.closeAllOthers) {
      Events.$trigger('modals::closeAllOthers', { data: { id: this.element.id } })
    }

    if (this.autoClose) {
      setTimeout(() => {
        this.#close()
      }, this.autoClose * 1000)
    }

    if (this.dynamicContentUrl && !this.dynamicContentLoaded) {
      this.load()
    }

    this.element.showModal()

    Events.$trigger('focustrap::activate', {
      data: {
        element: this.element,
      },
    })

    html.classList.add(`has-modal-open--${this.element.id}`)
  }

  #close() {
    this.element.close()

    Events.$trigger('focustrap::deactivate')

    html.classList.remove(`has-modal-open--${this.element.id}`)

    if (!this.enableDocumentScrollWhileOpen) {
      this.#removeScrollPosition()
    }
  }

  #setScrollPosition() {
    this.scrollTop = this.scrollElement.scrollTop
    body.style.top = `-${this.scrollTop}px`
  }

  #removeScrollPosition() {
    this.scrollElement.scrollTop = this.scrollTop
    body.style.removeProperty('top')
  }

  #backdropClick(event: MouseEvent) {
    const rect = this.element.getBoundingClientRect()
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width

    if (!isInDialog) {
      this.#close()
    }
  }

  async load() {
    const modalURL = new URL(this.dynamicContentUrl, window.location.origin || window.location.href)

    try {
      const response = await API.get(modalURL.toString())
      const document = response?.data as string

      if (document) {
        this.modalContent?.replaceChildren()
        this.modalContent?.insertAdjacentHTML('afterbegin', document)
      }

      Events.$trigger('lazyimage::update')

      this.dynamicContentLoaded = true

      return true
    } catch (error) {
      console.log(error)
    }

    return false
  }

  #unbindAll() {
    this.btnsOpen.forEach(el => {
      el.removeEventListener('click', this.handleOpen)
    })

    this.btnClose?.removeEventListener('click', this.handleClose)

    this.element.removeEventListener('click', event => this.#backdropClick(event))
  }
}

export default Modal
