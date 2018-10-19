# Tooltip component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Developers](#markdown-header-developers)

## What does it do
* Creates a tooltip.
* If the tooltip is out of the screen, the position wil change automatically.

## Install
Import module
```javascript
moduleInit.async('[js-hook-tooltip]', () => import('@components/tooltip'));
```

## How to use

### Default

```htmlmixed
{{ tooltip({
    label: 'Read here more',
    element: 'h1',
    id: 'id-name',
    tip : {
        position: 'top-left',
        classes: 'extra--class',
        content: 'More about the text'
    }
}) }}
```

### Tooltip on part of text
See the [tooltip](/components/tooltip/template/tooltip.html) macro for all available options.
```htmlmixed
You can read
{{ tooltip({
    label: 'here more',
    id: 'id-name',
    tip : {
        position: 'left-center',
        element: 'p',
        content: 'More about the text'
    }
}) }}
```

### Tooltip on one line

```htmlmixed
{{ tooltip({
    label: 'Read here more',
    id: 'id-name',
    tip : {
        position: 'right-top',
        noWrap: true,
        pointerEvents: true,
        content: 'More about the text'
    }
}) }}
```

### Different positions
You can choose different tooltip positions.
Top           | Bottom           | Left             | Right
------------- | ---------------- | ---------------- | ----------------
`top-left`    | `bottom-left`    | `left-top`       | `right-top`
`top-right`   | `bottom-right`   | `left-bottom`    | `right-bottom`
`top-center`  | `bottom-center`  | `left-center`    | `right-center`

## Developers
* [Robin Treur](mailto:robin.treur@deptagency.com)
* [Adrian Klingen](mailto:adrian.klingen@deptagency.com)
