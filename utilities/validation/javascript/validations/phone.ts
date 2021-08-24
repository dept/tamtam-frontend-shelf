/**
 * Check if string is valid phone number
 */
function isValidPhoneNumber(
  phone: string,
  regex = /^(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)$/,
) {
  return regex.test(phone)
}

export { isValidPhoneNumber }
