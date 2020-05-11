import { tns } from 'tiny-slider/src/tiny-slider';
import Events from '@utilities/events';
import RafThrottle from '@utilities/raf-throttle';

const JS_HOOK_WRAPPER = '[js-hook-carousel-wrapper]';
const JS_HOOK_BUTTON_PREV = 'js-hook-carousel-button-prev';
const JS_HOOK_BUTTON_NEXT = 'js-hook-carousel-button-next';

const DATA_ID = 'data-id';

const DATA_SLIDES_MOBILE = 'data-slides-mobile';
const DATA_SLIDES_TABLET_PORTRAIT = 'data-slides-tablet-portrait';
const DATA_SLIDES_TABLET_LANDSCAPE = 'data-slides-tablet-landscape';
const DATA_SLIDES_DESKTOP = 'data-slides-desktop';

const DATA_GUTTER = 'data-gutter';
const DATA_GUTTER_MOBILE = 'data-gutter-mobile';
const DATA_GUTTER_TABLET_PORTRAIT = 'data-gutter-tablet-portrait';
const DATA_GUTTER_TABLET_LANDSCAPE = 'data-gutter-tablet-landscape';
const DATA_GUTTER_DESKTOP = 'data-gutter-desktop';

const DATA_NAV = 'data-nav';
const DATA_NAV_CONTAINER = 'data-nav-container';

const DATA_PREV_BUTTON = 'data-prev-button';
const DATA_NEXT_BUTTON = 'data-next-button'

const DATA_MODE = 'data-mode';
const DATA_AUTOPLAY = 'data-autoplay';
const DATA_AUTOPLAY_TIMEOUT = 'data-autoplay-timeout';
const DATA_LOOP = 'data-loop';
const DATA_SPEED = 'data-speed';
const DATA_SLIDE_BY = 'data-slideby';

const DEFAULT_SPEED = 700;
const DEFAULT_TIMEOUT = 5000;
const DEFAULT_GUTTER = 20;

const breakpoints = {
    mobilePlus: '480',
    tabletPortrait: '768',
    tabletLandscape: '1024',
    desktop: '1280',
};

class Carousel {
    constructor(element) {
        this.element = element;
        this.id = this.element.getAttribute(DATA_ID);
        this.slides = this.element.children;

        this.slidesMobile = parseFloat(this.element.getAttribute(DATA_SLIDES_MOBILE)) || 1;
        this.slidesTabletPortrait = parseFloat(this.element.getAttribute(DATA_SLIDES_TABLET_PORTRAIT)) || this.slidesMobile;
        this.slidesTabletLandscape = parseFloat(this.element.getAttribute(DATA_SLIDES_TABLET_LANDSCAPE)) || this.slidesTabletPortrait;
        this.slidesDesktop = parseFloat(this.element.getAttribute(DATA_SLIDES_DESKTOP)) || this.slidesTabletLandscape;

        this.gutter = parseInt(this.element.getAttribute(DATA_GUTTER)) >= 0 ? parseInt(this.element.getAttribute(DATA_GUTTER)) : DEFAULT_GUTTER;
        this.gutterMobile = parseInt(this.element.getAttribute(DATA_GUTTER_MOBILE)) || this.gutter;
        this.gutterTabletPortrait = parseInt(this.element.getAttribute(DATA_GUTTER_TABLET_PORTRAIT)) || this.gutterMobile;
        this.gutterTabletLandscape = parseInt(this.element.getAttribute(DATA_GUTTER_TABLET_LANDSCAPE)) || this.gutterTabletPortrait;
        this.gutterDesktop = parseInt(this.element.getAttribute(DATA_GUTTER_DESKTOP)) || this.gutterTabletLandscape;

        this.nav = this.element.getAttribute(DATA_NAV) === 'false' ? false : true;
        this.navContainer = document.getElementById(this.element.getAttribute(DATA_NAV_CONTAINER)) || false;

        this.prevButton = document.querySelector(`[${JS_HOOK_BUTTON_PREV}-${this.id}]`) || document.getElementById(this.element.getAttribute(DATA_PREV_BUTTON)) || false;
        this.nextButton = document.querySelector(`[${JS_HOOK_BUTTON_NEXT}-${this.id}]`) || document.getElementById(this.element.getAttribute(DATA_NEXT_BUTTON)) || false;

        this.slideby = parseInt(this.element.getAttribute(DATA_SLIDE_BY)) || 1;
        this.autoplay = this.element.getAttribute(DATA_AUTOPLAY) === 'true' ? true : false;
        this.autoplayTimeout = parseInt(this.element.getAttribute(DATA_AUTOPLAY_TIMEOUT)) || DEFAULT_TIMEOUT;

        this.loop = this.element.getAttribute(DATA_LOOP) === 'true' ? true : false;
        this.speed = parseInt(this.element.getAttribute(DATA_SPEED)) || DEFAULT_SPEED;
        this.mode = this.element.getAttribute(DATA_MODE) || 'carousel';

        this.prepareCarousel();

        this.initSlider();

        this.bindEvents();
    }

    bindEvents() {
        RafThrottle.set([
            {
                element: window,
                event: 'resize',
                namespace: 'eventNamespace',
                fn: () => this.refreshSlider(),
            },
        ]);
    }

    initSlider() {
        this.instance = tns({
          container: this.element,
          items: this.slidesMobile,
          gutter: this.gutter,
          responsive: {
            [breakpoints.tabletPortrait]: {
              items: this.slidesTabletPortrait,
              gutter: this.gutterTabletPortrait,
            },
            [breakpoints.tabletLandscape]: {
              items: this.slidesTabletLandscape,
              gutter: this.gutterTabletLandscape,
            },
            [breakpoints.desktop]: {
              items: this.slidesDesktop,
              gutter: this.gutterDesktop,
            },
          },
          mouseDrag: true,
          speed: this.speed,
          slideBy: this.slideby,
          autoplay: this.autoplay,
          autoplayTimeout: this.autoplayTimeout,
          mode: this.mode,
          controls: true,
          prevButton: this.prevButton,
          nextButton: this.nextButton,
          nav: true,
          navContainer: this.navContainer,
          loop: this.loop,
          autoplayButtonOutput: false,
          preventScrollOnTouch: 'auto',
          onInit: () => this.onInit(),
        })
    }

    onInit() {
        Events.$trigger('lazyimage::update');

        const carouselWrapper = this.element.closest(JS_HOOK_WRAPPER);

        if (carouselWrapper) {
            carouselWrapper.classList.add('carousel--is-loaded');
        }
    }

    refreshSlider() {
        this.instance.destroy();
        this.instance = this.instance.rebuild();
    }

    prepareCarousel() {
        Array.from(this.slides).forEach(slide => {
            const slideWrapper = document.createElement('div');
            slide.parentNode.insertBefore(slideWrapper, slide);
            slideWrapper.appendChild(slide);
        });
    }
}

export default Carousel;
