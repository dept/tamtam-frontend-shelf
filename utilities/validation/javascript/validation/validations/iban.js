import iban from "iban";

/**
 * Check if string is valid IBAN number
 * @param  {String} IBAN Provided IBAN number
 * @return {Boolean} TRUE if provided argument is a valid IBAN number, FALSE if not
 */
function isValidIBAN(IBAN) {
    return iban.isValid(IBAN);
}

export {
    isValidIBAN
}
