import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, GeoJSON } from 'geojson';
import { Beehive } from '../interfaces/beehive';
import { Observable } from 'rxjs';
import { BeehiveService } from '../services/beehive.service';
import { CommonModule } from '@angular/common';
import { Nestlocations } from '../interfaces/nestlocations';
import { EstimatedNestLocations } from '../interfaces/estimatedNestLocations';
import { NestlocationService } from '../services/nestlocation.service';
import { EstimatedNestLocationService } from '../services/estimated-nest-location.service';
import { environment } from '../../environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Status } from '../interfaces/status';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map | undefined; 
  style = 'mapbox://styles/jorrit-geurts/cm66hjbon00f001s7cuxpft2p';
  lat: number = 51.16190723486903;
  lng: number = 4.961886810019829;

  //Beehives
  beehives$: Observable<Beehive[]> = new Observable<Beehive[]>();
  beehive!: Beehive;

  //Statuses
  statuses$: Observable<Status[]> = new Observable<Status[]>();

  estimatedNestlocations$: Observable<EstimatedNestLocations[]> = new Observable<EstimatedNestLocations[]>();
  nestlocations$: Observable<Nestlocations[]> = new Observable<Nestlocations[]>();

  beehiveJsonData: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  hornetLocationDetected: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  hornetLocationFound: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  hornetLocationCleared: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  
  estimatedHornetJsonLocation: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  isVisible = false;
  formId: number = 0;
  nestForm: Nestlocations = {id: 0, statusId: 0, latitude: 0, longitude: 0}

  constructor(private beehiveService: BeehiveService, private nestLocationService: NestlocationService, private estimatedNestLocationService: EstimatedNestLocationService, private statusService: StatusService) {}
  
  ngOnInit(): void {
    this.beehives$ = this.beehiveService.getBeehives().pipe(
      tap((locations: Beehive[]) => {
        // Verwerk de beehive-data
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
      })
    );

    this.estimatedNestlocations$ = this.estimatedNestLocationService.getAllNests();
    this.nestlocations$ = this.nestLocationService.getAllNests();
    this.statuses$ = this.statusService.getAllStatuses();
    
    this.nestlocations$.forEach((locations: Nestlocations[]) => {
      locations.forEach(location => {
        if(location.statusId == 1){
          this.hornetLocationDetected.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude]
            },
            properties: {
              id: location.id
            }
          });
        }
        else if(location.statusId == 2){
          this.hornetLocationFound.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude]
            },
            properties: {
              id: location.id
            }
          });
        }
        else if(location.statusId == 3){
          this.hornetLocationCleared.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude]
            },
            properties: {
              id: location.id
            }
          });
        }
      });
    });
    
    this.estimatedNestlocations$.forEach((locations: EstimatedNestLocations[]) => {
      locations.forEach(location => {
        this.estimatedHornetJsonLocation.features.push({
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

    // Subscribe uitvoeren nadat alle data is verwerkt
    this.beehives$.subscribe(() => {
      this.map = new mapboxgl.Map({
        accessToken: environment.mapbox.accessToken,
        container: 'map',
        style: this.style,
        zoom: 13,
        center: [this.lng, this.lat]
      });
  
      this.map!.on('load', () => {
        this.addGeoJsonLayer();
      });
    });

    this.map?.on('click', (event) => {
      // Query rendered features at the click location for multiple layers
      const layers = ['hornet-points-found', 'hornet-points-detected', 'hornet-points-cleared'];
      const features = this.map?.queryRenderedFeatures(event.point, { layers });
    
      if (features && features.length > 0) {
        const clickedFeature = features[0];

        this.isVisible = true;
    
        // Check the layer ID to determine the action
        switch (clickedFeature.layer!.id) {
          case 'hornet-points-found':
            this.formId = clickedFeature.properties!['id'];
            this.nestlocations$.subscribe((result: Nestlocations[]) => {
              const selectedNest = result[this.formId - 1];
              this.nestForm = selectedNest;
              this.nestForm.id = selectedNest.id;
            });
            break;
    
          case 'hornet-points-detected':
            this.formId = clickedFeature.properties!['id'];
            this.nestlocations$.subscribe((result: Nestlocations[]) => {
              const selectedNest = result[this.formId - 1];
              this.nestForm = selectedNest;
              this.nestForm.id = selectedNest.id;
            });
            break;
    
          case 'hornet-points-cleared':
            this.formId = clickedFeature.properties!['id'];
            this.nestlocations$.subscribe((result: Nestlocations[]) => {
              const selectedNest = result[this.formId - 1];
              this.nestForm = selectedNest;
              this.nestForm.id = selectedNest.id;
            });
            break;
        }
      }
    });
  }

  onSubmit() {

    this.nestLocationService.putStatus(this.nestForm.id, this.nestForm).subscribe(() => {
      window.location.reload();
      this.closeModal();
    });
  }

  closeModal() {
    this.nestForm = {id: 0, statusId: 0, latitude: 0, longitude: 0};
    this.isVisible = false;
  }

  metersToPixelsAtZoom(meters: number, zoomLevel: number) {
    // Constants for Mapbox tile size and projection
    const TILE_SIZE = 512; // Mapbox default tile size
    const WORLD_SIZE = 40075016.686; // Circumference of the Earth in meters (at the equator)

    // Calculate the number of pixels per meter at the given zoom level
    const scale = Math.pow(2, zoomLevel);
    const metersPerPixel = WORLD_SIZE / TILE_SIZE / scale;

    // Convert meters to pixels
    return meters / metersPerPixel;
  }


  addGeoJsonLayer() {
    if (!this.map) {
      return;
    }

    // Add the GeoJSON source
    this.map.addSource('BeehiveLocations', {
      type: 'geojson',
      data: this.beehiveJsonData
    });

    this.map.addSource('HornetLocationsDetected', {
      type:'geojson',
      data: this.hornetLocationDetected
    });

    this.map.addSource('HornetLocationsFound', {
      type:'geojson',
      data: this.hornetLocationFound
    });

    this.map.addSource('HornetLocationsCleared', {
      type:'geojson',
      data: this.hornetLocationCleared
    });
    
    this.map.addSource('EstimatedHornetLocations', {
      type:'geojson',
      data: this.estimatedHornetJsonLocation
    });

    this.map.addLayer({
      id: 'hornet-points-detected',
      type: 'circle',
      source: 'HornetLocationsDetected',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, this.metersToPixelsAtZoom(100, 8),
          9, this.metersToPixelsAtZoom(100, 9),
          10, this.metersToPixelsAtZoom(100, 10),
          11, this.metersToPixelsAtZoom(100, 11),
          12, this.metersToPixelsAtZoom(100, 12),
          13, this.metersToPixelsAtZoom(100, 13),
          14, this.metersToPixelsAtZoom(100, 14),
          15, this.metersToPixelsAtZoom(100, 15),
          16, this.metersToPixelsAtZoom(100, 16),
          17, this.metersToPixelsAtZoom(100, 17),
          18, this.metersToPixelsAtZoom(100, 18),
          19, this.metersToPixelsAtZoom(100, 19),
          20, this.metersToPixelsAtZoom(100, 20),
          21, this.metersToPixelsAtZoom(100, 21),
          22, this.metersToPixelsAtZoom(100, 22),
        ],
        'circle-color': '#da2828', 
        'circle-opacity': 0.6 
      }
    });

    this.map.addLayer({
      id: 'hornet-points-found',
      type: 'symbol',
      source: 'HornetLocationsFound',
      layout: {
        'icon-image': 'hornetnestFound', // Built-in Mapbox icon
        'icon-size': 1.5 // Adjust size if needed
      }
    });

    this.map.addLayer({
      id: 'hornet-points-cleared',
      type: 'symbol',
      source: 'HornetLocationsCleared',
      layout: {
        'icon-image': 'hornetCleared', // Built-in Mapbox icon
        'icon-size': 1.5, // Adjust size if needed
      }
    });
    
    this.map.addLayer({
      id: 'estimated-hornet-points',
      type: 'circle',
      source: 'EstimatedHornetLocations',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, this.metersToPixelsAtZoom(100, 8),
          9, this.metersToPixelsAtZoom(100, 9),
          10, this.metersToPixelsAtZoom(100, 10),
          11, this.metersToPixelsAtZoom(100, 11),
          12, this.metersToPixelsAtZoom(100, 12),
          13, this.metersToPixelsAtZoom(100, 13),
          14, this.metersToPixelsAtZoom(100, 14),
          15, this.metersToPixelsAtZoom(100, 15),
          16, this.metersToPixelsAtZoom(100, 16),
          17, this.metersToPixelsAtZoom(100, 17),
          18, this.metersToPixelsAtZoom(100, 18),
          19, this.metersToPixelsAtZoom(100, 19),
          20, this.metersToPixelsAtZoom(100, 20),
          21, this.metersToPixelsAtZoom(100, 21),
          22, this.metersToPixelsAtZoom(100, 22),
        ],
        'circle-color': '#3b10c7', 
        'circle-opacity': 0.6 
      }
    });

    // Add a layer to display the points
    this.map.addLayer({
      id: 'location-points',
      type: 'symbol',
      source: 'BeehiveLocations',
      layout: {
        'icon-image': 'MapMarkerBeehive', // Built-in Mapbox icon
        'icon-size': 1.5, // Adjust size if needed
        'icon-offset': [0, -20], // Optional offset
        'text-field': ['get', 'title'], // Show the location name as text
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 12,
        'text-offset': [0, -5],
      },
      paint: {
        'text-color': '#161DE9',  // Set text color
        'text-halo-color': '#ffffff', // Optional halo around the text
        'text-halo-width': 2, // Optional halo width for better visibility
      }
    });

    
  }
}
