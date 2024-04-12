import luhn from 'luhn'

/**
 * Check if string complies with the Luhn algorithm (used to validate credit card numbers or OV-chipkaart numbers)
 */
function isValidLuhnNumber(number: string) {
  return luhn.validate(number)
}

export { isValidLuhnNumber }
