import { body, html } from '@/utilities/dom-elements'
import Events from '@/utilities/events'
import ScreenDimensions from '@/utilities/screen-dimensions'
import setTabIndexOfChildren from '@/utilities/set-tabindex-of-children/javascript/set-tabindex-of-children'

const MODAL_HOOK = '[js-hook-modal]'
const MODAL_CLOSE_HOOK = '[js-hook-button-modal-close]'
const MODAL_VISIBLE_CLASS = 'modal--is-showing'
const MODAL_HTML_CLASS = 'is--modal-open'

export type ModalElement = HTMLElement & { _modalIsInitialised?: boolean }

export type ModalEventId = { id: string }
export type ModalEventHook = { hook: string }

export type ModalEntry = {
  id: string
  el: ModalElement
  triggerBtn: Element[]
  closeBtn: Element[] | []
  isOpen: boolean
}

type ModalEntries = {
  [key: string]: ModalEntry
}

const MODAL_PREFIX = 'modal-'

class Modal {
  store: ModalEntries = {}
  tabIndexExceptionIds = ['modal-mega-menu']
  scrollElement = document.scrollingElement || html
  scrollTop = 0

  constructor() {
    this.register({ hook: MODAL_HOOK })
    this.bindEvents()
  }

  register(data: { hook: string }) {
    Array.from(document.querySelectorAll<ModalElement>(data.hook)).forEach(modal =>
      this.setupModalRegistry(modal),
    )
  }

  /**
   * Setup an object per found modal
   */
  setupModalRegistry(el: ModalElement) {
    if (el._modalIsInitialised) return

    const id = el.getAttribute('id')

    if (!id) return

    const triggerBtn = Array.from(document.querySelectorAll(`[aria-controls=${id}]`))
    const closeBtn = Array.from(el.querySelectorAll(MODAL_CLOSE_HOOK))
    const mobileOnly = el.dataset.modalMobileOnly === 'true'

    const modal: ModalEntry = {
      el,
      id,
      triggerBtn,
      closeBtn,
      isOpen: false,
    }

    if (!mobileOnly || !ScreenDimensions.isTabletLandscapeAndBigger) {
      if (!this.tabIndexExceptionIds.includes(id)) setTabIndexOfChildren(modal.el, -1)
      this.addModal(modal)
    }

    this.bindModalEvents(modal)

    el._modalIsInitialised = true
  }

  /**
   * Bind all general events
   */
  bindEvents() {
    Events.$on<ModalEventId>('modal::close', (_, data) => this.closeModal(data))
    Events.$on<ModalEventId>('modal::open', (_, data) => this.openModal(data))

    Events.$on<ModalEventHook>('modal::bind', (_, data) => this.register(data))
  }

  bindModalEvents({ id, triggerBtn, closeBtn }: ModalEntry) {
    triggerBtn.forEach(triggerEl =>
      triggerEl.addEventListener('click', () => {
        const { isOpen } = this.getModal(id)
        if (isOpen) {
          Events.$trigger('modal::close', { data: { id } })
          Events.$trigger(`modal[${id}]::close`, { data: { id } })
        } else {
          Events.$trigger('modal::open', { data: { id } })
          Events.$trigger(`modal[${id}]::open`, { data: { id } })
        }
      }),
    )

    Events.$on(`modal[${id}]::close`, () => this.closeModal({ id }))
    Events.$on(`modal[${id}]::open`, () => this.openModal({ id }))

    closeBtn.forEach(el =>
      el.addEventListener('click', () => {
        Events.$trigger('modal::close', { data: { id } })
        Events.$trigger(`modal[${id}]::close`, { data: { id } })
      }),
    )

    // Close on ESCAPE_KEY
    document.addEventListener('keyup', event => {
      if (event.key === 'Escape') {
        Events.$trigger('modal::close')
        Events.$trigger(`modal[${id}]::close`, { data: { id } })
      }
    })
  }

  openModal(data: Pick<ModalEntry, 'id'>) {
    const modal = this.getModal(data.id)

    if (!modal || modal.isOpen) return

    const autoFocus = modal.el.dataset.modalAutoFocus === 'true'
    const noBodyClass = modal.el.dataset.modalNoBodyClass === 'true'
    const closeAllOthers = modal.el.dataset.modalCloseAllOthers === 'true'
    const keepScrollPosition = modal.el.dataset.modalKeepScrollPosition === 'true'
    const autoClose = parseInt(modal.el.dataset.autoClose || '')

    // Set scroll position for fixed body on mobile
    if (keepScrollPosition && !ScreenDimensions.isTabletPortraitAndBigger) this.setScrollPosition()

    if (closeAllOthers) {
      Object.keys(this.store)
        .filter(key => this.getModal(key).id !== data.id)
        .forEach(id => {
          const _modal = this.getModal(id)
          if (_modal.isOpen) {
            Events.$trigger(`modal[${_modal.id}]::close`, {
              data: { id: _modal.id },
            })
          }
        })
    }

    // Add modal open class to html element if noBodyClass is false
    if (!noBodyClass) html.classList.add(MODAL_HTML_CLASS)

    // Add tabindex and add visible class
    if (!this.tabIndexExceptionIds.includes(data.id)) {
      modal.el.tabIndex = 0
      setTabIndexOfChildren(modal.el, 0)
    }

    modal.el.classList.add(MODAL_VISIBLE_CLASS)
    modal.isOpen = true

    Events.$trigger('focustrap::activate', {
      data: {
        element: modal.el,
        autoFocus,
      },
    })

    // If auto close is set use value as timeout in seconds to close modal
    if (autoClose) {
      setTimeout(() => {
        Events.$trigger(`modal[${modal.id}]::close`, { data: { id: modal.id } })
      }, autoClose * 1000)
    }
  }

  closeModal(data: Pick<ModalEntry, 'id'>) {
    // If no ID is given we will close all modals
    if (!data || !data.id) {
      for (const modalIndex of Object.keys(this.store)) {
        this.closeModal({ id: this.getModal(modalIndex).id })
        Events.$trigger('focustrap::deactivate')
      }
      return
    }

    // Get current modal from all known modals
    const modal = this.getModal(data.id)

    // If there is no modal do nothing
    if (!modal || !modal.isOpen) return

    // Remove modal open class off html element if noBodyClass is false
    const noBodyClass = modal.el.dataset.modalNoBodyClass === 'true'
    if (!noBodyClass) html.classList.remove(MODAL_HTML_CLASS)

    // Scroll to original position
    const keepScrollPosition = modal.el.dataset.modalKeepScrollPosition === 'true'
    if (keepScrollPosition && !ScreenDimensions.isTabletPortraitAndBigger)
      this.removeScrollPosition()

    // Remove tabindex and remove visible class
    if (!this.tabIndexExceptionIds.includes(data.id)) {
      modal.el.tabIndex = -1
      setTabIndexOfChildren(modal.el, -1)
    }

    modal.el.classList.remove(MODAL_VISIBLE_CLASS)
    modal.isOpen = false

    Events.$trigger('focustrap::deactivate')

    Modal.clearCurrentFocus()
  }

  /**
   * Sets scrollposition to prevent body scrolling to top when position is fixed
   */
  setScrollPosition() {
    this.scrollTop = this.scrollElement.scrollTop
    body.style.top = `-${this.scrollTop}px`
  }

  /**
   * Removes scroll position from body and scrolls to original position
   */
  removeScrollPosition() {
    this.scrollElement.scrollTop = this.scrollTop
    body.style.removeProperty('top')
  }

  static clearCurrentFocus() {
    if (document.activeElement != document.body && document.activeElement instanceof HTMLElement)
      document.activeElement.blur()
  }

  addModal(data: ModalEntry) {
    this.store[`${MODAL_PREFIX}${data.id}`] = data
  }

  getModal(id: ModalEntry['id']) {
    return this.store[`${MODAL_PREFIX}${id}`]
  }
}

export default new Modal()
