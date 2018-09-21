import { html } from '@utilities/dom-elements';
import ScreenDimensions from '@utilities/screen-dimensions';

const DIRECTIONS = {
    LEFT : 'left',
    RIGHT : 'right',
    TOP : 'top',
    BOTTOM : 'bottom',
};
const TRIANGLE = '[js-hook-triangle]';

// Change to the class of your nav if the nav is fixed
const NAV_CLASS = '.your-nav-class';
const CALCULATE_NAV_OFFSET = true;

const TOOLTIP_PREFIX = 'tooltip--';
const TOOLTIP_PROPS = [
    `${TOOLTIP_PREFIX}left-top`,
    `${TOOLTIP_PREFIX}left-center`,
    `${TOOLTIP_PREFIX}left-bottom`,
    `${TOOLTIP_PREFIX}right-top`,
    `${TOOLTIP_PREFIX}right-center`,
    `${TOOLTIP_PREFIX}right-bottom`,
    `${TOOLTIP_PREFIX}top-left`,
    `${TOOLTIP_PREFIX}top-center`,
    `${TOOLTIP_PREFIX}top-right`,
    `${TOOLTIP_PREFIX}bottom-left`,
    `${TOOLTIP_PREFIX}bottom-center`,
    `${TOOLTIP_PREFIX}bottom-right`,
];

class Tooltip {

    constructor(element) {

        this.element = element;
        this.triangle = this.element.querySelector(TRIANGLE);
        this.nav = document.querySelector(NAV_CLASS);

        this.element.parentNode.addEventListener('mouseenter', () => this.inScreen(this.getElementPositions(this.element)));

        if (ScreenDimensions.isTabletPortraitAndBigger) {
            this.element.parentNode.addEventListener('mouseleave', () => this.resetElement());
        }

    }

    getElementPositions(element) {
        const { top, right, bottom, left } = element.getBoundingClientRect();

        return {
            top,
            right,
            bottom,
            left
        }
    }

    resetElement() {
        this.element.removeAttribute('style');
        this.triangle.removeAttribute('style');

        let oldTipPosition = TOOLTIP_PREFIX + this.element.dataset.position;

        const classItem = this.getClassItems();
        this.element.classList.remove(classItem);
        this.element.classList.add(oldTipPosition);
    }

    inScreen(position) {
        if (CALCULATE_NAV_OFFSET) {
            this.navHeight = this.nav ? this.nav.offsetHeight : 0;
        } else {
            this.navHeight = 0;
        }

        for (const key in position) {
            const positionInScreen = this.oldPosition(key, position[key]);
            if (positionInScreen < 0) {
                this.newPosition(key, positionInScreen)
            }
        }
    }

    oldPosition(key, position) {
        switch (key) {
            case DIRECTIONS.RIGHT:
                return html.offsetWidth - position;
            case DIRECTIONS.BOTTOM:
                return window.innerHeight - position;
            case DIRECTIONS.TOP:
                return position - this.navHeight;
            default:
                return position;

        }
    }

    newPositionKey(key) {
        switch (key) {
            case DIRECTIONS.RIGHT:
                return DIRECTIONS.LEFT;
            case DIRECTIONS.LEFT:
                return DIRECTIONS.RIGHT;
            case DIRECTIONS.TOP:
                return DIRECTIONS.BOTTOM;
            case DIRECTIONS.BOTTOM:
                return DIRECTIONS.TOP;
            default:
                return key;
        }
    }

    reverseNumber(number) {
        return number < 0 ? Math.abs(number) : -Math.abs(number)
    }

    newPosition(key, position) {
        const classItem = this.getClassItems();

        if (ScreenDimensions.isTabletPortraitAndBigger) {
            this.newDesktopPosition(key, classItem, position);
        } else {
            this.newMobilePosition(key, classItem);
        }

    }

    getClassItems() {
        return [...this.element.classList].filter(classItem => TOOLTIP_PROPS.indexOf(classItem) !== -1).reduce((a, b) => b, {});
    }

    getDesktopMargins(key, position) {
        const positionReverse = this.reverseNumber(position);

        switch (key) {
            case DIRECTIONS.TOP:
            case DIRECTIONS.LEFT:
                return {
                    element: positionReverse,
                    triangle: position
                }
            case DIRECTIONS.BOTTOM:
            case DIRECTIONS.RIGHT:
                return {
                    element: position,
                    triangle: positionReverse
                }
        }
    }

    newDesktopPosition(key, classItem, position) {

        /** If the tooltip is outside the screen, then check if the position isn't in the classname.
            So if the position is left-center and the tooltip is outside the topscreen then do this. 
            Not if position is top-center and tooltip is outside the topscreen. 
        */
        if (classItem.indexOf('center') > 0 && classItem.indexOf(key) === -1) {

            const margins = this.getDesktopMargins(key, position);

            if (key === DIRECTIONS.BOTTOM || key === DIRECTIONS.TOP) {
                this.element.style.marginTop = `${margins.element}px`;
                this.triangle.style.marginTop = `${margins.triangle}px`;
            } else {
                this.element.style.marginLeft = `${margins.element}px`;
                this.triangle.style.marginLeft = `${margins.triangle}px`;
            }
        } else {
            this.element.classList.remove(classItem);

            const newPosition = classItem.replace(key, this.newPositionKey(key));
            this.element.classList.add(newPosition);
        }
    }

    newMobilePosition(key, classItem) {

        if (classItem.indexOf(key) > 0) {
            if (key === DIRECTIONS.LEFT || key === DIRECTIONS.RIGHT) {
                this.element.classList.remove(classItem);

                // Add class for more dynamic control on mobile
                this.element.classList.add(`${TOOLTIP_PREFIX}top-center`, `${TOOLTIP_PREFIX}full-width`);

                const { left } = this.getElementPositions(this.element);
                const margins = this.getDesktopMargins(DIRECTIONS.LEFT, left);

                this.element.style.marginLeft = `${margins.element}px`;
                this.triangle.style.marginLeft = `${margins.triangle}px`;
            }
        }
    }
}

export default Tooltip;

