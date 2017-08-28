import Cookie from 'js-cookie';

class StorageUtil {

    constructor() {

        this.storagePrefix = '';

    }

    setPrefix(prefix) {

        this.storagePrefix = prefix;

    }

    getPrefix() {

        return this.storagePrefix;

    }

    getStorageKey(key) {

        return `${this.storagePrefix}.${key}`;

    }

}


class LocalStorage {

    constructor() {

        this.storage = new StorageUtil();

        this.supported = localStorageSupported();

    }

    setPrefix(prefix) {

        this.storage.setPrefix(prefix);

    }

    getPrefix() {

        return this.storage.getPrefix();

    }

    set(key, value) {

        if (typeof value !== "undefined" && value !== null) {

            if (typeof value === 'object') {

                value = JSON.stringify(value);

            }

            if (this.supported) {

                localStorage.setItem(this.storage.getStorageKey(key), value);

            } else {

                Cookie.set(this.storage.getStorageKey(key), value, { expires: 30 });

            }

        }

    }

    get(key) {

        let data = null;
        const storageKey = this.storage.getStorageKey(key);

        if (this.supported) {

            data = localStorage.getItem(storageKey);

        } else {

            data = Cookie.get(storageKey);

        }

        try {

            data = JSON.parse(data);

        }
        catch (e) {

            data = data;

        }

        return data;

    }

    remove(key) {

        const storageKey = this.storage.getStorageKey(key);

        if (this.supported) {

            localStorage.removeItem(storageKey);

        } else {

            Cookie.remove(storageKey);

        }

    }

}


class SessionStorage {

    constructor() {

        this.storage = new StorageUtil();

        this.supported = sessionStorageSupported();

    }

    setPrefix(prefix) {

        this.storage.setPrefix(prefix);

    }

    getPrefix() {

        return this.storage.getPrefix();

    }

    set(key, value) {

        if (typeof value !== "undefined" && value !== null) {

            if (typeof value === 'object') {

                value = JSON.stringify(value);

            }

            if (this.supported) {

                sessionStorage.setItem(this.storage.getStorageKey(key), value);

            } else {

                Cookie.set(this.storage.getStorageKey(key), value, { expires: 30 });

            }

        }

    }

    get(key) {

        let data = null;
        const storageKey = this.storage.getStorageKey(key);

        if (this.supported) {

            data = sessionStorage.getItem(storageKey);

        } else {

            data = Cookie.get(storageKey);

        }

        try {

            data = JSON.parse(data);

        }
        catch (e) {

            data = data;

        }

        return data;

    }

    remove(key) {

        const storageKey = this.storage.getStorageKey(key);

        if (this.supported) {

            sessionStorage.removeItem(storageKey);

        } else {

            Cookie.remove(storageKey);

        }

    }

}


function localStorageSupported() {

    try {

        localStorage.x = 1;
        localStorage.removeItem('x');
        return true;

    } catch (e) {

        return false;

    }

}

function sessionStorageSupported() {

    try {

        sessionStorage.x = 1;
        sessionStorage.removeItem('x');
        return true;

    } catch (e) {

        return false;

    }

}


export {
    localStorageSupported,
    sessionStorageSupported,
    LocalStorage,
    SessionStorage
}