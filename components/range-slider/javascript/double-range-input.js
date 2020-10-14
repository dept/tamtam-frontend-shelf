import RangeInput from './range-input';

const PRICE_RANGE_MIN_HOOK = '[js-hook-price-range-min]';
const PRICE_RANGE_MAX_HOOK = '[js-hook-price-range-max]';
const PRICE_RANGE_HOOK = '[js-hook-range-slider-range]';

class DoubleRangeInput {
    constructor(element, options) {
        this.element = element;
        this.options = options || {};
        this.minPossibleValue = this.options.min || 0;
        this.maxPossibleValue = this.options.max || 100;
        this.possibleRange = this.maxPossibleValue - this.minPossibleValue;
        this.valueLow = this.options.valueLow || this.minPossibleValue;
        this.valueHigh = this.options.valueHigh || this.maxPossibleValue;
        this.initialLowRatio = (this.valueLow - this.minPossibleValue) / this.possibleRange;
        this.initialHighRatio = (this.valueHigh - this.minPossibleValue) / this.possibleRange;
        this.step = this.options.step || 1;
        this.rangeNode = this.element.querySelector(PRICE_RANGE_HOOK);

        this.lowRangeInput = new RangeInput(this.element.querySelector(PRICE_RANGE_MIN_HOOK), {
            onChange: ratio => this.onLowChange(ratio),
            initialRatio: this.initialLowRatio,
        });

        this.highRangeInput = new RangeInput(this.element.querySelector(PRICE_RANGE_MAX_HOOK), {
            onChange: ratio => this.onHighChange(ratio),
            initialRatio: this.initialHighRatio,
        });

        this.init();
    }

    init() {
        this.onLowChange(this.initialLowRatio, true);
        this.onHighChange(this.initialHighRatio, true);
    }

    getValueFromRatio(ratio) {
        return parseInt(
            (
                Math.round((this.minPossibleValue + ratio * this.possibleRange) / this.step) *
                this.step
            ).toFixed(0),
            10,
        );
    }

    getRatioFromValue(value) {
        return ((value / this.step) * this.step - this.minPossibleValue) / this.possibleRange;
    }

    onLowChangeByInput(ratio) {
        this.highRangeInput.setMin(ratio);
        this.valueLow = this.getValueFromRatio(ratio);
        this.rangeNode.style.left = `${100 * ratio}%`;
        this.lowRangeInput.thumb.style.left = `${ratio * 100}%`;
    }

    onHighChangeByInput(ratio) {
        this.lowRangeInput.setMax(ratio);
        this.valueHigh = this.getValueFromRatio(ratio);
        this.rangeNode.style.right = `${100 * (1 - ratio)}%`;
        this.highRangeInput.thumb.style.left = `${ratio * 100}%`;
    }

    onLowChange(ratio, noOnChange) {
        let minRatio = ratio;
        if (minRatio < 0) minRatio = 0;

        this.highRangeInput.setMin(minRatio);
        this.valueLow = this.getValueFromRatio(minRatio);

        if (this.valueLow >= this.valueHigh) this.valueLow--;

        this.rangeNode.style.left = `${100 * minRatio}%`;

        if (this.options.onChange && !noOnChange) {
            this.options.onChange(this.valueLow, this.valueHigh, false);
        }
    }

    onHighChange(ratio, noOnChange) {
        let maxRatio = ratio;
        if (maxRatio > 1) maxRatio = 1;

        this.lowRangeInput.setMax(maxRatio);
        this.valueHigh = this.getValueFromRatio(maxRatio);

        if (this.valueHigh <= this.valueLow) this.valueHigh++;

        this.rangeNode.style.right = `${100 * (1 - maxRatio)}%`;

        if (this.options.onChange && !noOnChange) {
            this.options.onChange(this.valueLow, this.valueHigh, true);
        }
    }

    destroy() {
        // Ensure elements are not referenced so that they and any listeners are Garbage Collected
        this.lowRangeInput.destroy();
        this.highRangeInput.destroy();
        this.element = null;
        this.options = null;
    }
}

export default DoubleRangeInput;
