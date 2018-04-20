import Events from '@utilities/events';
import Layzr from 'layzr.js';
import parseSrcSet from './util/parse-srcset';
import hasResponsiveImages from './util/detect-responsive-images';

const SUPPORTS_SRCSET = checkResponsiveImageRequirements();

class LazyImage {

    constructor() {

        this.instance = null;
        this._bindEvents();

    }

    /**
     * Bind generic events
     */
    _bindEvents() {

        Events.$on('lazyimage::update', () => this._updateImages());
        Events.$on('lazyimage::init', () => this._loadImages());

    }

    /**
     * Lazy load all images if srcset is supported
     */
    _loadImages() {

        if (!SUPPORTS_SRCSET) {
            this._setTabletImage();
            return;
        }

        this.instance = Layzr({
            normal: 'data-src',
            srcset: 'data-srcset',
            threshold: 20
        });

        // Retrigger objectfit polyfill after image is loaded.
        this.instance.on('src:after', element => {
            Events.$trigger('image::object-fit', { data: element });
        });

        this._triggerUpdate();

    }

    /**
     * Update new images
     */
    _updateImages() {

        if (!SUPPORTS_SRCSET) {
            this._setTabletImage();
            return;
        }

        this._triggerUpdate();

    }

    /**
     * Update new images
     */
    _triggerUpdate() {

        // Get all image data.
        this.instance.update();

        // Bind event listeners.
        this.instance.handlers(true);

        // Lazy load images that are already in view (before user starts scrolling).
        this.instance.check();

    }

    /**
     * If srcset isn't supported set the default image size
     */
    _setTabletImage() {

        const images = document.querySelectorAll('img');

        Array.from(images).forEach(image => {

            const srcSet = parseSrcSet(image.getAttribute('data-srcset')) || [{ url: image.getAttribute('data-src') }];

            // Pick tablet image.
            const src = Array.from(srcSet).find(a => a.width === 1024);

            // Pick correct image source
            const srcUrl = (src !== undefined) ? src.url : image.getAttribute('data-src') || image.src;

            // Setting to null first prevents weird bugs of not updating src in IE.
            image.src = null;

            image.src = srcUrl;

            image.removeAttribute('data-srcset');

        });

        Events.$trigger('image::object-fit');

    }

}

/**
 * Check if srcset is supported
 * @returns {Boolean}
 */
function checkResponsiveImageRequirements() {
    return hasResponsiveImages.srcset || hasResponsiveImages.picture;
}

export default new LazyImage();
