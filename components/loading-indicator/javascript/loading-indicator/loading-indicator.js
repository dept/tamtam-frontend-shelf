import Events from '@utilities/events'

const LOADING_INDICATOR_HOOK = 'js-hook-loading-indicator'
const DARK_THEME_CLASS = 'loading-indicator--dark-theme'
const FIXED_POSITION_CLASS = 'loading-indicator--fixed'

class LoadingIndicator {
  constructor() {
    LoadingIndicator.loaderActive = false
    this.bindEvents()
  }

  /**
   * Bind all events
   */
  bindEvents() {
    Events.$on('loader::show', (e, data) => this.showLoader(data))
    Events.$on('loader::hide', () => this.hideLoader())
  }

  /**
   * Build the template fragment which gets appended to the DOM
   * @param darkTheme (boolean) - Set to true for dark theme
   * @param targetElement (string, selector) - Pass a selector, to append the loader to a different element
   * @param classes (string) - add additional classes to the loader
   * @returns {DocumentFragment}
   */
  static buildTemplateFragment(darkTheme, targetElement, classes) {
    const darkThemeClass = darkTheme ? ` ${DARK_THEME_CLASS}` : ''
    const additionalClasses = classes ? ` ${classes}` : ''
    const fixedClass = !targetElement ? ` ${FIXED_POSITION_CLASS}` : ''

    return document.createRange().createContextualFragment(`
      <div class="c-loading-indicator${darkThemeClass}${additionalClasses}${fixedClass}" ${LOADING_INDICATOR_HOOK}>
        <div class="loading-indicator__spinner"></div>
      </div>
    `)
  }

  /**
   * Shows the loader
   *
   * @param options
   * darkTheme (boolean) - Set to true for dark theme
   * targetElement (string, selector) - Pass a selector debounceChan, to append the loader to a different element
   * classes (string) - Add additional classes to the loader
   */
  showLoader(options) {
    if (this.loaderActive) return

    const { darkTheme, targetElement, classes } = options || {}
    const loadingIndicatorTemplate = LoadingIndicator.buildTemplateFragment(
      darkTheme,
      targetElement,
      classes,
    )

    if (targetElement) {
      const targetElementDom = document.querySelector(targetElement)
      targetElementDom.appendChild(loadingIndicatorTemplate)
    } else {
      document.body.appendChild(loadingIndicatorTemplate)
    }

    this.loaderActive = true
  }

  /**
   * Hides the loader
   */
  hideLoader() {
    if (!this.loaderActive) return

    const loader = document.querySelector(`[${LOADING_INDICATOR_HOOK}]`)
    if (loader) loader.remove()
    this.loaderActive = false
  }
}

export default new LoadingIndicator()
