import { body, html } from '@/utilities/dom-elements'
import Events from '@/utilities/events'

import Modal from './modal'

const HOOK_MODAL = '[js-hook-modal]'

type ModalEntry = {
  id: string
  el: HTMLDialogElement
  instance: Modal
}

type ModalEntries = {
  [key: string]: ModalEntry
}

class ModalManager {
  store: ModalEntries = {}
  modalItems: NodeListOf<HTMLDialogElement>

  constructor() {
    this.store = {}
    this.modalItems = document.querySelectorAll(HOOK_MODAL)

    this.#createModalRegistry()

    this.#bindEvents()

    this.#observeDomRemoval()
  }

  #bindEvents() {
    Events.$on('modals::closeAllOthers', (_, data) => this.#closeAllOthers(data))
  }

  #createModalRegistry() {
    this.modalItems.forEach(modal => {
      this.#addModalEntry({
        id: modal.id,
        el: modal,
        instance: this.#initModal(modal),
      })
    })
  }

  #addModalEntry(data: ModalEntry) {
    this.store[data.id] = data
  }

  #initModal(el) {
    return new Modal(el)
  }

  #closeAllOthers(data: any) {
    const otherModals = Object.keys(this.store).filter(key => {
      const foundModal = this.#getModal(key)
      const isModalToClose = foundModal?.id !== data.id && foundModal?.el?.hasAttribute('open')
      return isModalToClose
    })

    otherModals.forEach(id => {
      const _modal = this.#getModal(id)

      if (_modal) {
        Events.$trigger(`modal[${_modal.id}]::close`)
      }
    })
  }

  #getModal(id: ModalEntry['id']) {
    if (!id) return
    return this.store[id]
  }

  #observeDomRemoval() {
    const observer = new MutationObserver(mutations_list => {
      mutations_list.forEach(mutation => {
        mutation.removedNodes.forEach(removed_node => {
          for (const key in this.store) {
            if (this.store.hasOwnProperty(key)) {
              const elementObject = this.store[key]
              if (elementObject.el === removed_node) {
                Events.$trigger(`modal[${key}]::remove`)
                delete this.store[key]
                observer.disconnect()
              }
            }
          }
        })
      })
    })

    observer.observe(body, { subtree: true, childList: true })
  }
}

export default new ModalManager()
