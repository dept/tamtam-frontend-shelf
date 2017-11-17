import Events from '../util/events';
import './lazy-image';
import objectFitPolyfill from './util/object-fit';

class Image {

    constructor() {

        this.instance = null;

        this._bindEvents();

        Events.$trigger('lazyimage::init');
        Events.$trigger('image::object-fit');

    }

    /**
     * Bind generic events
     */
    _bindEvents() {

        Events.$on('image::object-fit', (event, element) => {
            if (element) {
                objectFitPolyfill(element);
            } else {
                objectFitPolyfill();
            }
        });

    }

}

export default new Image();
