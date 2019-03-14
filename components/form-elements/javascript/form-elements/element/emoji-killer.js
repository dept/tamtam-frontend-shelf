/**
 * Kill pesky emoji's in your input fields. Pass a single element or an array of elements.
 * Binds events that will strip your input of Emoji's.
 * Instantiate by calling EmojiKiller() and pass a single element or an array of elements to it.
 * @param element {*} - array of DOM elements / single DOM Element
 * @constructor
 */
const EmojiKiller = element => {
    const emojiRange = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

    if (Array.isArray(element)) {
        element.forEach(input => {
            input.addEventListener('change', () => preventEmoji(input));
            input.addEventListener('input', () => preventEmoji(input));
        });
    } else {
        element.addEventListener('change', () => preventEmoji(element));
        element.addEventListener('input', () => preventEmoji(element));
    }

    function preventEmoji(domElement) {
        domElement.value = domElement.value.replace(emojiRange, '');
    }
};

export default EmojiKiller;
