
# Cookies component

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* GDPR proof cookie bar and cookie form
* Will set cookies based for all types of cookies.

## Install

Install npm package dependency
```node
npm i js-cookie@2.1.4 --save
```
Import module
```javascript
import Cookiebar from 'components/cookies';
```

## How to use

### Default cookie bar
Add cookie bar template to page

```htmlmixed
{% include "cookie-bar.html" %}
```

```javascript
    Cookiebar.init({
        //Optional config
    });
```

### Default cookie form
Add cookie form template to page

```htmlmixed
{% include "cookie-form.html" %}
```

{% from 'button.html' import button %}


## Dependencies
* [Form elements component](/components/form-elements/)
* [Events utility](/utilities/events/)
* [js-cookie](https://www.npmjs.com/package/js-cookie)

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
* [Jeroen Reumkens (co author)](mailto:jeroen.reumkens@tamtam.nl)

### 2.0.0
* Refactored component to meet GDPR requirements
### 1.0.0
* Initial version
