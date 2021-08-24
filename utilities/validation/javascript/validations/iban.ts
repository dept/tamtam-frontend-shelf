import iban from 'iban'

/**
 * Check if string is valid IBAN number
 */
function isValidIBAN(IBAN: string) {
  return iban.isValid(IBAN)
}

export { isValidIBAN }
