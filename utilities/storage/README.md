# Storage utility

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Storage handling with localStorage / sessionStorage with cookie fallback.
* localStorage / sessionStorage supported check.

## Install
```javascript
import { Storage } from './src/modules/util/storage';

```

## How to use
### Configure storage class
```javascript

const storage = new Storage();

// Set storage type
storage.setStorageType('localStorage');

// Set an optional prefix to your storage objects
storage.setPrefix('projectX');


```

### Set data

You can set any kind of data
```javascript
storage.set('data', { foo : "bar" });
```

### Get data

```javascript
storage.get('data');
```

## Dependencies
This package doest not have any dependencies.

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)