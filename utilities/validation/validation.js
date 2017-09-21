import iban from "iban";
import luhn from "luhn";

/**
 * Check if string is valid email address
 * @param  {String}  email Email address
 * @return {Boolean} TRUE if provided argument is a valid email address, FALSE if not
 */
export const isValidEmail = (email) => {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,10}))$/.test(email);
};

/**
 * Check if string is valid phone number
 * @param  {String} phone Phone number
 * @param  {String} regex Default dutch phone regex
 * @return {Boolean} TRUE if provided argument is a valid phone number, FALSE if not
 */
export const isValidPhoneNumber = (phone, regex = /^(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)$/) => {
    return regex.test(phone);
};

/**
 * Check if string is valid zipcode
 * @param  {String} zipcode Zipcode
 * @param  {String} regex Default dutch zipcode regex
 * @return {Boolean} TRUE if provided argument is a valid zipcode, FALSE if not
 */
export const isValidZipcode = (zipcode, regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i) => {
    return regex.test(zipcode);
};

/**
 * Check if string is valid IBAN number
 * @param  {String} IBAN Provided IBAN number
 * @return {Boolean} TRUE if provided argument is a valid IBAN number, FALSE if not
 */
export const isValidIBAN = (IBAN) => {
    return iban.isValid(IBAN);
};

/**
 * Check if string complies with the Luhn algorith (used to validate credit card numbers or OV-chipkaart numbers)
 * @param  {Number|String} number provided input number
 * @return {Boolean} TRUE if provided argument is a valid Luhn number, FALSE if not
 */
export const isValidLuhnNumber = (number) => {
    return luhn.validate(number);
};
