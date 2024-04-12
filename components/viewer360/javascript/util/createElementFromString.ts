/**
 * Creates an element from the given string.
 */
export const createElementFromString = (str: string) => {
  const template = document.createElement('template')
  template.innerHTML = str
  return template.content.firstChild! as HTMLElement
}
