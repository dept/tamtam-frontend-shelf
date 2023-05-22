import API from '@/utilities/api'
import { body, html } from '@/utilities/dom-elements'
import Events from '@/utilities/events'

const JS_HOOK_MODAL_CLOSE_BTN = '[js-hook-modal-close-btn]'
const JS_HOOK_MODAL_CONTENT = '[js-hook-modal-content]'

export type ModalEventCloseAllOthersProps = Pick<ModalEntry, 'id'>

class Modal {
  element: HTMLDialogElement
  btnsOpen: NodeListOf<HTMLButtonElement>
  btnsClose: NodeListOf<HTMLButtonElement>
  modalContent: HTMLElement | null
  scrollElement = document.scrollingElement || html
  scrollTop = 0
  closeAllOthers: boolean
  enableDocumentScrollWhileOpen: boolean
  autoClose: number | false
  dynamicContentUrlLoaded: string | undefined

  constructor(element: HTMLDialogElement) {
    if (!element.id) return
    this.element = element
    this.btnsOpen = document.querySelectorAll(`[aria-controls=${this.element.id}]`)
    this.btnsClose = this.element.querySelectorAll(JS_HOOK_MODAL_CLOSE_BTN)
    this.modalContent = this.element.querySelector(JS_HOOK_MODAL_CONTENT)
    this.closeAllOthers = this.element.dataset.modalCloseAllOthers === 'true'
    this.enableDocumentScrollWhileOpen =
      this.element.dataset.modalEnableDocumentScrollWhileOpen === 'true'
    this.autoClose = this.element.dataset.autoClose
      ? parseInt(this.element.dataset.autoClose)
      : false

    this.#bindEvents()
  }

  handleOpenBtnClick = (event: MouseEvent) => {
    const targetElement = event.currentTarget as HTMLElement
    this.#open(targetElement?.dataset.modalDynamicContentUrl || false)
  }

  handleCloseBtnClick = () => this.#close()

  handleBackdropClick = (event: MouseEvent) => this.#backdropClick(event)

  handleCloseFromCloseAllOthers = () => this.#close(false)

  #bindEvents() {
    this.btnsOpen.forEach(el => {
      el.addEventListener('click', this.handleOpenBtnClick)
    })

    this.btnsClose.forEach(el => {
      el.addEventListener('click', this.handleCloseBtnClick)
    })

    this.element.addEventListener('click', this.handleBackdropClick)

    Events.$on(`modal[${this.element.id}]::open`, () => this.#open())
    Events.$on(`modal[${this.element.id}]::close`, () => this.#close())
    Events.$on(`modal[${this.element.id}]::remove`, () => this.#unbindAll())
    Events.$on(`modal[${this.element.id}]::reloadAndOpen`, (_, data) => {
      this.dynamicContentUrlLoaded = undefined
      this.#open(data.dynamicContentUrl)
    })
  }

  #open(dynamicContentUrl: string | undefined) {
    if (!this.enableDocumentScrollWhileOpen) {
      this.#setScrollPosition()
    }

    if (this.closeAllOthers) {
      Events.$trigger<ModalEventCloseAllOthersProps>('modals::closeAllOthers', {
        data: { id: this.element.id },
      })
    }

    if (this.autoClose) {
      setTimeout(() => {
        this.#close()
      }, this.autoClose * 1000)
    }

    if (dynamicContentUrl && dynamicContentUrl !== this.dynamicContentUrlLoaded) {
      this.load(dynamicContentUrl)
    }

    this.element.showModal()

    Events.$trigger('focustrap::activate', {
      data: {
        element: this.element,
      },
    })

    html.classList.add(`has-modal-open--${this.element.id}`)
  }

  #close(removeScrollPositionEnabled = true) {
    this.element.close()

    Events.$trigger('focustrap::deactivate')

    html.classList.remove(`has-modal-open--${this.element.id}`)

    if (!this.enableDocumentScrollWhileOpen && removeScrollPositionEnabled) {
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

  async load(dynamicContentUrl: string) {
    const modalURL = new URL(dynamicContentUrl, window.location.origin || window.location.href)

    try {
      const { data: document } = await API.get<string>(modalURL.toString())

      if (document) {
        this.modalContent?.replaceChildren()
        this.modalContent?.insertAdjacentHTML('afterbegin', document)
      }

      Events.$trigger('lazyimage::update')

      this.dynamicContentUrlLoaded = dynamicContentUrl

      return true
    } catch (error) {
      console.log(error)
    }

    return false
  }

  #unbindAll() {
    this.btnsOpen.forEach(el => {
      el.removeEventListener('click', this.handleOpenBtnClick)
    })

    this.btnsClose.forEach(el => {
      el.removeEventListener('click', this.handleCloseBtnClick)
    })

    this.element.removeEventListener('click', this.handleBackdropClick)
  }
}

export default Modal
