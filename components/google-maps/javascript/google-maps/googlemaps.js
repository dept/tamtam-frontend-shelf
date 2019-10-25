import Events from '@utilities/events';
import RafThrottle from '@utilities/raf-throttle';
import Cookies from '@components/cookies';

import {
  MAP_SETTINGS,
  MAP_MARKER,
  MAP_MARKER_ACTIVE,
  MAP_MAX_ZOOM,
  MAP_API_KEY,
  DEFAULT_REGIONS,
} from './map-settings.js';

// HOOKS
const HOOK_MAPS_CONTAINER = '[js-hook-googlemaps-container]';
const HOOK_REGION_SELECT = '[js-hook-region-select]';
const HOOK_LOCATION_LIST = '[js-hook-location-list]';
const HOOK_VIEW_BUTTONS = '[js-hook-googlemaps-view-button]';
const HOOK_REGION = '[js-hook-region]';
const HOOK_LOCATION = '[js-hook-location]';

//CLASSES
const CLASS_API_LOADED = 'googlempas--has-loaded-api';
const CLASS_LIST_VIEW = 'googlemaps--is-list-view';
const CLASS_LOCATION_VISIBLE = 'location--is-visible';
const CLASS_REGION_ACTIVE = 'region--is-active';
const CLASS_BUTTON_ACTIVE = 'togglebutton--is-active';
const GOOGLEMAPS_COOKIE_INVALID_CLASS = 'googlemaps--has-invalid-cookie';

// DATA
const DATA_LAT = 'data-lat';
const DATA_LNG = 'data-lng';
const DATA_ICON = 'data-icon';

const URL_PREFIX = '//maps.googleapis.com/maps/api/js';

class GoogleMaps {
  constructor(element) {
    this.map = null;
    this.currentBounds = [];
    this.markers = [];

    this.el = element;
    this.mapContainer = this.el.querySelector(HOOK_MAPS_CONTAINER);

    this.regionSelect = this.el.querySelector(HOOK_REGION_SELECT);
    this.viewButtons = [...this.el.querySelectorAll(HOOK_VIEW_BUTTONS)];
    this.isMapsLoaded = !!document.querySelector(`script[src*="${URL_PREFIX}"]`);
    this.hasListView = false;

    if (!Cookies.cookieIsValid('advertising')) {
      return this.el.classList.add(GOOGLEMAPS_COOKIE_INVALID_CLASS);
    }

    this.bindRegionLocations();
    this.loadGoogleAPI();
    this.bindEvents();
  }

  bindRegionLocations() {
    if (document.querySelector(HOOK_REGION)) {
      this.regions = [...this.el.querySelectorAll(HOOK_REGION)];
      this.locations = [...this.el.querySelectorAll(HOOK_LOCATION)];
      this.hasListView = true;
    } else {
      this.regions = [];
      this.locations = [];
      this.createRegionsLocationsArray();
      this.createLocationsList();
    }
  }

  createLocationsList() {
    // Create simple info list from JSON Data
    const list = this.el.querySelector(HOOK_LOCATION_LIST);
    const items = this.locations
      .map(location => {
        return `
                <li class="region__location-list-item" id="${location.id}" data-lat="${location.position.lat}" data-lng="${location.position.lng}" js-hook-location>
                    ${location.title}
                </li>
            `;
      })
      .join('');

    list.innerHTML = items;
    this.createdLocations = [...document.querySelectorAll(HOOK_LOCATION)];
  }

  createRegionsLocationsArray() {
    const regions = DEFAULT_REGIONS;

    regions.forEach(region => {
      this.regions.push({ name: region.name, id: region.id });

      if (region.locations) {
        this.locations = [...this.locations, ...region.locations];
      }
    });
  }

  bindEvents() {
    window.initMap = () => this.initMap(this.mapContainer);

    RafThrottle.set([
      {
        element: window,
        event: 'resize',
        namespace: 'MapResize',
        delay: 300,
        fn: () => this.resetMap(),
      },
    ]);

    Events.$on('googlemaps::handleMarkerClick', e => this.handleMarkerClick(e));

    Events.$on('googlemaps::handleMapClick', () => this.resetActiveMarkersAndLocations());

    Events.$on('googlemaps::toggleview', () => this.toggleview());

    Events.$on('googlemaps::changeregion', e => this.changeRegion(e));
  }

  loadGoogleAPI() {
    if (!this.isMapsLoaded) {
      const script = document.createElement('script');
      script.src = `${URL_PREFIX}?key=${MAP_API_KEY}&callback=initMap`;
      script.async = true;
      document.body.appendChild(script);
    }
  }

  initMap(el) {
    this.el.classList.add(CLASS_API_LOADED);

    this.map = new google.maps.Map(el, MAP_SETTINGS);

    this.createFilter();

    this.activateRegion('all');

    this.addMarkers(this.locations);

    this.map.addListener('click', function() {
      Events.$trigger('googlemaps::handleMapClick');
    });
  }

  resetMap() {
    this.activateRegion('all');
    this.addMarkers(this.locations);
  }

  createFilter() {
    const option = document.createElement('option');
    option.text = 'All';
    option.value = '-1';
    this.regionSelect.appendChild(option);

    this.regions.forEach(region => {
      const option = document.createElement('option');
      option.text = region.name ? region.name : region.getAttribute('data-name');
      option.value = region.id ? region.id : region.getAttribute('id');
      this.regionSelect.appendChild(option);
    });
  }

  addMarkers(locations) {
    this.removeAllMarkers();

    locations.forEach(location => {
      const id = location.id ? location.id : location.getAttribute('id');
      const icon = location.position ? MAP_MARKER : location.getAttribute(DATA_ICON) || MAP_MARKER;

      const position = {
        lat: location.position
          ? location.position.lat
          : parseFloat(location.getAttribute(DATA_LAT)),
        lng: location.position
          ? location.position.lng
          : parseFloat(location.getAttribute(DATA_LNG)),
      };

      const item = {
        position,
        id,
        icon,
      };

      const marker = new google.maps.Marker({
        position: item.position,
        map: this.map,
        icon: item.icon,
        id: item.id,
      });

      marker.addListener('click', function() {
        Events.$trigger('googlemaps::handleMarkerClick', marker);
      });

      this.markers.push(marker);
    });

    this.setBounds();
  }

  removeAllMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.markers = [];
  }

  handleMarkerClick(data) {
    this.hideAllLocations();
    this.resetAllMarkerIcons();

    const marker = data.detail;
    const clickedLocation = document.getElementById(marker.id);

    clickedLocation.classList.add(CLASS_LOCATION_VISIBLE);
    marker.setIcon(MAP_MARKER_ACTIVE);
  }

  toggleview() {
    this.resetActiveMarkersAndLocations();

    this.el.classList.toggle(CLASS_LIST_VIEW);

    this.viewButtons.forEach(button => {
      button.classList.toggle(CLASS_BUTTON_ACTIVE);
    });

    this.setBounds();
  }

  resetActiveMarkersAndLocations() {
    this.hideAllLocations();
    this.resetAllMarkerIcons();
  }

  hideAllLocations() {
    const locations = this.hasListView ? this.locations : this.createdLocations;

    locations.forEach(item => {
      item.classList.remove(CLASS_LOCATION_VISIBLE);
    });
  }

  resetAllMarkerIcons() {
    this.markers.forEach(marker => {
      marker.setIcon(MAP_MARKER);
    });
  }

  changeRegion(data) {
    this.hideAllLocations();

    const selectedIndex = data.detail.currentTarget.selectedIndex;
    const selectedRegionID = data.detail.currentTarget[selectedIndex].value;

    if (selectedRegionID === '-1') {
      this.activateRegion('all');
      this.addMarkers(this.locations);
    } else {
      const selectedRegion = document.getElementById(selectedRegionID);
      const locations = selectedRegion
        ? [...selectedRegion.querySelectorAll(HOOK_LOCATION)]
        : this.getLocationsByRegionId(selectedRegionID);

      this.activateRegion(selectedRegionID);
      this.addMarkers(locations);
    }
  }

  getLocationsByRegionId(id) {
    const { locations } = DEFAULT_REGIONS.filter(region => region.id === id)[0];
    return locations;
  }

  activateRegion(region_id) {
    if (!this.hasListView) return;

    if (region_id === 'all') {
      this.regions.forEach(item => {
        item.classList.add(CLASS_REGION_ACTIVE);
      });
    } else {
      this.regions.forEach(item => {
        item.classList.remove(CLASS_REGION_ACTIVE);
      });

      document.getElementById(region_id).classList.add(CLASS_REGION_ACTIVE);
    }
  }

  setBounds() {
    this.currentBounds = new google.maps.LatLngBounds();

    this.markers.forEach(marker => {
      this.currentBounds.extend(marker.position);
    });

    this.map.fitBounds(this.currentBounds);
    this.map.setCenter(this.currentBounds.getCenter());

    if (this.map.getZoom() > MAP_MAX_ZOOM) {
      this.map.setZoom(MAP_MAX_ZOOM);
    }
  }
}

export default GoogleMaps;
