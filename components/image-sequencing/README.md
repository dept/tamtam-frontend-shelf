# Image component

## Table of contents

1. [What does it do](#markdown-header-what-does-it-do)
2. [Install and preparations](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do

- Animates an image sequence based on scroll position
- Allows for setting a fallback image
- Fully customizable via data attributes

## Install

Import module

```javascript
moduleInit.async('[js-hook-image-sequencing]', () => import('@/components/image-sequencing'))
```

## Preparations

Your image filenames should include a <strong>4-digit sequence number</strong> padded with leading zeros, as in `0001.jpg`. This format is permitted and will allow for proper image retrieval.

## How to use

The image sequencing component uses data attributes to configure its behavior. Below are the available properties:

| Property           | Required | Type   |
| ------------------ | -------- | ------ |
| `imageBaseURL`     | ✔️       | string |
| `imageExtension`   | ✔️       | string |
| `imageFallback`    | ❌       | string |
| `frameCount`       | ✔️       | number |
| `scrollAmountInPx` | ❌       | number |
| `canvasWidth`      | ✔️       | number |
| `canvasHeight`     | ✔️       | number |

### Example usage

```htmlmixed
{% from 'image-sequencing.html' import imageSequencing %}

{{ imageSequencing({
  image: {
    baseURL: 'https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/',
    extension: 'jpg',
    fallback: '/assets/images/placeholder.400x250.jpg'
  },
  canvas: {
    width: '1158',
    height: '770'
  },
  frameCount: '147',
  scrollAmountInPx: '5000'
}) }}
```

## Dependencies

- gsap
- Environment utility

## Developers

- [Menno de Vries](mailto:menno.devries@deptagency.com)
