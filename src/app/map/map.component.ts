import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environmnent';
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
      accessToken: environment.mapbox.accessToken,
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
      type: 'circle', // You can use 'symbol' for custom icons
      source: 'BeehiveLocations',
      paint: {
        'circle-radius': 8,
        'circle-color': '#161DE9', 
      }
    });

    this.map.addLayer({
      id: 'hornet-points',
      type: 'circle', // You can use 'symbol' for custom icons
      source: 'HornetLocations',
      paint: {
        'circle-radius': 40,
        'circle-color': '#da2828', 
        'circle-opacity': 0.6 
      }
    });
  }
}
