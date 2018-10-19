
# Form elements

## Table of contents
1. [What does it do](#what-does-it-do)
2. [Install](#install)
3. [How to use](#how-to-use)
4. [Dependencies](#dependencies)
5. [Developers](#developers)


## What does it do
* Render form elements

## Install
This is currently only needed if you use file input fields or autocomplete.

### File input
Import module for file input
```javascript
import { CustomFile } from '@components/form-elements';

moduleInit.sync('[js-hook-input-file]', CustomFile);
```

### Label as placeholder
Import module for label as placeholder
```javascript
import { LabelAsPlaceholder } from '@components/form-elements';

moduleInit.sync('[js-hook-lap]', LabelAsPlaceholder);
```

### Autocomplete
Import module for autocomplete
```javascript
import { Autocomplete } from '@components/form-elements';

moduleInit.sync('[js-hook-autocomplete]', Autocomplete);
```

```htmlmixed
{% import 'form-elements.html' as form %}
```

## How to use
There are multiple macros available

### Form
See the [form](/components/form-elements/template/form-elements/form.html) macro for all available options.
```htmlmixed
{% call form.form() %}
    
    HTML HERE

{% endcall %}
```

### Fieldset
See the [fieldset](/components/form-elements/template/form-elements/fieldset.html) macro for all available options.
```htmlmixed
{% call form.fieldset({
    legend: 'Test form data'
}) %}

    HTML HERE

{% endcall %}
```

### Input
See the [input](/components/form-elements/template/form-elements/input.html) macro for all available options.
```htmlmixed
{{ form.input({
    name: 'input-text',
    id: 'input-text',
    label: 'Input',
    placeholder: 'Input'
}) }}
```

### Input - file upload
See the [file](/components/form-elements/template/form-elements/file.html) macro for all available options.
```htmlmixed
{{ form.file({
    name: 'input-file',
    id: 'input-file',
    label: 'Input - file',
    multiple: 'files selected'
}) }}
```

### Radio
See the [radio](/components/form-elements/template/form-elements/radio.html) macro for all available options.
```htmlmixed
{{ form.radio({
    name: 'radio-1',
    options: [
        {
            label: 'One',
            value: 'one-1',
            id: 'radio-1-1'
        },
        {
            label: 'Two',
            value: 'two-1',
            id: 'radio-1-2'
        },
        {
            label: 'Three',
            value: 'three-1',
            id: 'radio-1-2'
        }
    ]
}) }}
```

### Checkbox
See the [checkbox](/components/form-elements/template/form-elements/checkbox.html) macro for all available options.
```htmlmixed
{{ form.checkbox({
    name: 'checkbox 1',
    options: [
        {
            label: 'One',
            value: 'one-2',
            id: 'checkbox-1-1'
        },
        {
            label: 'Two',
            value: 'two-2',
            id: 'checkbox-1-2'
        },
        {
            label: 'Three',
            value: 'three-2',
            id: 'checkbox-1-3'
        }
    ]
}) }}
```

### Select
See the [select](/components/form-elements/template/form-elements/select.html) macro for all available options.
```htmlmixed
{{ form.select({
    name: 'Select',
    id: 'select-1',
    label: 'Select One',
    options: [
        {
            label: 'Please choose an option',
            default: true
        },
        {
            label: 'One',
            value: 'one'
        },
        {
            label: 'Two',
            value: 'two'
        },
        {
            label: 'Three',
            value: 'three'
        }
    ]
}) }}
```

### Textarea
See the [input](/components/form-elements/template/form-elements/textarea.html) macro for all available options.
```htmlmixed
{{ form.textarea({
    name: 'textarea-text',
    id: 'textarea-text',
    label: 'Textarea',
    placeholder: 'Textarea'
}) }}
```


### Label as placeholder
Works on input, file and textarea

```htmlmixed
{{ form.input({
    labelAsPlaceholder: true,
    name: 'input-text',
    id: 'input-text',
    label: 'Input'
}) }}
```


### Autocomplete
See the [autocomplete](/components/form-elements/template/form-elements/autocomplete.html) macro for all available options.

HTML:
```htmlmixed
{{ form.autocomplete({
    name: 'query',
    label: 'Autocomplete',
    hook: 'form-autocomplete',
    attr: 'data-api="https://jsonplaceholder.typicode.com/users" autocomplete="off"',
    placeholder: 'Autocomplete'
}) }}
```

API:
```json
[
  { "id":"1", "name":"Dylan Vens" },
  { "id":"2", "name":"Anne van den Hoogen" }
]
```

## Dependencies

Autocomplete uses 
* [RAF](https://www.npmjs.com/package/raf)
* [Raf throttle utility](/utilities/raf-throttle/)
* [Events utility](/utilities/events/)
* [API utility](/utilities/api/)

## Developers
* [Adrian Klingen](mailto:adrian.klingen@deptagency.com)
* [Arnout Jansen (co-author)](mailto:arnout.jansen@tamtam.nl)
