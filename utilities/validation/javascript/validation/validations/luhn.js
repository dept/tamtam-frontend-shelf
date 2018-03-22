import luhn from 'luhn';

/**
 * Check if string complies with the Luhn algorithm (used to validate credit card numbers or OV-chipkaart numbers)
 * @param  {Number|String} number provided input number
 * @return {Boolean} TRUE if provided argument is a valid Luhn number, FALSE if not
 */
function isValidLuhnNumber(number) {
    return luhn.validate(number);
}

export {
    isValidLuhnNumber
};
