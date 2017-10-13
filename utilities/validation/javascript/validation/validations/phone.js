/**
 * Check if string is valid phone number
 * @param  {String} phone Phone number
 * @param  {String} regex Default dutch phone regex
 * @return {Boolean} TRUE if provided argument is a valid phone number, FALSE if not
 */
function isValidPhoneNumber(phone, regex = /^(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)$/) {
    return regex.test(phone);
}

export {
    isValidPhoneNumber
}
