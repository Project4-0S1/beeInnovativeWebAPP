import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, GeoJSON } from 'geojson';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map | undefined; 
  style = 'mapbox://styles/jorrit-geurts/cm5w9qqsi00qt01s78bsb3n9j';
  lat: number = 51.16190723486903;
  lng: number = 4.961886810019829;

  beehiveLocations = [
    {lat: 51.164120751116435, lon: 4.961838518509023, name: "De C"},
    {lat: 51.14956154963047, lon: 4.964806904144326, name: "Pizza Hut"}
  ];

  hornetLocations = [
    {lat: 51.16080291398481, lon: 4.9644732260095275},
    {lat: 51.170209175807024, lon: 4.968067403732371}
  ];

  beehiveJsonData: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  
  hornetJsonLocation: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  constructor() {}
  
  ngOnInit(): void {

    this.beehiveLocations.forEach(location => {
      this.beehiveJsonData.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.lon, location.lat] 
        },
        properties: {
          title: location.name
        }
      });
    });
    
    this.hornetLocations.forEach(location => {
      this.hornetJsonLocation.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.lon, location.lat]
        },
        properties: {
          title: ''
        }
      });
    });

    this.map = new mapboxgl.Map({
      accessToken: "pk.eyJ1Ijoiam9ycml0LWdldXJ0cyIsImEiOiJjbTV3YjQybngwN2xxMmxzYXJ4bXI2dDRmIn0.2H-0nL81JkwycB_b9En0Bw",
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    this.map.on('load', () => {
      this.addGeoJsonLayer();
    });
  }

  addGeoJsonLayer() {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }

    // Add the GeoJSON source
    this.map.addSource('BeehiveLocations', {
      type: 'geojson',
      data: this.beehiveJsonData
    });

    this.map.addSource('HornetLocations', {
      type:'geojson',
      data: this.hornetJsonLocation
    });

    // Add a layer to display the points
    this.map.addLayer({
      id: 'location-points',
      type: 'symbol',
      source: 'BeehiveLocations',
      layout: {
        'icon-image': 'mapbox-square', // Use a predefined Mapbox icon (or custom icon)
        'text-field': ['get', 'title'], // Show the location name as text
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 12,
        'text-offset': [0, -5],
        'icon-size': 1.5,
        'icon-offset':  [0, -20],
      },
      paint: {
        'text-color': '#161DE9',  // Set text color
        'text-halo-color': '#ffffff', // Optional halo around the text
        'text-halo-width': 2, // Optional halo width for better visibility
      }
    });

    this.map.addLayer({
      id: 'hornet-points',
      type: 'circle',
      source: 'HornetLocations',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 1.5,
          9, 3.125,
          10, 6.25,
          11, 12.5,
          12, 25,
          13, 50,
          14, 100,
          15, 200,
          16, 400,
          17, 800
        ],
        'circle-color': '#da2828', 
        'circle-opacity': 0.6 
      }
    });
  }
}
