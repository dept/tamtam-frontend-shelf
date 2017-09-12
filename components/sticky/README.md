
# Sticky component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Implements Nunjucks macros to easily create sticky content
* Throttled scroll event to updated the fixed position of a sticky component
* Additional option to constrain sticky component to the height of its parent element

---------------------------------------------
|                                           |
| ----------------------------------------- |
| |                                        ||
| |                                        ||   ▲
| |                                        ||   |
| |                                        ||   |
| |          Sticky scrolling box          ||   |
| |   ( [js-hook-sticky-scroll-element] )  ||   |
| |                                        ||   |
| |                                        ||   |
| |                                        ||   |
| |                                        ||   |
| |                                        ||   |
| |                                        ||   ▼
| |                                        ||
| ----------------------------------------- |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|          Sticky lane constraints          |
|           ( [js-hook-sticky] )            |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
|                                           |
---------------------------------------------

## Install
```javascript
import './src/modules/util/in-view';
import './src/modules/sticky';
```

## How to use

### Default

Create sticky component in HTML.
```htmlmixed
{% from 'components/sticky.html' import sticky  %}

{% call sticky({
    id: 'my-awesome-sticky-component',
    class: 'c-wrapped-around-another-component',
    threshold: 120
}) %}

    Your content here.

{% endcall %}

```

## Dependencies
* [In-view libary](/utilities/in-view/)
* [Events libary](/utilities/events/)

## Developers
* [Kees van Lierop](mailto:kees@tamtam.nl)
