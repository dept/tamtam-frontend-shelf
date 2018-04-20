import Environment from '@utilities/environment';
import $ from 'jquery';

const endpointBase = {
    local: '/api/',
    test: '/api/',
    acceptation: '/api/',
    production: '/api/',
    json: '/assets/data/api/'
};

class API {

    /**
     * Set an anti forgery token to make AJAX requests to the backend
     * @param {string} name
     * @param {string} value
     */
    setAntiForgeryToken(name, value) {

        this.antiForgeryToken = {};
        this.antiForgeryToken = { name, value };

    }

    /**
     * Overwrite default enpoints
     * @param {string} environment
     * @param {string} endpoint
     */
    setEndpointBase(environment, endpoint) {

        if (endpointBase[environment]) {
            endpointBase[environment] = endpoint;
        }

    }

    get(path, data, json, params = {}) {

        const endpoint = getEndpoint(path, json, 'get');
        const options = {
            data,
            method: getMethod('GET', json)
        };

        $.extend(true, options, params);

        return $.ajax(endpoint, options);

    }

    post(path, data, json, params = {}) {

        const endpoint = getEndpoint(path, json, 'post');
        const options = {
            data,
            method: getMethod('POST', json)
        };

        if (this.antiForgeryToken) {
            options.headers = {};
            options.headers[this.antiForgeryToken.name] = this.antiForgeryToken.value;
        }

        $.extend(true, options, params);

        return $.ajax(endpoint, options);

    }


    put(path, data, json, params = {}) {

        const endpoint = getEndpoint(path, json, 'put');
        const options = {
            data,
            method: getMethod('PUT', json)
        };

        $.extend(true, options, params);

        return $.ajax(endpoint, options);

    }

    delete(path, data, json, params = {}) {

        const endpoint = getEndpoint(path, json, 'delete');
        const options = {
            data,
            method: getMethod('DELETE', json)
        };

        $.extend(true, options, params);

        return $.ajax(endpoint, options);

    }

}

/**
 * Get the endpoint. If we require json we will return a json file.
 * @param {string} path
 * @param {string|boolean} json
 * @param {string} method
 */
function getEndpoint(path, json, method) {

    if (path.substr(0, 2) === '//' || path.substr(0, 4) === 'http' || path.substr(0, 1) === '?') {
        return path;
    }

    if (json === true || (json === 'local' && Environment.isLocal())) {
        return endpointBase.json + path + `--${method}.json`;
    } else {
        return endpointBase[Environment.get()] + path;
    }

}


/**
 * Will transform the method to GET if we require static json file
 * @param {string} method Given method to check for transformation
 * @param {string|boolean} json To check if we need to transform the method
 */
function getMethod(method, json) {

    return (json === true || (json === 'local' && Environment.isLocal())) ? 'GET' : method;

}

export default new API();
