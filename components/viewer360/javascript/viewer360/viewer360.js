import Events from '@utilities/events';
import { createElementFromString, getViewer360Props } from './util';

const JS_HOOK_PREV_BUTTON = '[js-hook-viewer-360-prev]';
const JS_HOOK_NEXT_BUTTON = '[js-hook-viewer-360-next]';
const JS_HOOK_LOADING_TEXT = '[js-hook-loading-indicator-text]';

class Viewer360 {
    constructor(element, ratio) {
        this.element = element;
        this.activeImage = 1;
        this.movementStart = 0;
        this.isClicked = false;
        this.loadedImages = 0;
        this.imagesLoaded = false;
        this.reversed = false;
        this.ratio = ratio || false;
        this.images = [];
        this.devicePixelRatio = Math.round(window.devicePixelRatio || 1);
        this.isMobile = !!('ontouchstart' in window || navigator.msMaxTouchPoints);

        this.init(element);
    }

    mousedown(event) {
        event.preventDefault();

        if (!this.imagesLoaded) return;

        if (this.autoplay || this.loopTimeoutId) {
            this.stop();
            this.autoplay = false;
        }

        this.movementStart = event.pageX;
        this.isClicked = true;
        this.element.style.cursor = 'grabbing';
    }

    mouseup() {
        if (!this.imagesLoaded) return;

        this.movementStart = 0;
        this.isClicked = false;
        this.element.style.cursor = 'grab';
    }

    mousemove(event) {
        if (!this.isClicked || !this.imagesLoaded) return;

        this.onMove(event.pageX);
    }

    touchstart(event) {
        if (!this.imagesLoaded) return;

        if (this.autoplay || this.loopTimeoutId) {
            this.stop();
            this.autoplay = false;
        }

        this.movementStart = event.touches[0].clientX;
        this.isClicked = true;
    }

    touchend() {
        if (!this.imagesLoaded) return;

        this.movementStart = 0;
        this.isClicked = false;
    }

    touchmove(event) {
        if (!this.isClicked || !this.imagesLoaded) return;

        this.onMove(event.touches[0].clientX);
    }

    keydownGeneral() {
        if (!this.imagesLoaded) return;
    }

    keydown(event) {
        if (!this.imagesLoaded) return;

        if ([37, 39].includes(event.keyCode)) {
            if (event.keyCode === 37) {
                if (this.reversed) this.prev();
                else this.next();
            } else if (event.keyCode === 39) {
                if (this.reversed) this.next();
                else this.prev();
            }

            this.onSpin();
        }
    }

    onSpin() {
        if (this.autoplay || this.loopTimeoutId) {
            this.stop();
            this.autoplay = false;
        }
    }

    onMove(pageX) {
        if (pageX - this.movementStart >= this.speedFactor) {
            const itemsSkippedRight = Math.floor((pageX - this.movementStart) / this.speedFactor) || 1;

            this.movementStart = pageX;

            if (this.spinReverse) {
                this.moveActiveIndexDown(itemsSkippedRight);
            } else {
                this.moveActiveIndexUp(itemsSkippedRight);
            }

            this.update();
        } else if (this.movementStart - pageX >= this.speedFactor) {
            const itemsSkippedLeft = Math.floor((this.movementStart - pageX) / this.speedFactor) || 1;

            this.movementStart = pageX;

            if (this.spinReverse) {
                this.moveActiveIndexUp(itemsSkippedLeft);
            } else {
                this.moveActiveIndexDown(itemsSkippedLeft);
            }

            this.update();
        }
    }

    moveActiveIndexUp(itemsSkipped) {
        const isReverse = this.controlReverse ? !this.spinReverse : this.spinReverse;

        if (!this.stopAtEdges) {
            this.activeImage = (this.activeImage + itemsSkipped) % this.amount || 1;
            return;
        }

        if (this.activeImage + itemsSkipped >= this.amount) {
            this.activeImage = this.amount;

            if (isReverse ? this.prevElem : this.nextElem) {
                const element = isReverse ? this.prevElem : this.nextElem;
                element.setAttribute('disabled', '');
            }
        } else {
            this.activeImage += itemsSkipped;

            if (this.nextElem) {
                this.nextElem.removeAttribute('disabled');
            }

            if (this.prevElem) {
                this.prevElem.removeAttribute('disabled');
            }
        }
    }

    moveActiveIndexDown(itemsSkipped) {
        const isReverse = this.controlReverse ? !this.spinReverse : this.spinReverse;

        if (this.stopAtEdges) {
            if (this.activeImage - itemsSkipped <= 1) {
                this.activeImage = 1;

                if (isReverse ? this.nextElem : this.prevElem) {
                    const element = isReverse ? this.nextElem : this.prevElem;
                    element.setAttribute('disabled', '');
                }
            } else {
                this.activeImage -= itemsSkipped;

                if (this.prevElem) {
                    this.prevElem.removeAttribute('disabled');
                }
                if (this.nextElem) {
                    this.nextElem.removeAttribute('disabled');
                }
            }
        } else if (this.activeImage - itemsSkipped < 1) {
            this.activeImage = this.amount + (this.activeImage - itemsSkipped);
        } else {
            this.activeImage -= itemsSkipped;
        }
    }

    loop(reversed) {
        if (reversed) {
            this.prev();
            return;
        }
        this.next();
    }

    next() {
        this.moveActiveIndexUp(1);
        this.update();
    }

    prev() {
        this.moveActiveIndexDown(1);
        this.update();
    }

    update() {
        const image = this.images[this.activeImage - 1];
        const ctx = this.canvas.getContext('2d');

        ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

        this.canvas.width = this.element.offsetWidth * this.devicePixelRatio;
        this.canvas.style.width = `${this.element.offsetWidth}px`;
        this.canvas.height = ((this.element.offsetWidth * this.devicePixelRatio) / image.width) * image.height;
        this.canvas.style.height = `${(this.element.offsetWidth / image.width) * image.height}px`;

        ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    onAllImagesLoaded() {
        this.imagesLoaded = true;
        this.element.style.cursor = 'grab';
        this.removeLoader();

        this.speedFactor =
            Math.floor(((((this.dragSpeed / 150) * 36) / this.amount) * 25 * this.element.offsetWidth) / 1500) || 1;

        if (this.autoplay) {
            this.play();
        }

        this.initControls();
    }

    onFirstImageLoaded(event) {
        this.canvas.width = this.element.offsetWidth * this.devicePixelRatio;
        this.canvas.style.width = `${this.element.offsetWidth}px`;
        this.canvas.height =
            ((this.element.offsetWidth * this.devicePixelRatio) / event.target.width) * event.target.height;
        this.canvas.style.height = `${(this.element.offsetWidth / event.target.width) * event.target.height}px`;

        const ctx = this.canvas.getContext('2d');

        ctx.drawImage(event.target, 0, 0, this.canvas.width, this.canvas.height);

        if (this.lazyload) {
            this.images.forEach((image, index) => {
                if (index === 0) {
                    this.innerContainer.removeChild(this.lazyloadInitImage);
                    return;
                }

                const dataSrc = image.getAttribute('data-src');

                if (dataSrc) {
                    image.src = image.getAttribute('data-src');
                }
            });
        }

        if (this.ratio) {
            this.element.style.minHeight = 'auto';
        }
    }

    onImageLoad(event) {
        const percentage = Math.round((this.loadedImages / this.amount) * 100);

        this.loadedImages += 1;
        this.updatePercentageInLoader(percentage);

        if (this.loadedImages === this.amount) {
            this.onAllImagesLoaded(event);
        } else if (this.loadedImages === 1) {
            this.onFirstImageLoaded(event);
        }
    }

    updatePercentageInLoader(percentage) {
        if (this.loader) {
            const textElement = this.loader.querySelector(JS_HOOK_LOADING_TEXT);
            if (textElement) textElement.innerHTML = `${percentage}%`;
        }
    }

    addLoader() {
        Events.$trigger('loader::show', {
            data: {
                targetElement: '[js-hook-viewer-360-container]',
                lightTheme: true
            }
        });
        // Add a text div to our loader to add the percentage to
        const loader = this.element.querySelector('[js-hook-loading-indicator]');
        const loaderText = createElementFromString(
            `<div class="loading-indicator__text" js-hook-loading-indicator-text></div>`
        );
        loader.appendChild(loaderText);
        this.loader = loader;
    }

    removeLoader() {
        if (!this.loader) return;

        Events.$trigger('loader::hide');
        this.loader = null;
    }

    play() {
        this.loopTimeoutId = window.setInterval(() => {
            this.loop(this.reversed);
        }, this.autoplaySpeed);
    }

    stop() {
        window.clearTimeout(this.loopTimeoutId);
    }

    static getSrc(responsive, element, folder, filename) {
        let src = `${folder}${filename}`;

        if (responsive) {
            // TODO: handle responsiveness
            // Add the size attribute to your backend image sizing mechanism
            // for example `https://via.placeholder.com/${size}`
            // const imageOffsetWidth = element.offsetWidth;
            // const imageSize = getSizeAccordingToPixelRatio(getResponsiveWidthOfContainer(imageOffsetWidth));
            src = `${folder}${filename}`;
        }

        return src;
    }

    preloadImages(amount, src, lazyload, lazySelector) {
        [...new Array(amount)].map((item, index) => {
            const image = new Image();
            const resultSrc = src.replace('{index}', index + 1);

            if (lazyload) {
                image.setAttribute('data-src', resultSrc);
                image.className = image.className.length ? `${image.className} ${lazySelector}` : lazySelector;

                if (index === 0) {
                    this.lazyloadInitImage = image;
                    image.style.position = 'absolute';
                    image.style.top = '0';
                    image.style.left = '0';
                    this.innerContainer.appendChild(image);
                }
            } else {
                image.src = resultSrc;
            }

            image.onload = this.onImageLoad.bind(this);
            image.onerror = this.onImageLoad.bind(this);

            this.images.push(image);
        });
    }

    destroy() {
        this.stop();

        const oldElement = this.element;
        const newElement = oldElement.cloneNode(true);
        const innerContainer = newElement.querySelector('.viewer-360__container');

        newElement.className = newElement.className.replace(' is--initialized', '');
        newElement.style.position = 'relative';
        newElement.style.width = '100%';
        newElement.style.cursor = 'default';
        newElement.setAttribute('draggable', 'false');
        newElement.style.minHeight = 'auto';
        newElement.removeChild(innerContainer);
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }

    initControls() {
        const isReverse = this.controlReverse ? !this.spinReverse : this.spinReverse;
        const prev = this.element.querySelector(JS_HOOK_PREV_BUTTON);
        const next = this.element.querySelector(JS_HOOK_NEXT_BUTTON);

        if (!prev && !next) return;

        const onLeftStart = event => {
            event.stopPropagation();
            this.onSpin();
            this.prev();
            this.loopTimeoutId = window.setInterval(this.prev.bind(this), this.autoplaySpeed);
        };
        const onRightStart = event => {
            event.stopPropagation();
            this.onSpin();
            this.next();
            this.loopTimeoutId = window.setInterval(this.next.bind(this), this.autoplaySpeed);
        };
        const onLeftEnd = () => {
            window.clearTimeout(this.loopTimeoutId);
        };
        const onRightEnd = () => {
            window.clearTimeout(this.loopTimeoutId);
        };

        if (prev) {
            prev.style.display = 'block';
            prev.addEventListener('mousedown', isReverse ? onRightStart : onLeftStart);
            prev.addEventListener('touchstart', isReverse ? onRightStart : onLeftStart);
            prev.addEventListener('mouseup', isReverse ? onRightEnd : onLeftEnd);
            prev.addEventListener('touchend', isReverse ? onRightEnd : onLeftEnd);

            this.prevElem = prev;
        }

        if (next) {
            next.style.display = 'block';
            next.addEventListener('mousedown', isReverse ? onLeftStart : onRightStart);
            next.addEventListener('touchstart', isReverse ? onLeftStart : onRightStart);
            next.addEventListener('mouseup', isReverse ? onLeftEnd : onRightEnd);
            next.addEventListener('touchend', isReverse ? onLeftEnd : onRightEnd);

            this.nextElem = next;
        }

        if (isReverse ? next : prev) {
            if (this.stopAtEdges) {
                const element = isReverse ? next : prev;
                element.setAttribute('disabled', '');
            }
        }
    }

    addInnerContainer() {
        this.innerContainer = createElementFromString(
            '<div class="viewer-360__container" js-hook-viewer-360-container />'
        );
        this.element.appendChild(this.innerContainer);
    }

    addCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.fontSize = '0';

        if (this.ratio) {
            this.element.style.minHeight = `${this.element.offsetWidth * this.ratio}px`;
            this.canvas.height = parseInt(this.element.style.minHeight, 10);
        }

        this.innerContainer.appendChild(this.canvas);
    }

    bindEvents(draggable, swipeable, keys) {
        if (draggable) {
            this.element.addEventListener('mousedown', this.mousedown.bind(this));
            this.element.addEventListener('mouseup', this.mouseup.bind(this));
            this.element.addEventListener('mousemove', this.mousemove.bind(this));
        }

        if (swipeable) {
            this.element.addEventListener('touchstart', this.touchstart.bind(this), { passive: true });
            this.element.addEventListener('touchend', this.touchend.bind(this), { passive: true });
            this.element.addEventListener('touchmove', this.touchmove.bind(this));
        }

        if (keys) {
            document.addEventListener('keydown', this.keydown.bind(this));
        } else {
            document.addEventListener('keydown', this.keydownGeneral.bind(this));
        }
    }

    applyStylesToContainer() {
        this.element.style.position = 'relative';
        this.element.style.width = '100%';
        this.element.style.cursor = 'wait';
        this.element.setAttribute('draggable', 'false');
        this.element.className = `${this.element.className} is--initialized`;
    }

    init(element) {
        const {
            folder,
            filename,
            amount,
            draggable = true,
            swipeable = true,
            keys,
            autoplay,
            speed,
            autoplayReverse,
            ratio,
            responsive,
            lazyload,
            lazySelector,
            spinReverse,
            dragSpeed,
            stopAtEdges,
            controlReverse
        } = getViewer360Props(element);

        this.addInnerContainer();
        this.addLoader();

        this.folder = folder;
        this.filename = filename;
        this.amount = amount;
        this.autoplay = autoplay && !this.isMobile;
        this.speed = speed;
        this.reversed = autoplayReverse;
        this.lazyload = lazyload;
        this.ratio = ratio;
        this.spinReverse = spinReverse;
        this.controlReverse = controlReverse;
        this.dragSpeed = dragSpeed;
        this.autoplaySpeed = (this.speed * 36) / this.amount;
        this.stopAtEdges = stopAtEdges;

        this.applyStylesToContainer();
        this.addCanvas();

        const src = Viewer360.getSrc(responsive, element, folder, filename);
        this.preloadImages(amount, src, lazyload, lazySelector);

        this.bindEvents(draggable, swipeable, keys);
    }
}

export default Viewer360;
