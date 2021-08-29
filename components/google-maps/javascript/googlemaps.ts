import Cookies, { CookieName } from '@/components/cookies'
import Events from '@/utilities/events'
import RafThrottle from '@/utilities/raf-throttle'

import {
  DEFAULT_REGIONS,
  MAP_API_KEY,
  MAP_MARKER,
  MAP_MARKER_ACTIVE,
  MAP_MAX_ZOOM,
  MAP_SETTINGS,
  MapLocation,
  MapRegion,
} from './map-settings'

// HOOKS
const HOOK_MAPS_CONTAINER = '[js-hook-googlemaps-container]'
const HOOK_REGION_SELECT = '[js-hook-region-select]'
const HOOK_LOCATION_LIST = '[js-hook-location-list]'
const HOOK_VIEW_BUTTONS = '[js-hook-googlemaps-view-button]'
const HOOK_REGION = '[js-hook-region]'
const HOOK_LOCATION = '[js-hook-location]'

//CLASSES
const CLASS_API_LOADED = 'googlemaps--has-loaded-api'
const CLASS_LIST_VIEW = 'googlemaps--is-list-view'
const CLASS_LOCATION_VISIBLE = 'location--is-visible'
const CLASS_REGION_ACTIVE = 'region--is-active'
const CLASS_BUTTON_ACTIVE = 'togglebutton--is-active'
const GOOGLEMAPS_COOKIE_INVALID_CLASS = 'googlemaps--has-invalid-cookie'

// DATA
const DATA_LAT = 'data-lat'
const DATA_LNG = 'data-lng'
const DATA_ICON = 'data-icon'

const URL_PREFIX = '//maps.googleapis.com/maps/api/js'

class GoogleMaps {
  element: HTMLElement
  mapContainer: HTMLElement | null
  regionSelect: HTMLElement | null
  map: google.maps.Map
  currentBounds: google.maps.LatLngBounds
  markers: google.maps.Marker[] = []
  regions: (HTMLLIElement | MapRegion)[]
  locations: (HTMLLIElement | MapLocation)[]
  viewButtons: HTMLButtonElement[]
  isMapsLoaded?: boolean
  hasListView = false

  constructor(element: HTMLElement) {
    this.element = element
    this.mapContainer = this.element.querySelector<HTMLElement>(HOOK_MAPS_CONTAINER)

    this.regionSelect = this.element.querySelector<HTMLElement>(HOOK_REGION_SELECT)
    this.viewButtons = [...this.element.querySelectorAll<HTMLButtonElement>(HOOK_VIEW_BUTTONS)]
    this.isMapsLoaded = !!document.querySelector(`script[src*="${URL_PREFIX}"]`)

    if (!Cookies.cookieIsValid(CookieName.ADVERTISING)) {
      this.element.classList.add(GOOGLEMAPS_COOKIE_INVALID_CLASS)
      return
    }

    this.bindRegionLocations()
    this.loadGoogleAPI()
    this.bindEvents()
  }

  bindRegionLocations() {
    if (this.element.querySelector(HOOK_REGION)) {
      this.regions = [...this.element.querySelectorAll<HTMLLIElement>(HOOK_REGION)]
      this.locations = [...this.element.querySelectorAll<HTMLLIElement>(HOOK_LOCATION)]
      this.hasListView = true
    } else {
      this.regions = []
      this.locations = []
      this.createRegionsLocationsArray()
      this.createLocationsList()
    }
  }

  createLocationsList() {
    // Create simple info list from JSON Data
    const list = this.element.querySelector<HTMLUListElement>(HOOK_LOCATION_LIST)
    if (!list) return
    const items = this.locations
      .map(
        location =>
          !(location instanceof HTMLLIElement) &&
          `
            <li class="region__location-list-item" id="${location.id}" data-lat="${location.position.lat}" data-lng="${location.position.lng}" js-hook-location>
                ${location.title}
            </li>
        `,
      )
      .join('')

    list.innerHTML = items
    this.locations = Array.from(list.querySelectorAll<HTMLLIElement>(HOOK_LOCATION))
  }

  createRegionsLocationsArray() {
    const regions = DEFAULT_REGIONS

    regions.forEach(region => {
      this.regions.push({ name: region.name, id: region.id })

      if (region.locations) {
        this.locations = [...this.locations, ...region.locations]
      }
    })
  }

  bindEvents() {
    window.initMap = () => this.initMap()

    RafThrottle.set([
      {
        element: window,
        event: 'resize',
        namespace: 'MapResize',
        delay: 300,
        fn: () => this.resetMap(),
      },
    ])

    Events.$on<void>('googlemaps::handleMapClick', () => this.resetActiveMarkersAndLocations())

    Events.$on<void>('googlemaps::toggleview', () => this.toggleview())

    Events.$on<HTMLElement>('googlemaps::changeregion', (_, __, currentTarget) => {
      if (currentTarget instanceof HTMLSelectElement) this.changeRegion(currentTarget)
    })
  }

  loadGoogleAPI() {
    if (!this.isMapsLoaded) {
      const script = document.createElement('script')
      script.src = `${URL_PREFIX}?key=${MAP_API_KEY}&callback=initMap`
      script.async = true
      document.head.appendChild(script)
    }
  }

  initMap() {
    if (!this.mapContainer) return
    this.element.classList.add(CLASS_API_LOADED)

    this.map = new google.maps.Map(this.mapContainer, MAP_SETTINGS)

    this.createFilter()

    this.activateRegion('all')

    this.addMarkers(this.locations)

    this.map.addListener('click', function () {
      Events.$trigger('googlemaps::handleMapClick')
    })
  }

  resetMap() {
    this.activateRegion('all')
    this.addMarkers(this.locations)
  }

  createFilter() {
    const option = document.createElement('option')
    option.text = 'All'
    option.value = '-1'
    this.regionSelect?.appendChild(option)

    this.regions.forEach(region => {
      const isListItem = region instanceof HTMLLIElement
      const text = isListItem ? region.getAttribute('data-name') : region.name
      const value = isListItem ? region.getAttribute('id') : region.id
      if (!text || !value) return

      const option = document.createElement('option')
      option.text = text
      option.value = value
      this.regionSelect?.appendChild(option)
    })
  }

  addMarkers(locations: GoogleMaps['locations']) {
    this.removeAllMarkers()

    locations.forEach(location => {
      const isListItem = location instanceof HTMLLIElement
      const id = isListItem ? location.getAttribute('id') : location.id
      const icon = isListItem ? location.getAttribute(DATA_ICON) : MAP_MARKER
      const position = {
        lat: isListItem ? parseFloat(location.getAttribute(DATA_LAT) || '') : location.position.lat,
        lng: isListItem ? parseFloat(location.getAttribute(DATA_LNG) || '') : location.position.lng,
      }

      if (!id || !position.lat || !position.lng) return

      const item = {
        position,
        id,
        icon,
      }

      const marker = new google.maps.Marker({
        position: item.position,
        map: this.map,
        icon: item.icon,
      })

      marker.addListener('click', () => {
        this.handleMarkerClick(item.id, marker)
      })

      this.markers.push(marker)
    })

    this.setBounds()
  }

  removeAllMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null)
    })

    this.markers = []
  }

  handleMarkerClick(id: string, marker: google.maps.Marker) {
    this.hideAllLocations()
    this.resetAllMarkerIcons()

    const clickedLocation = document.getElementById(id)
    clickedLocation?.classList.add(CLASS_LOCATION_VISIBLE)
    marker.setIcon(MAP_MARKER_ACTIVE)
  }

  toggleview() {
    this.resetActiveMarkersAndLocations()

    this.element.classList.toggle(CLASS_LIST_VIEW)

    this.viewButtons.forEach(button => {
      button.classList.toggle(CLASS_BUTTON_ACTIVE)
    })

    this.setBounds()
  }

  resetActiveMarkersAndLocations() {
    this.hideAllLocations()
    this.resetAllMarkerIcons()
  }

  hideAllLocations() {
    this.locations.forEach(location => {
      if (location instanceof HTMLLIElement) location.classList.remove(CLASS_LOCATION_VISIBLE)
    })
  }

  resetAllMarkerIcons() {
    this.markers.forEach(marker => {
      marker.setIcon(MAP_MARKER)
    })
  }

  changeRegion(element: HTMLSelectElement) {
    this.hideAllLocations()
    const selectedIndex = element.selectedIndex
    const selectedRegionID = (element[selectedIndex] as HTMLOptionElement).value

    if (selectedRegionID === '-1') {
      this.activateRegion('all')
      this.addMarkers(this.locations)
    } else {
      const selectedRegion = document.getElementById(selectedRegionID)
      this.getLocationsByRegionId(selectedRegionID)
      const locations = selectedRegion
        ? [...selectedRegion.querySelectorAll<HTMLLIElement>(HOOK_LOCATION)]
        : this.getLocationsByRegionId(selectedRegionID)

      this.activateRegion(selectedRegionID)
      if (locations) this.addMarkers(locations)
    }
  }

  getLocationsByRegionId(id: string) {
    const region = DEFAULT_REGIONS.find(region => region.id === id)
    return region?.locations
  }

  activateRegion(regionId: string) {
    if (!this.hasListView) return

    if (regionId === 'all') {
      this.regions.forEach(region => {
        if (region instanceof HTMLLIElement) region.classList.add(CLASS_REGION_ACTIVE)
      })
    } else {
      this.regions.forEach(region => {
        if (region instanceof HTMLLIElement) region.classList.remove(CLASS_REGION_ACTIVE)
      })

      document.getElementById(regionId)?.classList.add(CLASS_REGION_ACTIVE)
    }
  }

  setBounds() {
    this.currentBounds = new google.maps.LatLngBounds()

    this.markers.forEach(marker => {
      const markerPosition = marker.getPosition()
      if (markerPosition) this.currentBounds.extend(markerPosition)
    })

    this.map.fitBounds(this.currentBounds)
    this.map.setCenter(this.currentBounds.getCenter())

    const zoom = this.map.getZoom()
    if (zoom && zoom > MAP_MAX_ZOOM) {
      this.map.setZoom(MAP_MAX_ZOOM)
    }
  }
}

export default GoogleMaps
