/**
 * @shelf-version: 1.0.0
 */

import Environment from '../../system/environment';
import $ from 'jquery';

const endpointBase = {
    local: '/api/',
    test: '/api/',
    acceptation: '/api/',
    production: '/api/',
    json: '/assets/json-api/'
};

class API {

    constructor() {

    }

    setEndpointBase(environment, endpoint) {

        if ( endpointBase[environment] ) {
            endpointBase[environment] = endpoint;
        }

    }

    get(path, data, json) {

        return $.ajax( this._getEndoint(path, json, 'get'), {
            data,
            method: 'GET'
        } );

    }

    post(path, data, json) {

        return $.ajax( this._getEndoint(path, json, 'post'), {
            data,
            method: 'POST'
        } );

    }


    put(path, data, json) {

        return $.ajax( this._getEndoint(path, json, 'put'), {
            data,
            method: 'PUT'
        } );

    }

    delete(path, data, json) {

        return $.ajax( this._getEndoint(path, json, 'delete'), {
            data,
            method: 'DELETE'
        } );

    }

    _getEndoint(path, json, method) {

        if ( path.substr(0, 4) === 'http' || path.substr(0,1) === '?' ) {
            return path;
        }

        if ( json === true || (json === 'local' && Environment.isLocal()) ) {
            return endpointBase.json + path + `--${method}.json`;
        } else {
            return endpointBase[Environment.get()] + path;
        }

    }

}

export default new API();
