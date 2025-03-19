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
  [key: ModalEntry['id']]: ModalEntry
}

export type ModalEventCloseAllOthersProps = Pick<ModalEntry, 'id'>

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
    Events.$on<ModalEventCloseAllOthersProps>('modals::closeAllOthers', (_, data) => {
      this.#closeAllOthers(data)
    })
  }

  #createModalRegistry() {
    this.modalItems.forEach(modal => {
      if (modal.id) {
        this.#addModalEntry({
          id: modal.id,
          el: modal,
          instance: new Modal(modal),
        })
      }
    })
  }

  #addModalEntry(data: ModalEntry) {
    if (this.store[data.id]) Events.$trigger(`modal[${data.id}]::remove`)
    this.store[data.id] = data
  }

  #closeAllOthers(data: ModalEventCloseAllOthersProps) {
    const otherModals = Object.keys(this.store).filter(key => {
      const foundModal = this.#getModal(key)
      if (!foundModal) return false
      return foundModal.id !== data.id && foundModal.el.hasAttribute('open')
    })

    otherModals.forEach(id => {
      const _modal = this.#getModal(id)

      if (_modal) {
        _modal.instance.handleCloseFromCloseAllOthers()
      }
    })
  }

  #getModal(id: ModalEntry['id']) {
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
                break
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
