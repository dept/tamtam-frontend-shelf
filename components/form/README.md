# Form Utility

## Table of contents

1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do

A generic form class which can also be extended by a specific form component: 
```Class ExampleForm extends Form {}```

It allows you to:

- do validation out of the box for each form; on submit and on change
- to submit the form to the provided actoion with Axios
- init default validation and validation translations

## Install

Import module

```javascript
import Form from '@/components/form';
```

```javascript
moduleInit.async('[js-hook-form]', () =>
  import('@/components/form')
);

// or extend the form as: Class ExampleForm extends Form {} and init as a seperate module
moduleInit.async(
  '[js-hook-example-form]',
  () => import('@/components/form/javascript/example-form'),
)
```

## How to use

### HTML template

Create a form element.

### Form
Ad a form component. The hook `js-hook-form` will be automagically attached.
Add novalidate to disable the default browser validation behaviour.


See the [form](/components/form-elements/template/form-elements/form.html) macro for all available options.
```htmlmixed
{% import 'form-elements.html' as form %}

{% call form.form({ 
   class: 'c-example-form', 
   method: 'POST', 
   action: '/url-to-post-the-form-to', 
   attr: 'novalidate'
  }) %}
    
    HTML HERE

{% endcall %}
```

### Input
Use the new validate property to add validation rules as defined in [utilities/validation](/utilities/validation) 

See the [input](/components/form-elements/template/form-elements/input.html) macro for all available options.
```htmlmixed
{{ form.input({
    name: 'input-text',
    id: 'input-text',
    label: 'Input',
    placeholder: 'Input',
    validate: 'required,email'
}) }}
```

### Submit button
Use the button macro inside the form to add a submit button

```htmlmixed
{% from 'button.html' import button %}

{{ button({
  element: 'button',
  label: 'Submit form',
  type: "submit"
}) }}
```

## Dependencies
* [Alert component](/components/alert/)
* [API utility](/utilities/api/)
* [Events utility](/utilities/events/)
* [serializeObject utility](/utilities/serialize-object)
* [Validation utility](/utilities/validation)

## Developers
* [Daphne Smit](mailto:daphne.smit@deptagency.com)

