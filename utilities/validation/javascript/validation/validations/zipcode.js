/**
 * Check if string is valid zipcode
 * @param  {String} zipcode Zipcode
 * @param  {String} regex Default dutch zipcode regex
 * @return {Boolean} TRUE if provided argument is a valid zipcode, FALSE if not
 */
function isValidZipcode(zipcode, regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i) {
    return regex.test(zipcode);
}

export {
    isValidZipcode
};
