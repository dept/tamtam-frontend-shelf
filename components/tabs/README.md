
# Tabs component
## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do
* Creates a tab.

## Install
Import module
```javascript
import moduleInit from '@utilities/module-init';

import '@utilities/events';
moduleInit.async('[js-hook-tab]', () => import(/* webpackChunkName: "Tabs" */'@components/tabs'));
```

## How to use

### Default

```htmlmixed
{{ tabs({
    items: [
        {
            id : "id1",
            title : {
                "tab" : "Tab 1"
            },
            open: true
        },
        {
            id : "id2",
            title : {
                "tab" : "Tab 2"
            }
        }
    ]
}) }}

<div class="tabpanel tabpanel--is-active"
    id="id2"
    aria-hidden="false"
    role="tabpanel"
    aria-labelledby="id1-tab">

    Phasellus efficitur ipsum magna, vel malesuada erat venenatis ut. Donec vel sollicitudin dui, et convallis lorem. Integer pulvinar, est eget tincidunt dictum, augue tortor fermentum nibh, pharetra mollis mi sem eget erat. Vivamus id ullamcorper quam.
    
</div>

<div class="tabpanel"
    id="id2"
    aria-hidden="true"
    role="tabpanel"
    aria-labelledby="id2-tab">

    Phasellus efficitur ipsum magna, vel malesuada erat venenatis ut. Donec vel sollicitudin dui, et convallis lorem. Integer pulvinar, est eget tincidunt dictum, augue tortor fermentum nibh, pharetra mollis mi sem eget erat. Vivamus id ullamcorper quam.
    
</div>

```

## Dependencies
* [Events utility](/utilities/events/)

## Developers
* [Robin Treur](mailto:robin.treur@deptagency.com)
