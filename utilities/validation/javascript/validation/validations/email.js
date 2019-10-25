/**
 * Check if string is valid email address
 * @param  {String}  email Email address
 * @return {Boolean} TRUE if provided argument is a valid email address, FALSE if not
 */
function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,10}))$/.test(
        email
    );
}

export { isValidEmail };
