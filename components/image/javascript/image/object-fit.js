import Events from '../util/events';
import parseSrcSet from './util/parse-srcset';
import 'core-js/fn/array/from';
import 'core-js/fn/array/find';

const HAS_POLYFILL_CLASS            = 'has--object-fit-polyfill';
const OBJECT_FIT_IMAGE_HOOK         = 'js-hook-objectfit-img';
const OBJECT_FIT_CONTAINER_HOOK     = 'js-hook-objectfit-container';

const html = document.querySelector('html');


class ObjectFit {

    constructor() {

        this.bindEvents();

    }

    bindEvents() {
        Events.$on('image::object-fit', (event, element) => this.polyfillObjectFit(element) );
    }

    polyfillObjectFit(element) {
        if ('objectFit' in document.documentElement.style) { return; }

        const images = this.getObjectfitImages(element);
        html.classList.add( HAS_POLYFILL_CLASS );

        Array.from(images).forEach( image => this.polyfillImage(image));

    }

    getObjectfitImages(element) {
        let images = [];

        if (element) {
            // If element without hook is passed in, ignore it.
            if (typeof element.getAttribute( OBJECT_FIT_IMAGE_HOOK ) === 'undefined' || element.getAttribute( OBJECT_FIT_IMAGE_HOOK ) === false) { return; }
            images.push(element);
        } else {
            images = document.querySelectorAll(`[${OBJECT_FIT_IMAGE_HOOK}]`);
        }

        return images;
    }

    polyfillImage(image) {
        const srcSet = parseSrcSet(image.getAttribute('data-srcset') || image.getAttribute('srcset'));

        // Pick tablet image.
        const src = Array.from(srcSet).find(a => a.width === 1024);

        // Pick correct image source
        const srcUrl = (src !== undefined) ? src.url : image.src;

        const container = image.closest(`[${OBJECT_FIT_CONTAINER_HOOK}]`);
        container.setAttribute('style', `background-image: url(${srcUrl});`);
    }

}

export default new ObjectFit();
