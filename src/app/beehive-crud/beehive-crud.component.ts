import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserBeehive } from '../interfaces/user-beehive';
import { UserBeehiveService } from '../services/user-beehive.service';
import { BeehiveFormComponent } from '../beehive-form/beehive-form.component';
import { BeehiveService } from '../services/beehive.service';
import { Beehive } from '../interfaces/beehive';
import { switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-beehive-crud',
  standalone: true,
  imports: [CommonModule, BeehiveFormComponent, FormsModule],
  templateUrl: './beehive-crud.component.html',
  styleUrl: './beehive-crud.component.css'
})
export class BeehiveCrudComponent implements OnInit {
  beehives$: Observable<UserBeehive[]> = new Observable<UserBeehive[]>();
  currentBeehive: Observable<Beehive> = new Observable<Beehive>();
  newUserBeehive: Observable<UserBeehive> = new Observable<UserBeehive>();

  isFormVisible = false;
  EditingBeehiveId = 0;

  
  snapshotUrls: Map<number, string> = new Map();
  

  constructor(private ub: UserBeehiveService, private beehiveService: BeehiveService, private http: HttpClient) {}

  ngOnInit(): void{
    this.beehives$ = this.ub.getAll();

    this.beehives$.subscribe(beehives => {
      beehives.forEach(beehive => {
        this.captureSnapshot(beehive.beehiveId, beehive.beehive.latitude, beehive.beehive.longitude);
      });
    });
  }

  openForm() {
    this.isFormVisible = true;
  }

  closeForm() {
    this.isFormVisible = false; 
  }


  captureSnapshot(beehiveId: number, latitude: number, longitude: number) {
    const width = 200;
    const height = 200;
    const mapboxToken = environment.mapbox.accessToken;
    const zoom = 12;

    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {
            title: "Beehive Location", // Text to display
            'icon-image': 'map-marker-svgrepo-com', // Custom marker name from your Mapbox Studio style
          },
        },
      ],
    };
    
  
    // Encode GeoJSON data as a string
    const geojsonString = encodeURIComponent(JSON.stringify(geojson));

    // Construct the URL for the Static API
    const url = `https://api.mapbox.com/styles/v1/jorrit-geurts/cm66hjbon00f001s7cuxpft2p/static/geojson(${geojsonString})/${longitude},${latitude},${zoom},0,0/${width}x${height}?access_token=${mapboxToken}`;

    // Store the snapshot URL for this beehive
    this.snapshotUrls.set(beehiveId, url);  
  }

  handleFormSubmit(formData: any) {
    // Chain observables using switchMap
    this.currentBeehive = this.beehiveService.getBeehiveById(formData.beehiveId);

    this.currentBeehive
      .pipe(
        // Update the beehive
        switchMap((beehive) => {
          beehive.beehiveName = formData.name;
          return this.beehiveService.putCategory(beehive.id, beehive).pipe(
            tap((response) => console.log('Beehive updated successfully:', response)),

            // Emit a new UserBeehive object for the next step
            switchMap(() =>
              of({
                beehiveId: formData.beehiveId,
                userId: 1,
              } as UserBeehive)
            )
          );
        }),

        // Post the new UserBeehive connection
        switchMap((newUserBeehive) =>
          this.ub.postNewUserConnection(newUserBeehive).pipe(
            tap((response) =>
              console.log('User successfully added:', response)
            )
          )
        )
      )
      .subscribe({
        complete: () => {
          console.log('All operations completed successfully.');
          this.closeForm();
          
          window.location.reload();
        },
        error: (err) => console.error('An error occurred:', err),
      });

      
  }

  startEditing(b: number) {
    this.EditingBeehiveId = b;
  }

  saveChanges(beehive: Beehive) {
    delete beehive.hornetDetections;
    delete beehive.userBeehives;

    this.beehiveService.putCategory(beehive.id, beehive).subscribe({
      complete: () => {
        console.log("comeplete")
      },
      error: (err) => console.log('error', err)
    })

    this.EditingBeehiveId = 0;
  }
}
