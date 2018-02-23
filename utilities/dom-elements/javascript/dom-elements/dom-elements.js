import $ from 'jquery';

const $window   = $(window);
const $document = $(document);
const $html     = $('html');
const $body     = $('body');
const $htmlBody = $('html, body');

// Variable that points to the element that emits and receives all events.
const $eventEl  = $html;

export {
    $window,
    $document,
    $html,
    $body,
    $htmlBody,
    $eventEl
};
