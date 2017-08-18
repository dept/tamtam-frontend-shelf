/**
 * @shelf-version: 1.0.0
 */
import $ from 'jquery';

const $window     = $( window );
const $document   = $( document );
const $html       = $( 'html' );
const $body       = $( 'body' );
const $htmlBody   = $( 'html, body');
const $eventEl    = $html; // Variable that points to the element that emits and receives all events.

export {
    $window,
    $document,
    $html,
    $body,
    $htmlBody,
    $eventEl
}
