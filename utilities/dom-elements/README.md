
# DOM Elements

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Caches the most common DOM elements as jQUery objects such as; document, window, body, etc. This way you only need to bind them once.

## Install
Install npm package dependency
```node
npm install jquery@3.2.1 --save
```

## How to use
### Import cached DOM elements in Javascript.
```javascript

// Load all DOM elements.
import * from './src/modules/util/dom-elements';

// Load only the window element
import { $window } from './src/modules/util/dom-elements';

```

## Dependencies
```
jquery
```

## Developers
* [Jeroen Reumkens](mailto:jeroen.reumkens@tamtam.nl)
* [Adrian Klingen (co author)](mailto:adrian@tamtam.nl)
