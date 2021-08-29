# GoogleMaps component

## Table of contents

1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do

- Create googlemaps including toggle for list view and region selector
- Creates a googlemaps single view

## Install

Import modules

```javascript
import '@/components/cookies'
moduleInit.async('[js-hook-googlemaps]', () => import('@/components/google-maps'))
```

## How to use ( MAPS VIEW ONLY )

The single maps view creates the locations + regions out of the json/javascript object or API call that is placed inside the map-settings.js

```javascript
export const DEFAULT_REGIONS = [
  {
    name: 'Name Region',
    id: 'region_1',
    locations: [
      {
        title: 'Name Location 1',
        id: 'googlemaps_location_1',
        position: {
          lat: 52.1258508,
          lng: 4.633826,
        },
      },
      {
        title: 'Name Location 2',
        id: 'googlemaps_location_2',
        position: {
          lat: 51.1236535,
          lng: 4.4525162,
        },
      },
    ],
  },
  {
    name: 'Name Region',
    id: 'region_2',
    locations: [
      {
        title: 'Name Location 3',
        id: 'googlemaps_location_3',
        position: {
          lat: 41.9796238,
          lng: -87.9696249,
        },
      },
      {
        title: 'Name Location 4',
        id: 'googlemaps_location_4',
        position: {
          lat: 25.710471,
          lng: -100.3109644,
        },
      },
    ],
  },
]
```

```htmlmixed
{% from 'google-maps.html' import googlemaps  %}

{{ googlemaps() }}
```

## How to use (MAPS + LIST VIEW )

The maps + listview creates the locations + regions out of the rendered html.

```htmlmixed
{% from 'google-maps.html' import googlemaps  %}

{{ googlemaps(
    [
        {
            "name": "Name Region",
            "id": "region_1",
            "locations": [
                {
                    "title":"Name Location 1",
                    "id": "googlemaps_location_1",
                    "position":{
                        "lat":52.1258508,
                        "lng":4.633826
                    }
                },
                {
                    "title":"Name Location 2",
                    "id": "googlemaps_location_2",
                    "position":{
                        "lat":51.1236535,
                        "lng":4.4525162
                    }
                }
            ]
        },
        {
            "name": "Name Region",
            "id": "region_2",
            "locations": [
                {
                    "title": "Name Location 3",
                    "id": "googlemaps_location_3",
                    "position":{
                    "lat":41.9796238,
                    "lng":-87.9696249
                    }
                },
                {
                    "title": "Name Location 4",
                    "id": "googlemaps_location_4",
                    "position":{
                        "lat":25.710471,
                        "lng":-100.3109644
                    }
                }
            ]
        }
    ]
) }}

```

## Dependencies

- [Events utility](/utilities/events/)
- [Raf Throttle](/utilities/raf-throttle/)
- [Form-elements](./form-elements/)
- [Cookies](./cookies/)

## Developers

- [Frank van der Hammen](mailto:frank.vanderhammen@deptagency.com)
- [Adrian Klingen](mailto:adrian@deptagency.com)
- [Dylan Vens](mailto:dylan.vens@deptagency.com)
