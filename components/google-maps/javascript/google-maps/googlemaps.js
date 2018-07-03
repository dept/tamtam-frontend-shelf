import Events from '@utilities/events';
import { MAP_SETTINGS, MAP_MARKER, MAP_MARKER_ACTIVE, MAP_MAX_ZOOM, MAP_API_KEY  } from './map-settings.js';

// HOOKS
const HOOK_MAPS_CONTAINER       = '[js-hook-googlemaps-container]';
const HOOK_REGION_SELECT        = '[js-hook-region-select]';
const HOOK_VIEW_BUTTONS         = '[js-hook-googlemaps-view-button]';
const HOOK_REGION               = '[js-hook-region]';
const HOOK_LOCATION             = '[js-hook-location]';

//CLASSES
const CLASS_API_LOADED          = 'has--loaded-api';
const CLASS_LIST_VIEW           = 'googlemaps--list-view';
const CLASS_LOCATION_VISIBLE    = 'location--is-visible';
const CLASS_REGION_ACTIVE       = 'region--is-active';
const CLASS_BUTTON_ACTIVE       = 'is-active';

// DATA
const DATA_LAT                  = 'data-lat';
const DATA_LNG                  = 'data-lng';
const DATA_ICON                 = 'data-icon';


class GoogleMaps {

    constructor( element ) {

        this.map                = null;
        this.currentBounds      = [];
        this.markers            = [];

        this.el                 = element;
        this.mapContainer       = this.el.querySelector( HOOK_MAPS_CONTAINER );

        this.regions            = this.el.querySelectorAll( HOOK_REGION );
        this.locations          = this.el.querySelectorAll( HOOK_LOCATION );

        this.regionSelect       = this.el.querySelector( HOOK_REGION_SELECT );
        this.viewButtons        = this.el.querySelectorAll( HOOK_VIEW_BUTTONS );

        this.loadGoogleAPI();
        this.bindEvents();

    }

    bindEvents() {

        //Bind initMap to window to let Google Maps access it
        window.initMap = () => this.initMap(this.mapContainer);

        window.onresize = () => this.resetMap();

        Events.$on('googlemaps::handleMarkerClick', e => this.handleMarkerClick(e));

        Events.$on('googlemaps::handleMapClick', () => this.resetActiveMarkersAndLocations());

        Events.$on('googlemaps::toggleview', () => this.toggleview());

        Events.$on('googlemaps::changeregion', e => this.changeRegion(e));

    }

    loadGoogleAPI() {

        const script = document.createElement('script');
        script.src = `//maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&callback=initMap`;
        script.setAttribute('async', true);
        
        document.body.appendChild(script);
    }

    initMap(el) {

        this.el.classList.add( CLASS_API_LOADED );

        this.map = new google.maps.Map(el, MAP_SETTINGS);

        this.createFilter();

        this.activateRegion( 'all' );

        this.addMarkers( this.locations );

        this.map.addListener('click', function() {
            Events.$trigger('googlemaps::handleMapClick');
        });

    }

    resetMap() {
        this.activateRegion( 'all' );
        this.addMarkers( this.locations );
    }

    createFilter() {

        const option = document.createElement('option');
        option.text = 'All';
        option.value = '-1' ;
        this.regionSelect.appendChild( option );

        this.regions.forEach( region => {
            const option = document.createElement('option');
            option.text = region.getAttribute('data-name');
            option.value = region.getAttribute('id') ;
            this.regionSelect.appendChild( option );
        });

    }

    addMarkers( locations ) {

        this.removeAllMarkers();

        locations.forEach( location => {

            const item = {
                position: {
                    lat: parseFloat( location.getAttribute( DATA_LAT ) ),
                    lng: parseFloat( location.getAttribute( DATA_LNG ) )
                },
                id: location.getAttribute('id'),
                icon: location.getAttribute( DATA_ICON ) || MAP_MARKER
            }

            const marker = new google.maps.Marker({
                position: item.position,
                map: this.map,
                icon: item.icon,
                id: item.id,
            });

            marker.addListener('click', function() {
                Events.$trigger('googlemaps::handleMarkerClick', marker);
            });

            this.markers.push( marker );

        });

        this.setBounds();

    }

    removeAllMarkers() {

        this.markers.forEach( marker => {
            marker.setMap(null);
        });

        this.markers = [];

    }


    handleMarkerClick(data) {

        this.hideAllLocations();
        this.resetAllMarkerIcons();

        const marker = data.detail;
        const clickedLocation = document.getElementById( marker.id );
        clickedLocation.classList.add( CLASS_LOCATION_VISIBLE );

        marker.setIcon( MAP_MARKER_ACTIVE );

    }

    toggleview() {

        this.resetActiveMarkersAndLocations();

        this.el.classList.toggle( CLASS_LIST_VIEW );

        this.viewButtons.forEach( button => {
            button.classList.toggle( CLASS_BUTTON_ACTIVE );
        });

        this.setBounds();
    }

    resetActiveMarkersAndLocations() {
        this.hideAllLocations();
        this.resetAllMarkerIcons();
    }

    hideAllLocations() {
        this.locations.forEach( item => {
            item.classList.remove( CLASS_LOCATION_VISIBLE );
        });
    }

    resetAllMarkerIcons() {
        this.markers.forEach( marker => {
            marker.setIcon( MAP_MARKER );
        });
    }

    changeRegion(data) {

        this.hideAllLocations();

        const selectedIndex = data.detail.currentTarget.selectedIndex;
        const selectedRegionID = data.detail.currentTarget[selectedIndex].value;

        if( selectedRegionID === '-1' ) {

            this.activateRegion( 'all' );
            this.addMarkers( this.locations );

        } else {

            this.activateRegion( selectedRegionID );
            this.addMarkers( document.getElementById( selectedRegionID ).querySelectorAll( HOOK_LOCATION ) );

        }

    }

    activateRegion( region_id ) {

        if( region_id === 'all' ) {

            this.regions.forEach( item => {
                item.classList.add( CLASS_REGION_ACTIVE );
            });

        } else {

            this.regions.forEach( item => {
                item.classList.remove( CLASS_REGION_ACTIVE );
            });

            document.getElementById( region_id ).classList.add( CLASS_REGION_ACTIVE );

        }

    }

    setBounds() {

        this.currentBounds = new google.maps.LatLngBounds();

        this.markers.forEach( marker => {
            this.currentBounds.extend( marker.position );
        });

        this.map.fitBounds( this.currentBounds );
        this.map.setCenter( this.currentBounds.getCenter() );

        if( this.map.getZoom() > MAP_MAX_ZOOM ) {
            this.map.setZoom( MAP_MAX_ZOOM );
        }

    }

}

export default GoogleMaps;