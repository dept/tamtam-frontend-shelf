/**
*  @shelf-version: 1.0.0
*/

function detectLocalStorage() {

    try {

        if (localStorage.length) {

            return true;

        } else {

            localStorage.x = 1;
            localStorage.removeItem('x');
            return false;

        }

    } catch (e) {

        return false;

    }

}

export default detectLocalStorage();
