/**
 * Object Fit polyfill module.
 * Checks if objectFit exists in browser. If not, it turns the image into a background-image.
 */

// @formatter:off
import 'core-js/fn/array/from';
import 'core-js/fn/array/find';

import $ from 'jquery';

import parseSrcSet from './parse-srcset';

// @formatter:on

const html = document.querySelector('html');

function objectFitPolyfill(element) {

    if ('objectFit' in document.documentElement.style) { return; }

    let images = [];

    if (element) {
        if (typeof element.getAttribute('js-hook-objectfit-img') === 'undefined' || element.getAttribute('js-hook-objectfit-img') === false) { return; }
        images.push(element);
    } else {
        images = document.querySelectorAll('[js-hook-objectfit-img]');
    }

    html.classList.add('has--object-fit-polyfill');

    Array.from(images).forEach(function (image) {

        const img = image;
        const $img = $(img);
        const srcSet = parseSrcSet(img.getAttribute('data-srcset') || img.getAttribute('srcset'));

        // Pick tablet image.
        const src = Array.from(srcSet).find((a) => a.width === 1024);

        // Pick correct image source
        const srcUrl = (src !== undefined) ? src.url : img.src;

        const $container = $img.closest('[js-hook-objectfit-container]');

        $container.attr('style', `background-image: url(${srcUrl});`);

    });

}

export default objectFitPolyfill;
