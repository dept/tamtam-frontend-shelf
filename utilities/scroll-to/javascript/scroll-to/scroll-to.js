import raf from 'raf';
import Events from '@utilities/events';

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

            const { target, scrollElement, offset, duration } = data;
            this.scrollTo(target, scrollElement, offset, duration);

        });

    }

    _initElements() {

        this.elements = getElements();

        Array.from(this.elements).forEach(element => {

            if (element.scrollToisInitialised) { return; }

            element.addEventListener('click', event => {
                const target = element.getAttribute('href').split('#');
                const targetEl = document.querySelector(`#${target.length > 1 ? target[1] : target}`);
                if (targetEl) {
                    event.preventDefault();
                    const scrollConfig = {
                        position: targetEl.getBoundingClientRect(),
                        offset: element.dataset.scrollOffset ? parseInt(element.dataset.scrollOffset, 10) : ST_OFFSET,
                        duration: element.dataset.scrollDuration ? parseInt(element.dataset.scrollDuration, 10) : ST_DURATION,
                        scrollElement: element.dataset.scrollElement
                    };
                    scrollTo(scrollConfig);
                }
            });

            element.scrollToisInitialised = true;

        });

    }

    scrollTo(target, duration, offset, scrollElement) {

        const scrollConfig = {
            position: target.getBoundingClientRect(),
            offset: parseInt(offset, 10) || ST_OFFSET,
            duration: parseInt(duration, 10) || ST_DURATION,
            scrollElement: scrollElement
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
function scrollTo({ position, offset, duration, scrollElement }) {

    return new Promise(resolve => {

        const scrollPosition = (window.scrollY === undefined) ? window.pageYOffset : window.scrollY;
        const to = position.top + scrollPosition - offset;
        const start = scrollElement ? scrollElement.scrollTop : Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        const change = to - start;
        let currentTime = 0;
        const increment = 10;

        const animate = () => {

            currentTime += increment;
            const val = parseInt(easeInOutQuad(currentTime, start, change, duration).toFixed(0), 10);

            if (scrollElement) {
                scrollElement.scrollTop = val;
            } else {
                document.body.scrollTop = val;
                document.documentElement.scrollTop = val;
            }

            if (val >= to) {
                resolve();
            } else {
                raf(animate);
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
