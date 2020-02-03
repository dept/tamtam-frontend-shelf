/**
 * Creates an element from the given string.
 *
 * @param str the markup text
 * @returns the created element
 */
export const createElementFromString = str => {
  const div = document.createElement('div')
  div.innerHTML = str
  if (!div.children.length) {
    return undefined
  }
  return div.children[0] // eslint-disable-line prefer-destructuring
}
