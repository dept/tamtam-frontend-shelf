
# Breadcrumb

## Table of contents
1. [What does it do](#what-does-it-do)
2. [Install](#install)
3. [How to use](#how-to-use)
4. [Dependencies](#dependencies)
5. [Developers](#developers)


## What does it do
* Render form elements
* Meets structured data standard

## Install
```htmlmixed
{% from 'components/form-elements.html' import radioButton %}
```

## How to use
Call the macros of individual form elements
```htmlmixed
{{ radioButton( {
    label: 'Label',
    id: 'radio1',
    name: 'name',
    value: 'value',
    checked: 'false'
}) }}
```

## Dependencies
This package doesn't have any dependencies.

## Developers
* [Arnout Jansen](mailto:arnout.jansen@tamtam.nl)
