/**
 * Check if string is valid zipcode
 */
function isValidZipcode(zipcode: string, regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i) {
  return regex.test(zipcode)
}

export { isValidZipcode }
