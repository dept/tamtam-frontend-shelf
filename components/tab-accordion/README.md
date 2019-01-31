
# TabAccordion component
## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do
* Creates an accordion on mobile and a tab on desktop.
* You can change the breakpoint in _components.tab-accordion.scss

## Install
Import module
```javascript
import moduleInit from '@utilities/module-init';

import '@utilities/events';
moduleInit.async('[js-hook-tab]', () => import(/* webpackChunkName: "Tabs" */'@components/tabs'));
moduleInit.async('[js-hook-accordion]', () => import(/* webpackChunkName: "Accordion" */'@components/accordion'));
```

## How to use

### Default

```htmlmixed
{% from 'tab-accordion.html' import tabAccordion %}

{{ tabAccordion({
    accordion: {
        autoclose: false
    },
    items: [
        {
            id : "id1",
            title : {
                "tab" : "Tab 1",
                "open" : "Open 1",
                "close" : "Close 1"
            },
            open: true,
            content: "Phasellus efficitur ipsum magna, vel malesuada erat venenatis ut. Donec vel sollicitudin dui, et convallis lorem. Integer pulvinar, est eget tincidunt dictum, augue tortor fermentum nibh, pharetra mollis mi sem eget erat. Vivamus id ullamcorper quam."
        },
        {
            id : "id2",
            title : {
                "tab" : "Tab 2",
                "open" : "Open 2",
                "close" : "Close 2"
            },
            content: "Integer at ante id dolor tempor auctor. Integer scelerisque, enim et lacinia molestie, lectus metus tincidunt mauris, ut interdum orci dui eu risus. Nunc urna tortor, mattis in mollis eget, luctus sed massa. Quisque lectus purus, vestibulum sit amet elementum a, molestie a augue. "
        }
    ]
}) }}

```

## Dependencies
* [Events utility](/utilities/events/)

## Developers
* [Robin Treur](mailto:robin.treur@deptagency.com)
