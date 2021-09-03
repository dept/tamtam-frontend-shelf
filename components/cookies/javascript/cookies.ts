import cookies from 'js-cookie'

import Events from '@/utilities/events'
import setTabIndexOfChildren from '@/utilities/set-tabindex-of-children'

const COOKIE_BAR_HOOK = '[js-hook-cookies-bar]'
const COOKIE_OPTIONS_BUTTON_HOOK = '[js-hook-cookies-settings-button]'

const COOKIE_FORM_HOOK = '[js-hook-cookies-form]'
const COOKIE_FORM_SUBMIT_HOOK = '[js-hook-cookies-form-accept]'
const COOKIE_OPTION_HOOK = '[js-hook-cookies-option]'

const COOKIEBAR_COOKIE_NAME = 'accepted'
const COOKIEBAR_COOKIE_VERSION = 'version'
const SHOW_CLASS = 'cookie-bar--is-visible'

const COOKIE_DEFAULT_VALUE = '1'
const COOKIE_DECLINED_VALUE = '0'

type CookiesFormOptions = {
  element: HTMLElement | null
  url?: string | null
  options?: HTMLInputElement[] | null
  submit?: HTMLButtonElement | null
}

type CookiesConfig = {
  cookiePrefix: string
  version: string
  cookies: { name: string; default: string }[]
}

export enum CookieName {
  FUNCTIONAL = 'functional',
  ANALYTICS = 'analytics',
  SOCIAL = 'social',
  ADVERTISING = 'advertising',
  OTHER = 'other',
}

type CookiesByName = Record<string, string>

class Cookies {
  config: CookiesConfig
  cookiebar = document.querySelector<HTMLElement>(COOKIE_BAR_HOOK)
  cookiebarOptionsButton = document.querySelector<HTMLButtonElement>(COOKIE_OPTIONS_BUTTON_HOOK)

  form: CookiesFormOptions = {
    element: document.querySelector(COOKIE_FORM_HOOK),
  }

  hostname = window.location.hostname

  constructor() {
    if (this.form.element) {
      this.form.url = this.form.element.getAttribute('action')
      this.form.options = [
        ...this.form.element.querySelectorAll<HTMLInputElement>(COOKIE_OPTION_HOOK),
      ]
      this.form.submit = this.form.element.querySelector<HTMLButtonElement>(COOKIE_FORM_SUBMIT_HOOK)
    }

    this.config = {
      cookiePrefix: 'default',
      version: this.cookiebar?.dataset.policyVersion || '1',
      cookies: [
        {
          name: CookieName.FUNCTIONAL,
          default: COOKIE_DEFAULT_VALUE,
        },
        {
          name: CookieName.ANALYTICS,
          default: COOKIE_DEFAULT_VALUE,
        },
        {
          name: CookieName.SOCIAL,
          default: COOKIE_DECLINED_VALUE,
        },
        {
          name: CookieName.ADVERTISING,
          default: COOKIE_DECLINED_VALUE,
        },
        {
          name: CookieName.OTHER,
          default: COOKIE_DECLINED_VALUE,
        },
      ],
    }

    this.init()
  }

  init() {
    if (this.getCookie(COOKIEBAR_COOKIE_VERSION) !== this.config.version) {
      this._removeInvalidatedCookies()
    }

    this._setDefaultCookies()

    this._bindEvents()

    if (this.form.element) {
      this._prefillFormCookies()
    }

    if (!this.getCookie(COOKIEBAR_COOKIE_NAME)) {
      this.setCookie(COOKIEBAR_COOKIE_NAME, COOKIE_DECLINED_VALUE)
    }

    if (
      (this.getCookie(COOKIEBAR_COOKIE_VERSION) !== this.config.version && !this.form.element) ||
      (this.getCookie(COOKIEBAR_COOKIE_NAME) === COOKIE_DECLINED_VALUE && !this.form.element)
    ) {
      this._show()
    }
  }

  _bindEvents() {
    if (this.cookiebar) {
      Events.$on('cookies::dismiss', () => this._acceptAllCookies())
    }

    if (this.form.element) {
      Events.$on('cookies::preferences-default', () => this._setDefaultPreferences())
      this.form.element.addEventListener('submit', event => this._submitFormCookies(event))
    }
  }

  _setDefaultCookies() {
    this.config.cookies.forEach(cookie => {
      if (!this.getCookie(cookie.name) && cookie.default === COOKIE_DEFAULT_VALUE) {
        this.setCookie(cookie.name, cookie.default)
      }
    })
  }

  _acceptAllCookies() {
    const acceptedCookies: CookiesByName = {}

    this.config.cookies.forEach(cookie => {
      this.setCookie(cookie.name, COOKIE_DEFAULT_VALUE)
      acceptedCookies[this.prefixCookieName(cookie.name)] = COOKIE_DEFAULT_VALUE
    })

    this._addGlobalCookies(acceptedCookies)

    window.location.reload()
  }

  _addGlobalCookies(_cookies: CookiesByName) {
    _cookies.date = new Date(Date.now()).toUTCString()
    _cookies.version = this.config.version

    this.setCookie(COOKIEBAR_COOKIE_NAME, _cookies)
    this.setCookie(COOKIEBAR_COOKIE_VERSION, this.config.version)
  }

  _prefillFormCookies() {
    this.form.options?.forEach(option => {
      if (this.getCookie(option.value) === COOKIE_DEFAULT_VALUE) {
        option.setAttribute('checked', 'checked')
      } else {
        option.removeAttribute('checked')
      }
    })
  }

  _removeInvalidatedCookies() {
    this.config.cookies.forEach(cookie => {
      this.removeCookie(cookie.name)
    })

    this.removeCookie(COOKIEBAR_COOKIE_NAME)
    this.removeCookie(COOKIEBAR_COOKIE_VERSION)
  }

  _submitFormCookies(event: Event) {
    event.preventDefault()

    const acceptedCookies: CookiesByName = {}

    this.form.options?.forEach(option => {
      const { value } = option
      this.config.cookies.forEach(cookie => {
        if (cookie.name.indexOf(value) !== -1) {
          const state = option.checked ? COOKIE_DEFAULT_VALUE : COOKIE_DECLINED_VALUE
          this.setCookie(value, state)
          acceptedCookies[this.prefixCookieName(value)] = state
        }
      })
    })

    this._addGlobalCookies(acceptedCookies)

    if (this.form.url) {
      window.location.href = this.form.url
      return
    }
    window.location.reload()
  }

  _setDefaultPreferences() {
    this.form.options?.forEach(option => {
      if (this.getCookie(option.value) === COOKIE_DEFAULT_VALUE) {
        option.setAttribute('checked', 'checked')
      } else {
        option.removeAttribute('checked')
      }
    })
  }

  _show() {
    if (this.cookiebar) {
      this.cookiebar.classList.add(SHOW_CLASS)
      this.cookiebar.tabIndex = 0
      setTabIndexOfChildren(this.cookiebar, 0)

      this.cookiebar.focus()
    }
  }

  /**
   * Sets cookie with given value
   */
  setCookie(name: string, value: any) {
    cookies.set(this.prefixCookieName(name), value, { expires: 365 })
  }

  /**
   * Remove cookie with given value
   */
  removeCookie(name: string) {
    cookies.remove(this.prefixCookieName(name))
  }

  /**
   * Gets cookie with given value
   */
  getCookie(name: string) {
    return cookies.get(this.prefixCookieName(name))
  }

  prefixCookieName(name: string) {
    return `${this.config.cookiePrefix}-cookie-${name}`
  }

  /**
   * Checks if cookie is valid and version is correct
   */
  cookieIsValid(name: string) {
    return (
      this.getCookie(COOKIEBAR_COOKIE_VERSION) === this.config.version &&
      cookies.get(this.prefixCookieName(name)) === COOKIE_DEFAULT_VALUE
    )
  }
}

export default new Cookies()
