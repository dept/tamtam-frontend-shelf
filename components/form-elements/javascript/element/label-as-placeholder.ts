const LAP_ACTIVE = 'form__item--lap-active'
type InputType = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
const INPUT_QUERY = 'input, textarea, select'
const FILE = 'file'
const SELECT = 'SELECT'

class LabelAsPlaceholder {
  element: HTMLElement
  input: InputType | null

  constructor(element: HTMLElement) {
    this.element = element
    this.input = this.element.querySelector<InputType>(INPUT_QUERY)

    if (this.element && this.input) {
      this.toggleLabelClass()
      this.bindEvents()
    }
  }

  bindEvents() {
    this.input?.addEventListener('change', () => this.toggleLabelClass())

    if (this.input?.type !== FILE && this.input?.tagName !== SELECT) {
      this.input?.addEventListener('input', () => this.toggleLabelClass(true))
      this.input?.addEventListener('focus', () => this.toggleLabelClass(true))
      this.input?.addEventListener('focusout', () => this.toggleLabelClass())
    }
  }

  toggleLabelClass(forceAnimateLabel?: boolean) {
    const action = forceAnimateLabel || this.input?.value ? 'add' : 'remove'
    this.element.classList[action](LAP_ACTIVE)
  }
}

export default LabelAsPlaceholder
