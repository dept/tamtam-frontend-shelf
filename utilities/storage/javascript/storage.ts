import Cookie from 'js-cookie'

type StorageOption = 'localStorage' | 'sessionStorage'

class Storage {
  storagePrefix = ''
  storageType: StorageOption
  supported: boolean
  constructor(storageType?: StorageOption) {
    this.storageType = setStorageType(storageType)
    this.supported = storageTypeIsSupported(this.storageType)
  }

  /**
   * Set storage prefix
   */
  setPrefix(prefix: string) {
    this.storagePrefix = `${prefix}.`
  }

  /**
   * Get storage prefix
   * @returns {string}
   */
  getPrefix() {
    return this.storagePrefix
  }

  /**
   * Get the prefixed storage key
   */
  getPrefixedStorageKey(key: string) {
    return `${this.storagePrefix}${key}`
  }

  /**
   * Set item
   * @param {string} key Identifier of the data
   * @param {string|Object|Array} value The data to be stored
   */
  set(key: string, value: string | Record<string, unknown> | number | []) {
    const convertedValue = value

    if (typeof convertedValue !== 'undefined' && convertedValue !== null) {
      // Asign a timestamp to the data
      const value = JSON.stringify({ value: convertedValue, lastUpdated: Date.now() })

      if (this.supported) {
        window[this.storageType].setItem(this.getPrefixedStorageKey(key), value)
      } else {
        Cookie.set(this.getPrefixedStorageKey(key), value, { expires: 30 })
      }
    }
  }

  /**
   * Get item
   */
  get<T>(key: string, expiry = 2592000): undefined | T {
    let data
    const storageKey = this.getPrefixedStorageKey(key)

    if (this.supported) {
      data = window[this.storageType].getItem(storageKey)
    } else {
      data = Cookie.get(storageKey)
    }

    try {
      data = JSON.parse(data!)

      if (this.isExpired(data.lastUpdated, expiry)) {
        this.remove(key)
        return undefined
      }

      return data.value
    } catch (e) {
      return data
    }
  }

  /**
   * Validate expiry
   */
  isExpired(updated: number, expiryInSeconds: number) {
    const now = new Date()
    const lastUpdated = new Date(updated)

    const timeDiff = Math.abs(now.getTime() - lastUpdated.getTime())
    const timeDiffInSecond = Math.ceil(timeDiff / 1000)

    return timeDiffInSecond > expiryInSeconds
  }

  /**
   * Remove item
   */
  remove(key: string) {
    const storageKey = this.getPrefixedStorageKey(key)

    if (this.supported) {
      window[this.storageType].removeItem(storageKey)
    } else {
      Cookie.remove(storageKey)
    }
  }
}

/**
 * Set storage type
 */
function setStorageType(storageType?: StorageOption) {
  if (storageType && ['localStorage', 'sessionStorage'].indexOf(storageType) !== -1) {
    return storageType
  } else {
    return 'localStorage'
  }
}

/**
 * Check if given storage type is supported
 */
function storageTypeIsSupported(storageType: StorageOption) {
  try {
    window[storageType].x = 1
    window[storageType].removeItem('x')
    return true
  } catch (e) {
    return false
  }
}

/**
 * Check if localStorage is supported
 */
function localStorageIsSupported() {
  return storageTypeIsSupported('localStorage')
}
/**
 * Check if sessionStorage is supported
 */
function sessionStorageIsSupported() {
  return storageTypeIsSupported('sessionStorage')
}

const LocalStorage = new Storage()
const SessionStorage = new Storage('sessionStorage')

export { LocalStorage, localStorageIsSupported, SessionStorage, sessionStorageIsSupported }
