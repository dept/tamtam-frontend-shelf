/*
    Contains:

    const MAP_STYLE ( CREATE AT https://mapstyle.withgoogle.com/ )

    export const MAP_API_KEY ( REGISTER AT https://developers.google.com/maps/documentation/javascript/get-api-key)
    export const MAP_MARKER ( PATH TO MARKER IMAGE )
    export const MAP_SETTINGS ( PATH TO ACTIVE MARKER IMAGE )
*/

const MAP_STYLE = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

export const MAP_API_KEY = '1234567890qwertyuiop';

export const MAP_MARKER =
  'https://emojipedia-us.s3.amazonaws.com/thumbs/72/emojipedia/132/flag-for-hawaii-ushi_1f3f4-e0075-e0073-e0068-e0069-e007f.png';

export const MAP_MARKER_ACTIVE =
  'https://emojipedia-us.s3.amazonaws.com/thumbs/72/emojipedia/132/flag-for-bong-lrbg_1f3f4-e006c-e0072-e0062-e0067-e007f.png';

export const MAP_MAX_ZOOM = 10;

export const MAP_SETTINGS = {
  center: {
    lat: 29.14,
    lng: 28.43,
  },
  zoom: 2,
  disableDefaultUI: false,
  zoomControl: true,
  scaleControl: false,
  styles: MAP_STYLE || null,
};

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
];
