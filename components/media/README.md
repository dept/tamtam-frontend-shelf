
# Media

## Table of contents
1. [What does it do](#what-does-it-do)
2. [Install](#install)
3. [How to use](#how-to-use)
4. [Dependencies](#dependencies)
5. [Developers](#developers)

![Media Demo](./_demo/media.png)

## What does it do
* Image component with HTML content next to it.
* Can be nested inside itself.
* Uses image component to render (lazy loaded) image.

## Install
```htmlmixed
{% from 'components/media.html' import media %}
```

## How to use

```htmlmixed
 {% call media({
    url:        'string', (optional)
    classes:    'string', (optional)
    title:      'string',
    align:      'top' (optional) - aligns content to the top
    image: {
        image:   'string', (desktop fallback image)
        preload: 'string', (10xratio preload image)
        srcset:  'string'  (image srcset)
    },
}) %}
    <p>HMTL content can be injected via caller.</p>
{% endcall %}
```

## Dependencies
* [Image component](/components/media/README.md)

## Developers
* [Jeroen Reumkens](mailto:jeroen.reumkens@tamtam.nl)
