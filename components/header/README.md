
# Header Component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do
* The header components is a element container for navigation, search, toolbars etc..
* The default state of the header is that it moves away when scrolling.
* Side node :)! The gifs are a total of 100mb (Did not know a better way to show the header effects).
* TODO: remove gifs or make a demo page 

## Install

Install npm package dependency
```node
npm i raf-throttle --save
```

Import module

```javascript
import moduleInit from './src/modules/util/module-init';
import Header from './src/modules/header';
moduleInit('[js-hook-header]', Header);
```

## How to use

### Default
Add header template to page

```htmlmixed
{% from 'components/header.html' import header %}
```

#### Default state 
The default state of the header is a simple header that acts like all the other headers.

```htmlmixed
{% call header() %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component">Some other example component</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```
##### Default example:
![Default demo](./_demo/default-header.gif)

#### Fixed state 
The fixed property transform the header into a fixed header

```htmlmixed
{% call header({ fixed: true }) %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component">Some other example component</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```
##### Fixed example:
![Fixed Demo](./_demo/fixed-header.gif)

#### Reveals state 
The reveals property lets the header reveal it self when scrolling back up.

```htmlmixed
{% call header({ reveals: true }) %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component">Some other example component</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```
##### Reveals example:
![Reveals Demo](./_demo/header-reveals.gif)

#### Condenses(sticky) state 
The condenses property is used on taller headers (headers that normally have multiple bars/tabs). 
It lets the header vertically shrink when scrolling down. By default the first direct child element will be the sticky one. 

```htmlmixed
{% call header({ condenses: true }) %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component">Some other example component</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```

##### Condenses example:
![Condenses Demo](./_demo/header-condenses.gif)

You can also customize the sticky element by added a attribute to the child that has to be sticky

```htmlmixed
{% call header({ condenses: true }) %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component" sticky>Some other example component (is now the sticky one)</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```

##### Condenses sticky customized example:
![Condenses sticky Demo](./_demo/header-condenses-customized.gif)

#### Condenses reveals state
The condenses and reveals properties lets the header reveal the first element by default when scrolling back up.
This again can also be customized by applying the sticky attribute to the element that you can to reveal when scrolling back up (default is the first direct child).

```htmlmixed
{% call header({ condenses: true, reveals: true }) %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component" sticky>Some other example component (is now the sticky one and being revealed when scrolling up)</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```

##### Condenses reveals customized example:
![Condenses reveal Demo](./_demo/header-condenses-reveal.gif)

#### Condenses fixed state
The condenses and fixed properties lets the first direct element be fixed (by default) when scrolling down
This again can be customized by setting the sticky attribute on an direct child of the header

```htmlmixed
{% call header({ condenses: true, fixed: true }) %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component" sticky>Some other example component (is now the fixed one)</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```

##### Condenses fixed customized example:
![Condenses fixed Demo](./_demo/header-fixed-condenses.gif)

#### Fixed reveals condenses state
The fixed, reveals and condenses lets the header be fixed and reveals the whole header when scrolling back up

```htmlmixed
{% call header({ condenses: true, fixed: true, reveals: true }) %}
    <div class="c-navigation">This is an example navigtion</div>
    <div class="c-some-other-component">Some other example component</div>
    <div class="c-sub-nav">This is an example sub nav</div>
{% endcall %}
```

##### Fixed reveals condenses example:
![Fixed reveals condenses Demo](./_demo/header-fixed-reveals-condenses.gif)

## Dependencies
* [Raf Throttle utility](/utilities/raf-throttle)

## Developers
* [Dylan Vens](mailto:dylan.vens@tamtam.nl)
