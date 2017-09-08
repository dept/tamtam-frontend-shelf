
# Breadcrumb

## Table of contents
1. [What does it do](#what-does-it-do)
2. [Install](#install)
3. [How to use](#how-to-use)
4. [Dependencies](#dependencies)
5. [Developers](#developers)


## What does it do
* Render breadcrumb
* Meets structured data standard

## Install
```htmlmixed
{% from 'components/breadcrumb.html' import breadcrumb %}
```

## How to use
Call the macro with an array of breadcrumb objects.
```htmlmixed
{{ breadcrumb([
    {
        url: '/home.html',
        label: 'Home'
    },
    {
        url: '/category-1.html',
        label: 'Category 1'
    },
    {
        url: '/category-2.html',
        label: 'Category 2'
    },
    {
        url: '/current-item.html',
        label: 'Current item'
    }
]) }}
```

## Dependencies
This package doesn't have any dependencies.

## Developers
* [Adrian Klingen](mailto:adrian@tamtam.nl)
