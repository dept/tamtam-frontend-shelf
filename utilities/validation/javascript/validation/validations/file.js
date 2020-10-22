/**
 * Check if file type is valid
 * @param  {Input} input element
 * @return {Boolean} TRUE if provided file is an accepted filetype, FALSE if not
 */
function isValidFile(input) {
  const allowedExtensions = input.accept.split(',')
  const fileExt = input.value.split('.').pop()
  return allowedExtensions.includes(`.${fileExt}`)
}

export { isValidFile }
