import raf from 'raf';
import Events from 'modules/util/events';

const ST_HOOK = 'a[href^="#"]';
const ST_DURATION = 500;
const ST_OFFSET = 50;

class ScrollTo {

    constructor() {

        this._bindEvents();
        this._initElements();

    }


    /**
     * Bind event
     */
    _bindEvents() {

        Events.$on('scroll-to::scroll', (event, data) => {

            const { scrollElement, target, duration, offset } = data;
            this.scrollTo(scrollElement, target, duration, offset);

        });

    }

    _initElements() {

        this.elements = getElements();

        Array.from(this.elements).forEach(element => {

            if (element.scrollToisInitialised) { return; }

            element.addEventListener('click', event => {
                event.preventDefault();
                const target = element.getAttribute('href');
                const targetEl = document.querySelector(target);
                if (targetEl) {
                    const scrollConfig = {
                        scrollElement: element.dataset.scrollElement,
                        position: targetEl.getBoundingClientRect(),
                        duration: element.dataset.scrollDuration ? parseInt(element.dataset.scrollDuration, 10) : ST_DURATION,
                        offset: element.dataset.scrollOffset ? parseInt(element.dataset.scrollOffset, 10) : ST_OFFSET
                    };
                    scrollTo(scrollConfig);
                }
            });

            element.scrollToisInitialised = true;

        });

    }

    scrollTo(scrollElement, target, duration, offset) {

        const scrollConfig = {
            scrollElement: scrollElement,
            position: target.getBoundingClientRect(),
            duration: parseInt(duration, 10) || ST_DURATION,
            offset: parseInt(offset, 10) || ST_OFFSET
        };

        return scrollTo(scrollConfig);

    }

}

/**
 * Gets all elements matching the ST_HOOK
 * @returns {NodeList} All matching HTMLElements
 */
function getElements() {
    return document.querySelectorAll(ST_HOOK);
}

/**
 * Scrolls the window to the top
 */
function scrollTo({ scrollElement, position, duration, offset }) {

    return new Promise(resolve => {

        const scrollPosition = window.pageYOffset || window.scrollY;
        const to = position.top + scrollPosition - offset;
        const start = scrollElement ? scrollElement.scrollTop : Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        const change = to - start;
        let currentTime = 0;
        const increment = 10;


        const animate = () => {

            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);

            if (scrollElement) {
                scrollElement.scrollTop = val;
            } else {
                document.body.scrollTop = val;
                document.documentElement.scrollTop = val;
            }

            if (currentTime < duration) {
                raf(animate);
            } else {
                resolve();
            }
        }

        animate();

    });

}

function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

export default new ScrollTo();
