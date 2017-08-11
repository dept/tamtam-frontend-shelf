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

        this.environment = Environment.get();

    }

    setEndpointBase(environment, endpoint) {

        if ( endpointBase[environment] ) {
            endpointBase[environment] = endpoint;
        }

    }

    getEndoint(path, json, method) {

        if ( path.substr(0, 4) === 'http' ) {
            return path;
        }

        if ( json === true || (json === 'local' && Environment.isLocal()) ) {
            return endpointBase.json + path + `--${method}.json`;
        } else {
            return endpointBase[this.environment] + path;
        }

    }

    get(path, data, json) {

        return $.ajax( this.getEndoint(path, json, 'get'), {
            data,
            method: 'GET'
        } );

    }

    post(path, data, json) {

        return $.ajax( this.getEndoint(path, json, 'post'), {
            data,
            method: 'POST'
        } );

    }


    put(path, data, json) {

        return $.ajax( this.getEndoint(path, json, 'put'), {
            data,
            method: 'PUT'
        } );

    }

    delete(path, data, json) {

        return $.ajax( this.getEndoint(path, json, 'delete'), {
            data,
            method: 'DELETE'
        } );

    }

}

export default new API();
