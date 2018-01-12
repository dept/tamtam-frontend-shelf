
function parseSrcSet(str) {

    if ( !str ) {return false; }

    return deepUnique(str.split(',').map(function (el) {
        const ret = {};

        el.trim().split(/\s+/).forEach(function (_el, i) {
            if (i === 0) {
                ret.url = _el;
                return ret.url;
            }

            const value = _el.substring(0, _el.length - 1);
            const postfix = _el[_el.length - 1];
            const intVal = parseInt(value, 10);
            const floatVal = parseFloat(value);

            if (postfix === 'w' && /^\d+$/.test(value)) {
                ret.width = intVal;
            } else if (postfix === 'h' && /^\d+$/.test(value)) {
                ret.height = intVal;
            } else if (postfix === 'x' && !numberIsNan(floatVal)) {
                ret.density = floatVal;
            } else {
                throw new Error(`Invalid srcset descriptor: ${_el}.`);
            }

            return ret;
        });

        return ret;
    }));
}

function deepUnique(arr) {
    return arr.sort().filter(function (el, i) {
        return JSON.stringify(el) !== JSON.stringify(arr[i - 1]);
    });
}

function numberIsNan(x) {
    Number.isNaN || function (x) {
        return x !== x;
    };
}

export default parseSrcSet;
