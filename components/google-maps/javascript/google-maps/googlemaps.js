import Events from '@utilities/events';
import { MAP_SETTINGS, MAP_MARKER, MAP_API_KEY  } from './map-settings.js';

const HOOK_MAPS_CONTAINER   = '[js-hook-googlemaps-container]';
const HOOK_LOCATION_LIST    = '[js-hook-googlemaps-office-list]';
const LOCATIONS_DATA_ATTR   = 'data-locations';

class GoogleMaps {

    constructor( element ) {

        this.map = null;
        this.currentBounds = [];
        this.markers = [];

        this.el            = element;
        this.mapContainer  = this.el.querySelector( HOOK_MAPS_CONTAINER );
        this.locationList  = this.el.querySelector( HOOK_LOCATION_LIST );

        this.locationData   = this.mapContainer.getAttribute( LOCATIONS_DATA_ATTR );
        this.locations      = JSON.parse(this.locationData);

        this.loadGoogleAPI();
        this.bindEvents();

    }

    bindEvents() {

        //Bind initMap to window to let Google Maps access it
        window.initMap = () => this.initMap(this.mapContainer);

        Events.$on('googlemaps::handleMarkerClick', (e) => this.handleMarkerClick(e));

    }

    loadGoogleAPI() {

        const script = document.createElement('script');
        script.src = "//maps.googleapis.com/maps/api/js?key="+MAP_API_KEY+"&callback=initMap";
        script.setAttribute('async', true);
        script.setAttribute('defer', true);
        
        document.body.appendChild(script);
    }

    initMap(el) {

       this.map = new google.maps.Map(el, MAP_SETTINGS);

       this.addMarkers();
       this.setBounds();
    }

    addMarkers() {

        this.locations.forEach( ( location ) => {

            let marker = new google.maps.Marker({
                position: location.position,
                map: this.map,
                icon: MAP_MARKER,
                id: location.id,
            });

            marker.addListener('click', function() {
                Events.$trigger('googlemaps::handleMarkerClick', marker);
            });

            this.markers.push(marker);
            
        });

    }

    handleMarkerClick(marker) {

        // Do custom stuff on marker click

    }

    setBounds() {

        this.currentBounds = new google.maps.LatLngBounds();

        this.markers.map(marker => {
            this.currentBounds.extend(marker.position);
        });

        this.map.fitBounds(this.currentBounds);
        this.map.setCenter(this.currentBounds.getCenter());
    }

}

export default GoogleMaps;