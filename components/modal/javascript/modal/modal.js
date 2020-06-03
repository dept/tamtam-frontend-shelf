import Events from '@utilities/events'
import setTabIndexOfChildren from '@utilities/set-tabindex-of-children'
import ScreenDimensions from '@utilities/screen-dimensions'
import { body, html } from '@utilities/dom-elements'

const MODAL_HOOK = '[js-hook-modal]'
const MODAL_CLOSE_HOOK = '[js-hook-button-modal-close]'
const MODAL_VISIBLE_CLASS = 'modal--is-showing'
const MODAL_HTML_CLASS = 'is--modal-open'

class Modal {
  constructor() {
    this.registeredModals = {}
    this.tabIndexExceptionIds = ['modal-mega-menu']

    this.scrollElement = document.scrollingElement || html
    this.scrollTop = 0

    /** @type {HTMLElement[]} */
    const modals = Array.from(document.querySelectorAll(MODAL_HOOK))

    modals.forEach(modal => this.setupModalRegistry(modal))

    this.bindEvents()
  }

  static clearCurrentFocus() {
    if (document.activeElement != document.body && document.activeElement instanceof HTMLElement)
      document.activeElement.blur()
  }

  /**
   * Bind event based on custom hook
   * @param {Object[]} data
   * @param {string} data[].id
   */
  customBind(data) {
    const modals = Array.from(document.querySelectorAll(data.hook))

    // Loop trough all found modals based on hook
    modals.forEach(modal => this.setupModalRegistry(modal))
  }

  /**
   * Setup an object per found modal
   * @param {HTMLElement} el Single modalbox
   */
  setupModalRegistry(el) {
    if (el._modalIsInitialised) return

    const id = el.getAttribute('id')
    const triggerBtn = Array.from(document.querySelectorAll(`[aria-controls=${id}]`))
    const closeBtn = Array.from(el.querySelectorAll(MODAL_CLOSE_HOOK))
    const mobileOnly = el.dataset.modalMobileOnly === 'true'

    const modal = {
      el,
      id,
      triggerBtn,
      closeBtn,
    }

    if (!mobileOnly || !ScreenDimensions.isTabletLandscapeAndBigger) {
      if (!this.tabIndexExceptionIds.includes(id)) setTabIndexOfChildren(modal.el, -1)
      this.registeredModals[`modal-${id}`] = modal
    }

    this.bindModalEvents(modal)

    el._modalIsInitialised = true
  }

  /**
   * Bind all general events
   */
  bindEvents() {
    Events.$on('modal::close', (_event, data) => this.closeModal(data))
    Events.$on('modal::open', (_event, data) => this.openModal(data))

    Events.$on('modal::bind', (_event, data) => this.customBind(data))
  }

  /**
   * Bind all modal specific events
   * @typedef {Object} BindOptions
   * @property {Element & {modalIsOpen: boolean}} el Modal id
   * @property {string} id Modal id
   * @property {HTMLElement[]} triggerBtn Button to open modal
   * @property {HTMLElement[]} closeBtn Button to close modal
   *
   * @param {BindOptions}
   */
  bindModalEvents({ el, id, triggerBtn, closeBtn }) {
    triggerBtn.forEach(triggerEl =>
      triggerEl.addEventListener('click', () => this.onTriggerClick(el, id)),
    )

    Events.$on(`modal[${id}]::close`, () => this.closeModal({ id }))
    Events.$on(`modal[${id}]::open`, () => this.openModal({ id }))

    closeBtn.forEach(el => el.addEventListener('click', () => this.onCloseClick(id)))

    // Close on ESCAPE_KEY
    document.addEventListener('keyup', event => this.onKeyUp(event, id))
  }

  onTriggerClick(el, id) {
    if (el.modalIsOpen) {
      Events.$trigger('modal::close', { data: { id } })
      Events.$trigger(`modal[${id}]::close`, { data: { id } })
    } else {
      Events.$trigger('modal::open', { data: { id } })
      Events.$trigger(`modal[${id}]::open`, { data: { id } })
    }
  }

  onCloseClick(id) {
    Events.$trigger('modal::close', { data: { id } })
    Events.$trigger(`modal[${id}]::close`, { data: { id } })
  }

  onKeyUp(event, id) {
    if (event.keyCode === 27) {
      Events.$trigger('modal::close')
      Events.$trigger(`modal[${id}]::close`, { data: { id } })
    }
  }

  /**
   * Open modal by given id
   * @param {{ id: string }} data
   */
  openModal(data) {
    const modal = this.registeredModals[`modal-${data.id}`]

    if (!modal || modal.el.modalIsOpen) return

    const { autoFocus, noBodyClass, closeAllOthers, keepScrollPosition } = this.getOptions(modal.el)

    // Set scroll position for fixed body on mobile
    if (keepScrollPosition && !ScreenDimensions.isTabletPortraitAndBigger) this.setScrollPosition()

    if (closeAllOthers) this.closeAllOtherModals(data.id)

    // Add modal open class to html element if noBodyClass is false
    if (!noBodyClass) html.classList.add(MODAL_HTML_CLASS)

    // Add tabindex and add visible class
    if (!this.tabIndexExceptionIds.includes(data.id)) {
      modal.el.tabIndex = 0
      setTabIndexOfChildren(modal.el, 0)
    }

    modal.el.classList.add(MODAL_VISIBLE_CLASS)
    modal.el.modalIsOpen = true

    Events.$trigger('focustrap::activate', {
      data: {
        element: modal.el,
        autoFocus,
      },
    })
  }

  getOptions(modalElement) {
    return {
      autoFocus: modalElement.dataset.modalAutoFocus === 'true',
      noBodyClass: modalElement.dataset.modalNoBodyClass === 'true',
      closeAllOthers: modalElement.dataset.modalCloseAllOthers === 'true',
      keepScrollPosition: modalElement.dataset.modalKeepScrollPosition === 'true',
    }
  }

  closeAllOtherModals(exceptionModalId) {
    Object.keys(this.registeredModals)
      .filter(key => this.registeredModals[key].id !== exceptionModalId)
      .forEach(id => {
        const _modal = this.registeredModals[id]
        if (_modal.el.modalIsOpen) {
          Events.$trigger(`modal[${_modal.id}]::close`, {
            data: { id: _modal.id },
          })
        }
      })
  }

  closeAllModals() {
    for (const modalIndex of Object.keys(this.registeredModals)) {
      this.closeModal({ id: this.registeredModals[modalIndex].id })
      Events.$trigger('focustrap::deactivate')
    }
  }

  /**
   * Open modal by given id
   * @param {{ id: string }} data
   */
  closeModal(data) {
    // If no ID is given we will close all modals
    if (!data || !data.id) {
      this.closeAllModals()
      return
    }

    // Get current modal from all known modals
    const modal = this.registeredModals[`modal-${data.id}`]

    // If there is no modal do nothing
    if (!modal || !modal.el.modalIsOpen) return

    const { noBodyClass, keepScrollPosition } = this.getOptions(modal.el)

    // Remove modal open class off html element if noBodyClass is false
    if (!noBodyClass) html.classList.remove(MODAL_HTML_CLASS)

    // Scroll to original position
    if (keepScrollPosition && !ScreenDimensions.isTabletPortraitAndBigger)
      this.removeScrollPosition()

    // Remove tabindex and remove visible class
    if (!this.tabIndexExceptionIds.includes(data.id)) {
      modal.el.tabIndex = -1
      setTabIndexOfChildren(modal.el, -1)
    }

    modal.el.classList.remove(MODAL_VISIBLE_CLASS)
    modal.el.modalIsOpen = false

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
}

export default new Modal()
