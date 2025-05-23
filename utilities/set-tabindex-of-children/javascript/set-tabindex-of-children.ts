const setTabIndexOfChildren = (
  element: HTMLElement,
  tabIndexValue: number,
  customSelector = '',
  overwriteDefault = false,
) => {
  const defaultSelector = overwriteDefault
    ? ''
    : 'a, area, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, video, audio'
  const selector =
    overwriteDefault && customSelector.length
      ? customSelector
      : `${defaultSelector}${customSelector.length ? `,${customSelector}` : ''}`
  ;[...element.querySelectorAll<HTMLElement>(selector)].forEach(element => {
    element.tabIndex = tabIndexValue
  })
}

export default setTabIndexOfChildren
