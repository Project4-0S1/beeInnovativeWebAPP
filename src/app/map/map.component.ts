import { Component, HostListener, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, GeoJSON } from 'geojson';
import { Beehive } from '../interfaces/beehive';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { BeehiveService } from '../services/beehive.service';
import { CommonModule } from '@angular/common';
import { Nestlocations } from '../interfaces/nestlocations';
import { EstimatedNestLocations } from '../interfaces/estimatedNestLocations';
import { NestlocationService } from '../services/nestlocation.service';
import { EstimatedNestLocationService } from '../services/estimated-nest-location.service';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Status } from '../interfaces/status';
import { StatusService } from '../services/status.service';
import { UserBeehiveService } from '../services/user-beehive.service';
import { UserBeehive } from '../interfaces/user-beehive';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  //imports for the Map
  map: mapboxgl.Map | undefined; 
  style = 'mapbox://styles/jorrit-geurts/cm66hjbon00f001s7cuxpft2p'; //Style link of the map

  //Start Coordinates
  lat: number = 51.16190723486903;
  lng: number = 4.961886810019829;

  selectedMarker: mapboxgl.Marker | null = null; // variable for changing the markers

  //Settings for legend
  isLegendOpen: boolean = false;
  screenWidth: number = window.innerWidth;

  //Host listener, needed for triggering a function for the filter to change the style of the legend
  @HostListener('window:resize', [])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  //Array for the different filters. With their: names, icon url, it's activitiy, it's layerId
  filters = [
    {name: 'Bijenkorven', icon: 'assets/beehivesmaller.svg', active: true, layerId: "location-points"},
    {name: 'Detecties', icon: 'assets/MapMarkerHornet.svg', active: true, layerId: "hornet-points-detected"},
    {name: 'Gevonden Nesten', icon: 'assets/hornetnestFound.svg', active: true, layerId: "hornet-points-found"},
    {name: 'Verwijderde Nesten', icon: 'assets/hornetCleared.svg', active: true, layerId: "hornet-points-cleared"},
  ];

  //Beehives
  beehives$: Observable<UserBeehive[]> = new Observable<UserBeehive[]>();
  beehive!: Beehive;

  //Statuses
  statuses$: Observable<Status[]> = new Observable<Status[]>();

  //estimatedLocations
  estimatedNestlocations$: Observable<EstimatedNestLocations[]> = new Observable<EstimatedNestLocations[]>();
  nestlocations$: Observable<Nestlocations[]> = new Observable<Nestlocations[]>();

  //The feature collections, the locations will be added in hare later in the code
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

  //Variables for the form of updating or adding a nest location
  formIsVisible = false; //Boolean if the form is visible or not
  formId: number = 0;
  nestForm: Nestlocations = {id: 0, statusId: 0, latitude: 0, longitude: 0}

  //The Constructor
  constructor(private nestLocationService: NestlocationService, private estimatedNestLocationService: EstimatedNestLocationService, private statusService: StatusService, private userBeehiveService: UserBeehiveService) {}
  
  //The innitial load
  ngOnInit(): void {
    
    //Requesting the necessary data from the API
    this.beehives$ = this.userBeehiveService.getAll(); //You get all the beehives via UserBeehive. So you only get the beehives from a specific user
    this.estimatedNestlocations$ = this.estimatedNestLocationService.getAllNests();
    this.nestlocations$ = this.nestLocationService.getAllNests();
    this.statuses$ = this.statusService.getAllStatuses();

    //Adding the beehives into feature collection
    this.beehives$.subscribe((locations: UserBeehive[]) => {
      locations.forEach(location => {
        this.beehiveJsonData.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.beehive.longitude, location.beehive.latitude] //adding the coordinates
          },
          properties: {
            title: location.beehive.beehiveName //Adding the beehive name, needed for the 
          }
        });
      });
    });
    
    //A foreach for checking all the nestlocations
    this.nestlocations$.forEach((locations: Nestlocations[]) => {
      locations.forEach(location => {
          if(location.statusId == 1){ //It checks if the statusId is equal to the detected status and adds it into the detected feature collection
            this.hornetLocationDetected.features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude] //Adding the coordinates into the feature collection
              },
              properties: {
                id: location.id //Adding the id into the collection, needed for the form
              }
            });
          }
          else if(location.statusId == 2){ //It checks if the statusId is equal to the found status and adds it into the found feature collection
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
          else if(location.statusId == 3){ //It checks if the statusId is equal to the removed status and adds it into the removed feature collection
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
    
    //For each loop for the estimated locations, the estimated locations are needed for the calculations but not for displaying information
    this.estimatedNestlocations$.forEach((locations: EstimatedNestLocations[]) => {
      locations.forEach(location => {
        this.estimatedHornetJsonLocation.features.push({ //It adds the estimated locations into the feature collection
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.estimatedLongitude, location.estimatedLatitude] //Coordinates are added to the feature collection
          },
          properties: {
            title: ''
          }
        });
      });
    });

    //Setup for the map
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken, //Secret access token for accessing the correct account
      container: 'map', //the tag used in the HTML to get and display the map
      style: this.style, //setup the style we defined earlier
      zoom: 13, //the zoomlevel when loading the map
      center: [this.lng, this.lat], //the coordinates of the map when loading in
      interactive: true, //setup that the map is interactive
    });

    //A function that triggers all needed function when the map loads
    this.map.on('load', () => {
      this.addGeoJsonLayer(); // Starting the fucnction for adding the layers
    });

    // A function that triggers when clicked
    this.map?.on('click', (event) => {
      // Query rendered features at the click location for multiple layers
      const layers = ['hornet-points-found', 'hornet-points-detected', 'hornet-points-cleared'];
      const features = this.map?.queryRenderedFeatures(event.point, { layers });
    
      // checks if clicked on one of the features
      if (features && features.length > 0) {
        const clickedFeature = features[0]; // gets the clicked feature id

        this.formIsVisible = true; //opens form for adding/editing
    
        // Check the layer ID to determine the action, checks which layer has been clicked
        switch (clickedFeature.layer!.id) {
          case 'hornet-points-found':
            this.formId = clickedFeature.properties!['id'];
            this.nestlocations$.subscribe((result: Nestlocations[]) => {
              const selectedNest = result.find(nest => nest.id === this.formId);
              if (!selectedNest) {
                console.error(`Nest with ID ${this.formId} not found`);
              } else {
                this.nestForm = selectedNest; //Sets the form
                this.nestForm.id = selectedNest.id; //Sets the Id for the form
              }            
            });
            break;
    
          case 'hornet-points-detected':
            this.formId = clickedFeature.properties!['id'];
            this.nestlocations$.subscribe((result: Nestlocations[]) => {
              const selectedNest = result.find(nest => nest.id === this.formId);
              if (!selectedNest) {
                console.error(`Nest with ID ${this.formId} not found`);
              } else {
                this.nestForm = selectedNest;
                this.nestForm.id = selectedNest.id;
              }    
            });
            break;
    
          case 'hornet-points-cleared':
            this.formId = clickedFeature.properties!['id'];
            this.nestlocations$.subscribe((result: Nestlocations[]) => {
              const selectedNest = result.find(nest => nest.id === this.formId);
              if (!selectedNest) {
                console.error(`Nest with ID ${this.formId} not found`);
              } else {
                this.nestForm = selectedNest;
                this.nestForm.id = selectedNest.id;
              }    
            });
            break;
        }
      }
      else{
        this.addPinpointMarker(event.lngLat.lng, event.lngLat.lat); //Starting function to add a new marker on the map
      }
    });
  }

  //Filter toggle function
  onOffFilter(fil: any){
    // Toggle the active state
    fil.active = !fil.active;

    // Update the map visibility based on active state
    if (this.map) {
        this.map.setLayoutProperty(fil.layerId, 'visibility', fil.active ? 'visible' : 'none');
    }

    // Find the index of the filter
    const filterIndex = this.filters.findIndex(f => f.name === fil.name);

    // Update the filter in the array if found
    if (filterIndex !== -1) {
        this.filters[filterIndex].active = fil.active;
    }
  }

  // Submit form function
  onSubmit() {
    if(this.formId != 0){ //Checks if need to add or edit data
      this.nestLocationService.putStatus(this.nestForm.id, this.nestForm).pipe(
        switchMap(() => this.updateGeoJsonData()), // Waits for updateGeoJsonData() to complete
      ).subscribe(() => {
        this.removeLayers(); // Removes the layers 
        this.closeModal(); //Closes the modal and adds the layers again
      });
    }
    else {
      this.nestLocationService.postNewNestLocation(this.nestForm).pipe(
        switchMap(() => this.updateGeoJsonData()), // Waits for updateGeoJsonData() to complete
      ).subscribe(() => {
        this.removeLayers();
        this.closeModal();
      });
    }
  }

  //Open edit mode, for placing an new marker
  openEditMode(){
    this.removeLayers(); // Same function, to remove the layers
    this.formIsVisible = false; //Adding/Edit form not visible anymore
  }

  //Closes the edit form
  closeModal() {
    this.nestForm = {id: 0, statusId: 0, latitude: 0, longitude: 0}; //Form data placed to base data
    this.formId = 0; //Id placed to base data
    this.formIsVisible = false; //Form placed to invisible
    this.addGeoJsonLayer(); //Adding the layers again with the new data
  }

  //Placing or editing the marker location
  addPinpointMarker(lng: number, lat: number) {
    // Update form with new coordinates
    this.nestForm.latitude = lat;
    this.nestForm.longitude = lng;
    this.formIsVisible = true;
  }

  // Delete function for the marker
  deleteMarker(){
    this.nestLocationService.deleteNestLocation(this.formId).pipe(
      switchMap(() => this.updateGeoJsonData()), // Waits for updateGeoJsonData() to complete
    ).subscribe(() => {
      this.removeLayers(); //Function for remove layers
      this.closeModal(); //Closes the modal
    });
  }

  //Calculates the distance based on the map location and earth radius
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

  //Adding the layers
  addGeoJsonLayer() {
    if (!this.map) { //Checks if the map exists
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

    //Adding the layer layout
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
        'circle-opacity': 0.6,
      }
    });

    this.map.addLayer({
      id: 'hornet-points-found',
      type: 'symbol',
      source: 'HornetLocationsFound',
      layout: {
        'icon-image': 'hornetnestFound', // Built-in Mapbox icon
        'icon-size': 1.5, // Adjust size if needed
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
    
    // this.map.addLayer({
    //   id: 'estimated-hornet-points',
    //   type: 'circle',
    //   source: 'EstimatedHornetLocations',
    //   paint: {
    //     'circle-radius': [
    //       'interpolate',
    //       ['linear'],
    //       ['zoom'],
    //       8, this.metersToPixelsAtZoom(100, 8),
    //       9, this.metersToPixelsAtZoom(100, 9),
    //       10, this.metersToPixelsAtZoom(100, 10),
    //       11, this.metersToPixelsAtZoom(100, 11),
    //       12, this.metersToPixelsAtZoom(100, 12),
    //       13, this.metersToPixelsAtZoom(100, 13),
    //       14, this.metersToPixelsAtZoom(100, 14),
    //       15, this.metersToPixelsAtZoom(100, 15),
    //       16, this.metersToPixelsAtZoom(100, 16),
    //       17, this.metersToPixelsAtZoom(100, 17),
    //       18, this.metersToPixelsAtZoom(100, 18),
    //       19, this.metersToPixelsAtZoom(100, 19),
    //       20, this.metersToPixelsAtZoom(100, 20),
    //       21, this.metersToPixelsAtZoom(100, 21),
    //       22, this.metersToPixelsAtZoom(100, 22),
    //     ],
    //     'circle-color': '#3b10c7', 
    //     'circle-opacity': 0.6 
    //   }
    // });

    // Add a layer to display the points
    this.map.addLayer({
      id: 'location-points',
      type: 'symbol',
      source: 'BeehiveLocations',
      layout: {
        'icon-image': 'beehivesmaller', // Built-in Mapbox icon
        'icon-size': 1.5, // Adjust size if needed
        'icon-offset': [0, -20], // Optional offset
        'text-field': ['get', 'title'], // Show the location name as text
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 16,
        'text-offset': [0, -4],
        'visibility': 'visible'
      },
      paint: {
        'text-color': '#855a01',  // Set text color
        'text-halo-color': '#ffffff', // Optional halo around the text
        'text-halo-width': 2, // Optional halo width for better visibility
      }
    }); 
  }

  //Updating the data
  updateGeoJsonData(): Observable<void> {
    return new Observable(observer => {
      // Reset GeoJSON objects to avoid duplicates
      this.hornetLocationDetected = { type: 'FeatureCollection', features: [] };
      this.hornetLocationFound = { type: 'FeatureCollection', features: [] };
      this.hornetLocationCleared = { type: 'FeatureCollection', features: [] };
      this.nestlocations$ = this.nestLocationService.getAllNests();
  
      this.nestlocations$.pipe(
        // Ensure we process the data before continuing
        tap((locations: Nestlocations[]) => {
          locations.forEach(location => {
            if (location.statusId == 1) {
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
            } else if (location.statusId == 2) {
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
            } else if (location.statusId == 3) {
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

        })
      ).subscribe({
        next: () => {
          observer.next(); // Signals that the data update is complete
          observer.complete(); // Ends the observable
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
  
  // Remove layers
  removeLayers() {
    //Checks if the map exists
    if (!this.map) return;
  
    //List of all the layers
    const layersToRemove = [
      'hornet-points-detected',
      'hornet-points-found',
      'hornet-points-cleared',
      'estimated-hornet-points',
      'location-points'
    ];
  
    //List of all the sources
    const sourcesToRemove = [
      'HornetLocationsDetected',
      'HornetLocationsFound',
      'HornetLocationsCleared',
      'EstimatedHornetLocations',
      'BeehiveLocations'
    ];
  
    // Remove layers if they exist
    layersToRemove.forEach(layerId => {
      if (this.map!.getLayer(layerId)) {
        console.log("remove" + layerId)
        this.map!.removeLayer(layerId);
      }
    });
  
    // Remove sources if they exist
    sourcesToRemove.forEach(sourceId => {
      if (this.map!.getSource(sourceId)) {
        this.map!.removeSource(sourceId);
      }
    });
  }
}
