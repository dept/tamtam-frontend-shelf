import Events from '@utilities/events';
import InView from '@utilities/in-view';

// import parseSrcSet from './util/parse-srcset';
import hasResponsiveImages from './util/detect-responsive-images';

const LAZY_IMAGE_HOOK = '.c-image';
const LAZY_IMAGE_SRC_HOOK = 'data-src';
const LAZY_IMAGE_SRCSET_HOOK = 'data-srcset';
const LAZY_IMAGE_ANIMATE_IN_CLASS = 'u-fade-in';

const SUPPORTS_SRCSET = checkResponsiveImageRequirements();
// const SUPPORTS_SRCSET = false;

class LazyImage {

    constructor() {

        this.images = getImageNodes(LAZY_IMAGE_HOOK);

        this.bindEvents();
        this.setObserverables();

    }

    bindEvents() {

        Events.$on('lazyimage::load', (e, element) => this._loadImage(element));

    }

    setObserverables() {

        InView.addElements(this.images, 'lazyimage::load');

    }

    _loadImage(element) {

        const image = element.querySelector('img');
        if (!image) return;

        const src = image.getAttribute(LAZY_IMAGE_SRC_HOOK);
        const srcset = image.getAttribute(LAZY_IMAGE_SRCSET_HOOK);

        if (!src) return;

        if (SUPPORTS_SRCSET && srcset) {
            image.srcset = srcset;
        }

        image.src = src;

        image.onload = () => {

            image.classList.add(LAZY_IMAGE_ANIMATE_IN_CLASS);
            image.removeAttribute(LAZY_IMAGE_SRC_HOOK);
            image.removeAttribute(LAZY_IMAGE_SRCSET_HOOK);

            if (!hasResponsiveImages.currentSrc) {
                image.currentSrc = image.src;
            }

            Events.$trigger('image::object-fit', { data: image });

        }

    }

}

/**
 * Check if srcset is supported
 * @returns {Boolean}
 */
function checkResponsiveImageRequirements() {
    return hasResponsiveImages.srcset || hasResponsiveImages.picture;
}

/**
 * Check if srcset is supported
 * @param {String} selector Lookup identifier
 * @returns {Array}
 */
function getImageNodes(selector) {
    return [...document.querySelectorAll(selector)];
}

export default new LazyImage();
