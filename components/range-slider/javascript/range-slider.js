import debounce from 'lodash/debounce';
import Events from '@utilities/events';
import DoubleRangeInput from './double-range-input';
const INPUT_HOOK = '[js-hook-range-slider-input]';
const INPUT_LOW_HOOK = '[js-hook-range-slider-input-low]';
const INPUT_HIGH_HOOK = '[js-hook-range-slider-input-high]';

class RangeSlider {
    constructor(element) {
        this.element = element;
        this.input = this.element.querySelector(INPUT_HOOK);
        this.lowLabel = this.element.querySelector(INPUT_LOW_HOOK);
        this.highLabel = this.element.querySelector(INPUT_HIGH_HOOK);

        this.init();
        this.bindEvents();
    }

    init() {
        const debounceChange = debounce(
            (valueLow, valueHigh, isHigh) => this.handleSliderUpdate(valueLow, valueHigh, isHigh),
            1000,
        );

        const config = {
            onChange: (valueLow, valueHigh, isHigh) => debounceChange(valueLow, valueHigh, isHigh),
            min: parseFloat(this.input.dataset.min) || 0,
            max: parseFloat(this.input.dataset.max) || 100,
            valueLow: parseFloat(this.input.dataset.from) || 0,
            valueHigh: parseFloat(this.input.dataset.to) || 100,
        };

        this.priceRange = new DoubleRangeInput(this.input, config);
    }

    /**
     * Binds all events
     */
    bindEvents() {
        const debounceChangeLow = debounce(
            () => this.handleChangeLowLabel(this.lowLabel.value),
            200,
        );
        const debounceChangeHigh = debounce(
            () => this.handleChangeHighLabel(this.highLabel.value),
            200,
        );
        this.lowLabel.addEventListener('change', () => debounceChangeLow());
        this.highLabel.addEventListener('change', () => debounceChangeHigh());
    }

    /**
     * Check boundaries of input value in High field
     * - Check if value is bigger than the max possible value OR smaller than the Low field input value
     *
     * @param {string} value | input field value
     */
    checkBoundariesHigh(value) {
        const amount = parseFloat(value) || this.priceRange.maxPossibleValue;
        if (amount < parseFloat(this.priceRange.valueLow)) {
            return this.priceRange.valueLow;
        }
        if (amount > parseFloat(this.priceRange.maxPossibleValue)) {
            return this.priceRange.maxPossibleValue;
        }
        return amount;
    }

    /**
     * Check boundaries of input value in Low field
     * - Check if value is smaller than the min. possible value OR bigger than the High field input value
     *
     * @param {string} value | input field value
     */
    checkBoundariesLow(value) {
        const amount = parseFloat(value) || this.priceRange.minPossibleValue;
        if (amount < parseFloat(this.priceRange.minPossibleValue)) {
            return this.priceRange.minPossibleValue;
        }
        if (amount > parseFloat(this.priceRange.valueHigh)) {
            return this.priceRange.valueHigh;
        }
        return amount;
    }

    /**
     * Handles slider update
     *
     * @param {string} valueLow | slider low value
     * @param {string} valueHigh | slider high value
     * @param {string} isHigh | slider isHigh value
     */
    handleSliderUpdate(valueLow, valueHigh, isHigh) {
        this.lowLabel.value = valueLow;
        this.highLabel.value = valueHigh;
    }

    /**
     * Handles keyup Event for Low Label Input
     *
     * @param {string} value | input field value
     */
    handleChangeLowLabel(value) {
        let amount = this.checkBoundariesLow(value);

        if (amount === parseInt(this.highLabel.value, 10)) amount--;

        this.lowLabel.value = amount;
        const ratio = this.priceRange.getRatioFromValue(amount);
        this.priceRange.onLowChangeByInput(ratio);
    }

    /**
     * Handles keyup Event for High Label Input
     *
     * @param {string} value | input field value
     */
    handleChangeHighLabel(value) {
        let amount = this.checkBoundariesHigh(value);

        if (amount === parseInt(this.lowLabel.value, 10)) amount++;

        this.highLabel.value = amount;
        const ratio = this.priceRange.getRatioFromValue(amount);
        this.priceRange.onHighChangeByInput(ratio);
    }
}

export default RangeSlider;
