/**
 * Check if file type is valid
 */
function isValidFile(input: HTMLInputElement) {
  const allowedExtensions = input.accept.split(',')
  const fileExt = input.value.split('.').pop()
  return allowedExtensions.includes(`.${fileExt}`)
}

export { isValidFile }
