import Events from '@/utilities/events'

const LOADING_INDICATOR_HOOK = 'js-hook-loading-indicator'
const DARK_THEME_CLASS = 'loading-indicator--dark-theme'
const FIXED_POSITION_CLASS = 'loading-indicator--fixed'

type LoadingIndicatorOptions = {
  darkTheme?: boolean
  targetElement?: string | HTMLElement
  classes?: string
}

class LoadingIndicator {
  loaderActive = false

  constructor() {
    this.loaderActive = false
    this.bindEvents()
  }

  /**
   * Bind all events
   */
  bindEvents() {
    Events.$on<LoadingIndicatorOptions>('loader::show', (_e, data) => this.showLoader(data))
    Events.$on('loader::hide', () => this.hideLoader())
  }

  /**
   * Build the template fragment which gets appended to the DOM
   */
  static buildTemplateFragment(darkTheme?: boolean, targetElement?: boolean, classes?: string) {
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
   */
  showLoader(options: LoadingIndicatorOptions) {
    if (this.loaderActive) return
    const { darkTheme, targetElement, classes } = options || {}
    const loadingIndicatorTemplate = LoadingIndicator.buildTemplateFragment(
      darkTheme,
      !!targetElement,
      classes,
    )

    if (targetElement) {
      const targetElementDom =
        targetElement instanceof HTMLElement ? targetElement : document.querySelector(targetElement)
      targetElementDom?.appendChild(loadingIndicatorTemplate)
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
