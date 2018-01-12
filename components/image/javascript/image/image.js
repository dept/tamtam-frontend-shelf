import Events from '../util/events';
import './lazy-image';
import './object-fit';

class Image {

    constructor() {

        Events.$trigger('lazyimage::init');
        Events.$trigger('image::object-fit');

    }

}

export default new Image();
