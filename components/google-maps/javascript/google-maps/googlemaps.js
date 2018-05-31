import Events from '@utilities/events';
import { MAP_SETTINGS, MAP_MARKER, MAP_MARKER_ACTIVE, MAP_API_KEY  } from './map-settings.js';

const HOOK_MAPS_CONTAINER       = '[js-hook-googlemaps-container]';
const HOOK_REGION_SELECT        = '[js-hook-region-select]';
const HOOK_VIEW_BUTTONS         = '[js-hook-googlemaps-view-button]';
const HOOK_REGION               = '[js-hook-region]';
const HOOK_LOCATION             = '[js-hook-location]';

const LOCATIONS_DATA_ATTR       = 'data-locations';
const FIRST_OPTION_DATA_ATTR    = 'data-text-first-option';

const LIST_VIEW_CLASS           = 'is--list-view';
const LOCATION_VISIBLE_CLASS    = 'is--visible';
const REGION_ACTIVE_CLASS       = 'is--active';
const BUTTON_ACTIVE_CLASS       = 'is--active';

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

        this.locationData       = this.mapContainer.getAttribute( LOCATIONS_DATA_ATTR );
        this.locationsJSON      = JSON.parse(this.locationData);


        this.loadGoogleAPI();
        this.bindEvents();
    }

    bindEvents() {

        window.initMap = () => this.initMap(this.mapContainer);

        window.onresize = () => this.resetMap();

        Events.$on('googlemaps::handleMarkerClick', event => this.handleMarkerClick(event));

        Events.$on('googlemaps::handleMapClick', () => this.resetActiveMarkersAndLocations());

        Events.$on('googlemaps::toggleview', () => this.toggleview());

        Events.$on('googlemaps::changeregion', event => this.changeRegion(event));
    }

    loadGoogleAPI() {

        const script = document.createElement('script');
        script.src = `//maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&callback=initMap`;
        script.setAttribute('async', true);
        
        document.body.appendChild(script);
    }

    initMap(el) {

        this.map = new google.maps.Map(el, MAP_SETTINGS);

        this.createFilter( this.locationsJSON );

        this.activateRegion( "all" );

        this.addMarkers( this.locationsJSON );

        this.map.addListener('click', function() {
            Events.$trigger('googlemaps::handleMapClick');
        });
    }

    resetMap() {

        this.activateRegion( "all" );
        this.addMarkers( this.locationsJSON );
    }

    createFilter( data ) {

        const option = document.createElement('option');
        option.text = this.regionSelect.getAttribute( FIRST_OPTION_DATA_ATTR );
        option.value = "-1" ;
        this.regionSelect.appendChild( option );

        Array.from(data).forEach( (region, index) => {

            const option = document.createElement('option');
            option.text = region.name;
            option.value = index ;
            this.regionSelect.appendChild( option );

        });
    }

    addMarkers( data ) {

        this.removeAllMarkers();

        Array.from(data).forEach( region => {

            if( !region.locations ) return;

            region.locations.forEach( location => {

                let marker = new google.maps.Marker({
                    position: location.position,
                    map: this.map,
                    icon: location.icon ? location.icon : MAP_MARKER,
                    id: location.id,
                });

                marker.addListener('click', function() {
                    Events.$trigger('googlemaps::handleMarkerClick', marker);
                });

                this.markers.push(marker);

            });

        });

        this.setBounds();
    }

    removeAllMarkers() {

        this.markers.forEach( marker => {
            marker.setMap(null);
        });

        this.markers = [];
    }


    handleMarkerClick(event) {

        this.hideAllLocations();
        this.resetAllMarkerIcons();

        let marker = event.detail;
        let clickedLocation = document.querySelector(`#${marker.id}`);
        clickedLocation.classList.add( LOCATION_VISIBLE_CLASS );

        marker.setIcon( MAP_MARKER_ACTIVE );
    }

    toggleview() {

        this.resetActiveMarkersAndLocations();

        this.el.classList.toggle(LIST_VIEW_CLASS);

        Array.from(this.viewButtons).forEach( button => {
            button.classList.toggle(BUTTON_ACTIVE_CLASS);
        });

        this.setBounds();
    }

    resetActiveMarkersAndLocations() {

        this.hideAllLocations();
        this.resetAllMarkerIcons();
    }

    hideAllLocations() {

        Array.from(this.locations).forEach( item => {
            item.classList.remove( LOCATION_VISIBLE_CLASS );
        });
    }

    resetAllMarkerIcons() {

        this.markers.forEach( marker => {
            marker.setIcon( MAP_MARKER );
        });
    }

    changeRegion(event) {

        this.hideAllLocations();

        const selectedIndex = event.detail.currentTarget.selectedIndex;
        const value = event.detail.currentTarget[selectedIndex].value;

        if( value === "-1" ) {

            this.activateRegion( "all" );
            this.addMarkers( this.locationsJSON );

        } else {

            this.activateRegion( this.locationsJSON[value].id );
            this.addMarkers( [ this.locationsJSON[value] ] );

        }
    }

    activateRegion( region_id ) {

        if( region_id === "all" ) {

            Array.from(this.regions).forEach( item => {
                item.classList.add( REGION_ACTIVE_CLASS );
            });

        } else {

            Array.from(this.regions).forEach( item => {
                item.classList.remove( REGION_ACTIVE_CLASS );
            });

            document.querySelector(`#${region_id}`).classList.add( REGION_ACTIVE_CLASS );

        }
    }

    setBounds() {

        this.currentBounds = new google.maps.LatLngBounds();

        this.markers.forEach( marker => {
            this.currentBounds.extend(marker.position);
        });

        this.map.fitBounds(this.currentBounds);
        this.map.setCenter(this.currentBounds.getCenter());
    }

}

export default GoogleMaps;