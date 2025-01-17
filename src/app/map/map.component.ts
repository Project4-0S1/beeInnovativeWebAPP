import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, GeoJSON } from 'geojson';
import { Beehive } from '../interfaces/beehive';
import { Observable } from 'rxjs';
import { BeehiveService } from '../services/beehive.service';
import { CommonModule } from '@angular/common';
import { Nestlocations } from '../interfaces/nestlocations';
import { NestlocationService } from '../services/nestlocation.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map | undefined; 
  style = 'mapbox://styles/jorrit-geurts/cm5w9qqsi00qt01s78bsb3n9j';
  lat: number = 51.16190723486903;
  lng: number = 4.961886810019829;

  //Beehives
  beehives$: Observable<Beehive[]> = new Observable<Beehive[]>();
  beehive!: Beehive;

  nestlocations$: Observable<Nestlocations[]> = new Observable<Nestlocations[]>();

  // beehiveLocations = [
  //   {lat: 51.164120751116435, lon: 4.961838518509023, name: "De C"},
  //   {lat: 51.14956154963047, lon: 4.964806904144326, name: "Pizza Hut"}
  // ];

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

  constructor(private beehiveService: BeehiveService, private nestLocationService: NestlocationService) {}
  
  ngOnInit(): void {
    this.beehives$ = this.beehiveService.getBeehives();
    this.nestlocations$ = this.nestLocationService.getAllNests();

    console.log(this.beehives$);
    console.log(this.nestlocations$);

    this.beehives$.subscribe((locations: Beehive[]) => {
      locations.forEach(location => {
        this.beehiveJsonData.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          },
          properties: {
            title: location.beehiveName
          }
        });
      });
    });

    console.log("beehives added");
    
    this.nestlocations$.forEach((locations: Nestlocations[]) => {
      locations.forEach(location => {
        this.hornetJsonLocation.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.estimatedLongitude, location.estimatedLatitude]
          },
          properties: {
            title: ''
          }
        });
      });
    });

    console.log("DEBUG")

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
          17, 800,
          18, 1600,
          19, 3200,
          20, 6400,
          21, 12800,
          22, 25600,
        ],
        'circle-color': '#da2828', 
        'circle-opacity': 0.6 
      }
    });
  }
}
