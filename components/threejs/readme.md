Heavily inspired by https://github.com/paulmg/ThreeJS-Webpack-ES6-Boilerplate

# ThreeJs

## Table of contents
1. [What does it do](#what-does-it-do)
2. [Install](#install)
3. [How to use](#how-to-use)
4. [Dependencies](#dependencies)
5. [Developers](#developers)

## What does it do
* A base component for building WebGl scenes on a canvas element, with the help of Three.js. 
* Currently has an example setup with a model, meshes, camera, several light sources, controls and a simple animation.
* Should be used as boilerplate only

## Install
Import module
```javascript
import moduleInit from '@utilities/module-init';

moduleInit.async('[js-hook-threejs]', () => import(/* webpackChunkName: "ThreeJs" */'@components/threejs'));
```

#### Config overrides
Because the example uses models and textures that are called from the assets folder, the default config should be overridden with the possibility to copy these files to the build folder.

Look for the following files in the `build-config` folder.

Add the following object to your override-config.js:
```javascript
const overrideConfig = {
    dest: {
        models: { path: '<%= assets %>/models' },
        textures: { path: '<%= assets %>/textures' },
    }
};
```

<br>

Add the following object to your override-copy.js:
```javascript
const overrideCopy = [
    { source: config.source.getPath('assets', 'textures/**'), dest: config.dest.getPath('textures') },
    { source: config.source.getPath('assets', 'models/**'), dest: config.dest.getPath('models') },
];
```

## How to use
Call the macro.
```htmlmixed
{% from 'threejs.html' import threeJs %}

{{ threeJs({
    useCanvasElement: true
}) }}
```
Currently the macro has the option to prerender a canvas element in the DOM by setting `useCanvasElement` to `true`. Otherwise a canvas element will be appended to the container through JS.

## Dependencies
* [Raf utility](/utilities/raf/)

## Developers
* [Matt van Voorst](mailto:matt.vanvoorst@deptagency.com)
