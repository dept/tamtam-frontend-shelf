import DetectTouch from '@utilities/detect-touch'
import { body, html } from '@utilities/dom-elements'
import Events from '@utilities/events'
import setTabIndexOfChildren from '@utilities/set-tabindex-of-children'
import debounce from 'lodash/debounce'

const MENU_ITEM_HOOK = '[js-hook-mega-menu-item]'
const MENU_LINK_HOOK = '[js-hook-mega-menu-link]'
const FLYOUT_MENU_HOOK = '[js-hook-flyout-menu]'
const FLYOUT_BG_HOOK = '[js-hook-flyout-background]'

const KEYBOARD_FOCUSED = 'has--keyboard-focus'
const MENU_ITEM_ACTIVE_CLASS = 'mega-menu__item--is-open'
const HTML_ACTIVE_CLASS = 'header--mega-menu-open'

class MainMenu {
  constructor(element) {
    this.menu = element
    this.background = this.menu.querySelector(FLYOUT_BG_HOOK)
    this.menuItems = [...this.menu.querySelectorAll(MENU_ITEM_HOOK)]
    this.registeredMenuItems = {}

    this.activeClass = MENU_ITEM_ACTIVE_CLASS
    this.menuHTMLClass = HTML_ACTIVE_CLASS

    this.debounceCloseMenu = debounce(() => this.closeMenu(), 300)
    this.debounceMouseEnter = debounce(item => this.handleMouseEnter(item), 400)

    this.bindEvents()
  }

  /**
   * Init Main Menu
   * @param {HTMLElement} el - Main menu element
   */
  initMenu(el) {
    const link = el.querySelector(MENU_LINK_HOOK) || undefined
    const flyout = el.querySelector(FLYOUT_MENU_HOOK) || undefined
    const id = link ? link.getAttribute('aria-controls') : undefined
    const isActive = false

    const menuItem = {
      el,
      link,
      flyout,
      id,
      isActive,
    }

    this.registeredMenuItems[`menuitem-${id}`] = menuItem

    this.bindFlyoutEvents(menuItem)
  }

  /**
   * Handle Mouse Enter: on first enter, debounce the event, otherwise load contents immediately
   *
   * @param {Object} item - Main Menu registry item
   */
  shouldDebounceMouseEnter(item) {
    if (!html.classList.contains(this.menuHTMLClass)) {
      this.debounceMouseEnter(item)
    } else {
      this.handleMouseEnter(item)
    }
  }

  /**
   * Handle Mouse Events
   *
   * @param {Object} item - Main Menu registry item
   */
  bindFlyoutEvents(item) {
    const { el, link } = item

    el.addEventListener('mouseenter', () => this.shouldDebounceMouseEnter(item))
    el.addEventListener('mouseleave', event => this.handleMouseLeave(event, item))

    link.addEventListener('click', event => this.handleClick(event, item))
    link.addEventListener('focusout', event => this.handleBlur(event, item))
    link.addEventListener('focus', () => this.handleFocus(item))
  }

  /**
   * Handle Mouse Enter
   *
   * @param {Object} event - mouse over event
   * @param {Object} item - Main Menu registry item
   */
  handleMouseEnter(item) {
    this.openFlyout(item)
    this.openMenu()
  }

  /**
   * Handle Mouse Leave
   *
   * @param {Object} event - mouse leave event
   * @param {Object} item - Main Menu registry item
   */
  handleMouseLeave(event, item) {
    const { el } = item
    const relatedTarget =
      event.relatedTarget || event.explicitOriginalTarget || document.activeElement // IE11
    if (!el.contains(relatedTarget) && relatedTarget !== this.background) {
      this.debounceMouseEnter.cancel()
      this.debounceCloseMenu()
      this.closeFlyout(item)
    }
  }

  /**
   * Handle Click Event
   * Open flyout if availabe
   * If flyout is open, just click the link
   *
   * @param {Object} event - Click event
   * @param {Object} item - Main Menu registry item
   */
  handleClick(event, item) {
    const { isActive } = item
    const usesKeyBoard = body.classList.contains(KEYBOARD_FOCUSED)
    if (!isActive && (DetectTouch.touch || usesKeyBoard)) {
      event.preventDefault()
      this.openFlyout(item)
      this.openMenu()
    }
  }

  /**
   * Set ARIA state of Main Menu
   * @param {Object} item - Main Menu registry item
   * @param {Boolean} open - If menu is open or closed
   */
  static setAriaState({ link, flyout }, open) {
    link.setAttribute('aria-expanded', open)
    flyout.setAttribute('aria-hidden', !open)
  }

  /**
   * Open Flyout Menu
   * Close all other open menu's
   * Set active items
   * Set classes and attributes to open
   * @param {Object} item - Main Menu registry item
   */
  openFlyout(item) {
    const { el, flyout } = item

    this.closeActiveFlyouts()

    this.debounceCloseMenu.cancel()
    el.classList.add(this.activeClass)
    MainMenu.setAriaState(item, true)
    setTabIndexOfChildren(flyout, 0)
    item.isActive = true
  }

  /**
   * Close Flyout Menu
   * If active item has been registered & has active class
   * Set classes and attributes to closed
   * Reset active objects
   * @param {Object} item - Main Menu registry item
   */
  closeFlyout(item) {
    const { el, flyout } = item

    el.classList.remove(this.activeClass)
    MainMenu.setAriaState(item, false)
    setTabIndexOfChildren(flyout, -1)
    item.isActive = false
  }

  closeMenu() {
    this.removeBodyClass()
  }

  openMenu() {
    this.background.style.height = `${this.getTallestFlyout()}px`
    Events.$trigger('modal[modal-mega-menu]::open')
  }

  /**
   * Handle item blur
   * If focus shifts outside mmnu item, close all active flyouts
   *
   * @param {Object} event - Click event
   * @param {Object} item - Register item
   */
  handleBlur(event, { el }) {
    const relatedTarget =
      event.relatedTarget || event.explicitOriginalTarget || document.activeElement // IE11

    if (!el.contains(relatedTarget)) {
      this.debounceCloseMenu()
      this.closeActiveFlyouts()
    }
  }

  /**
   * Handle item focus
   * @param {Object} item - Register item
   */
  handleFocus({ isActive }) {
    if (!isActive) {
      this.debounceCloseMenu()
      this.closeActiveFlyouts()
    }
  }

  /**
   * Close All Active Flyouts
   */
  closeActiveFlyouts() {
    Object.keys(this.registeredMenuItems)
      .filter(key => this.registeredMenuItems[key].isActive)
      .forEach(item => this.closeFlyout(this.registeredMenuItems[item]))
  }

  /**
   * Close All Flyouts
   */
  closeFlyouts() {
    Object.keys(this.registeredMenuItems).forEach(item =>
      this.closeFlyout(this.registeredMenuItems[item]),
    )
  }

  addBodyClass() {
    if (html.classList.contains(this.menuHTMLClass)) return
    html.classList.add(this.menuHTMLClass)
  }

  removeBodyClass() {
    if (!html.classList.contains(this.menuHTMLClass)) return
    html.classList.remove(this.menuHTMLClass)
  }

  getTallestFlyout() {
    const flyouts = [...this.menu.querySelectorAll(FLYOUT_MENU_HOOK)]
    let tallest = null
    flyouts.forEach(flyout => {
      const flyoutHeight = flyout.offsetHeight
      tallest = flyoutHeight > tallest ? flyoutHeight : tallest
    })
    return tallest
  }

  bindEvents() {
    Events.$on(`flyout::init`, () => {
      this.menuItems.map(menuItem => this.initMenu(menuItem))
    })

    Events.$on(`flyout::reset`, () => {
      this.debounceCloseMenu()
      this.closeFlyouts()
    })

    Events.$on(`modal[modal-mega-menu]::open`, () => this.addBodyClass())
    Events.$on(`modal[modal-mega-menu]::close`, () => {
      this.debounceCloseMenu()
      this.closeActiveFlyouts()
    })

    this.menu.addEventListener('mouseleave', () => Events.$trigger('modal[modal-mega-menu]::close'))
  }
}

export default MainMenu
