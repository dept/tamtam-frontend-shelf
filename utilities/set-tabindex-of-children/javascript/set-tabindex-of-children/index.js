export default function setTabIndexOfChildren(element, value) {
    [...element.querySelectorAll('a, area, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, video')].forEach(element => element.tabIndex = value);
}
