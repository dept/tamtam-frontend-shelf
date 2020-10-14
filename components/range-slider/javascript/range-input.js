const SLIDER_THUMB_HOOK = '[js-hook-range-slider-thumb]';

class RangeInput {
    constructor(element, options) {
        this.element = element;
        this.options = options || {};
        this.isAnimating = false;
        this.lastXPos = 0;
        this.initialXPos = 0;
        this.lastThumbPos = 0;
        this.thumb = this.element.querySelector(SLIDER_THUMB_HOOK);
        this.initialRatio = this.options.initialRatio;
        this.width = 0;
        this.isPointerEvents = !!window.PointerEvent;
        this.isToggleMouse = true;

        this.bindEvents();
    }

    bindEvents() {
        this.init();
    }

    /**
     * Add Event Listeners
     */
    init() {
        let eventType; // pointer or touch
        const handlerNames = '☺,Start,Move,End,End,Start'.split(',');

        if (this.initialRatio > 1) this.initialRatio = 1;
        if (this.initialRatio < 0) this.initialRatio = 0;

        this.thumb.style.left = `${100 * this.initialRatio}%`;

        (this.isPointerEvents
            ? 'pointer,down,move,up,cancel'
            : 'touch,start,move,end,cancel,mousedown'
        )
            .split(',')
            .forEach((eventName, i) => {
                if (!i) {
                    eventType = eventName;
                } else {
                    this.thumb.addEventListener(
                        (i === 5 ? '' : eventType) + eventName,
                        evt => this[`handleGesture${handlerNames[i]}`](evt),
                        true,
                    );
                }
            });
    }

    /**
     * Handle Gesture Start
     * @param {Object} evt
     */
    handleGestureStart(evt) {
        evt.preventDefault();

        // if this is a mousedown event, and it is NOT the LEFT mousebutton, ignore it.
        const button = evt.which || evt.button;
        if (button && button > 1) return;

        const point = RangeInput.getGesturePointFromEvent(evt);
        this.initialXPos = point.x;

        // cache the width when starting a gesture
        this.width = this.element.clientWidth;

        // Add the move and end listeners
        if (this.isPointerEvents) {
            evt.target.setPointerCapture(evt.pointerId);
        } else {
            // Add Mouse Listeners
            this.toggleMouseEventListeners();
        }
    }

    /**
     * Handle Gesture End
     * @param {Object} evt
     */
    handleGestureEnd(evt) {
        evt.preventDefault();
        if (evt.targetTouches && evt.targetTouches.length > 0) {
            return;
        }

        // Remove Event Listeners
        if (this.isPointerEvents) {
            evt.target.releasePointerCapture(evt.pointerId);
        } else {
            // Remove Mouse Listeners
            this.toggleMouseEventListeners();
        }

        this.isAnimating = false;
        this.lastThumbPos = this.lastThumbPos + this.lastXPos - this.initialXPos;

        // fix for going past (end of slider or min or max) while moving slider
        const ratio = this.initialRatio + this.lastThumbPos / this.width;

        if (ratio > 1) {
            this.lastThumbPos = this.width * (1 - this.initialRatio);
        }
        if (ratio < 0) {
            this.lastThumbPos = this.width * -this.initialRatio;
        }
        if (this.options.maxRatio && ratio > this.options.maxRatio) {
            this.lastThumbPos = this.width * (this.options.maxRatio - this.initialRatio);
        }
        if (this.options.minRatio && ratio < this.options.minRatio) {
            this.lastThumbPos = this.width * (this.options.minRatio - this.initialRatio);
        }
        this.initialXPos = null;
    }

    /**
     * Handle Gesture Move
     * @param {Object} evt
     */
    handleGestureMove(evt) {
        evt.preventDefault();

        if (evt.targetTouches && evt.targetTouches.length > 1) {
            return;
        }

        if (!this.initialXPos) {
            return;
        }

        const point = RangeInput.getGesturePointFromEvent(evt);
        this.lastXPos = point.x;

        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;
        window.requestAnimationFrame(() => this.onAnimFrame());
    }

    /**
     * Toggle Mouse Event Listeners
     */
    toggleMouseEventListeners(isRemove) {
        const action = this.isToggleMouse && !isRemove ? 'addEventListener' : 'removeEventListener';
        document.body[action]('mousemove', evt => this.handleGestureMove(evt));
        document.body[action]('mouseup', evt => this.handleGestureEnd(evt));
        this.isToggleMouse = !this.isToggleMouse;
    }

    /**
     * Normalize Point object
     * @param {Object} evt
     */
    static getGesturePointFromEvent(evt) {
        const point = {};

        if (evt.targetTouches) {
            // Prefer Touch Events
            point.x = evt.targetTouches[0].clientX;
        } else {
            // Either Mouse event or Pointer Event
            point.x = evt.clientX;
        }

        return point;
    }

    /**
     * Main Event Loop
     */
    onAnimFrame() {
        if (!this.isAnimating) {
            return;
        }

        const newXTransform = this.lastThumbPos + this.lastXPos - this.initialXPos;
        let ratio = this.initialRatio + newXTransform / this.width;

        if (ratio > 1) {
            ratio = 1;
        } else if (ratio < 0) {
            ratio = 0;
        }

        if (this.options.maxRatio && ratio > this.options.maxRatio) {
            ratio = this.options.maxRatio;
        }

        if (this.options.minRatio && ratio < this.options.minRatio) {
            ratio = this.options.minRatio;
        }

        this.thumb.style.left = `${ratio * 100}%`;

        if (this.options.onChange) {
            this.options.onChange(ratio);
        }

        this.isAnimating = false;
    }

    /**
     * Destroy
     * be good to the memory usage - remove event listeners and node references
     */
    destroy() {
        // Remove Mouse Listeners
        this.toggleMouseEventListeners(/* isRemove = */ true);
        // Ensure elements are not referenced so that they and any listeners are Garbage Collected
        this.thumb = null;
        this.element = null;
        this.options = null;
    }

    setMin(min) {
        this.options.minRatio = min;
    }

    setMax(max) {
        this.options.maxRatio = max;
    }
}

export default RangeInput;
