# Sticky component

## Table of contents

1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do

- Implements Nunjucks macros to easily create sticky content
- Throttled scroll event to updated the fixed position of a sticky component
- Additional option to constrain sticky component to the height of its parent element

```
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
```

## Install

```javascript
import moduleInit from '@utilities/module-init'
import '@utilities/in-view'

moduleInit.async('[js-hook-sticky]', () => import('@components/sticky'))
```

## How to use

### Default

Create sticky component in HTML.

```htmlmixed
{% from 'sticky.html' import sticky  %}

{% call sticky({
    id: 'my-awesome-sticky-component',
    class: 'c-wrapped-around-another-component',
    threshold: 120
}) %}

    Your content here.

{% endcall %}

```

### Recalc event

When using dynamic content you can call a `sticky[id]::recalc` event to update the container.

```javascript
Events.$trigger('sticky[id]::recalc')
```

## Dependencies

- [In-view libary](/utilities/in-view/)
- [Events libary](/utilities/events/)

## Developers

- [Kees van Lierop](mailto:kees@tamtam.nl)
