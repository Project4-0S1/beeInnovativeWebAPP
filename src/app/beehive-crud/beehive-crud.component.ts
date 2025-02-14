// Import necessary modules and components
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserBeehive } from '../interfaces/user-beehive';
import { UserBeehiveService } from '../services/user-beehive.service';
import { BeehiveFormComponent } from '../beehive-form/beehive-form.component';
import { BeehiveService } from '../services/beehive.service';
import { Beehive } from '../interfaces/beehive';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-beehive-crud',
  standalone: true,
  imports: [CommonModule, BeehiveFormComponent, FormsModule, RouterModule],
  templateUrl: './beehive-crud.component.html',
  styleUrl: './beehive-crud.component.css'
})
export class BeehiveCrudComponent implements OnInit {
  // Define observables for beehives, current beehive, new user beehive, and user
  beehives$: Observable<UserBeehive[]> = new Observable<UserBeehive[]>();
  currentBeehive: Observable<Beehive> = new Observable<Beehive>();
  newUserBeehive: Observable<UserBeehive> = new Observable<UserBeehive>();
  user:Observable<User> = new Observable<User>;

  // Define flags for form visibility and add new beehive
  isFormVisible = false;
  isAddNew = false;
  EditingBeehiveId = 0;
  EditingBeehiveAngle = 0;
  
  // Define a map to store snapshot URLs for beehives
  snapshotUrls: Map<number, string> = new Map();  

  // Constructor to inject necessary services
  constructor(private ub: UserBeehiveService, private beehiveService: BeehiveService, private http: HttpClient, public auth: AuthService, private users: UserService) {}

  // Initialize the component
  ngOnInit(): void{
    // Get all beehives from the UserBeehiveService
    this.beehives$ = this.ub.getAll();

    // Subscribe to the beehives observable and capture snapshots for each beehive
    this.beehives$.subscribe(beehives => {
      beehives.forEach(beehive => {
        this.captureSnapshot(beehive.beehiveId, beehive.beehive.latitude, beehive.beehive.longitude);
      });
    });
  }

  // Open the form for adding or editing a beehive
  openForm(type: boolean) {
    this.isFormVisible = true;
    
    // Set the add new flag based on the type
    if(type){
      this.isAddNew = true
    }
    else{
      this.isAddNew = false
    }
  }

  // Close the form
  closeForm() {
    this.isFormVisible = false; 
  }

  // Capture a snapshot for a beehive
  captureSnapshot(beehiveId: number, latitude: number, longitude: number) {
    // Define the width, height, and zoom for the snapshot
    const width = 200;
    const height = 200;
    const mapboxToken = environment.mapbox.accessToken;
    const zoom = 12;

    // Create a GeoJSON object for the beehive location
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

  // Handle form submission
  handleFormSubmit(formData: any) {
    if(formData.formIotDevice == ''){
      this.currentBeehive = this.beehiveService.getBeehiveById(formData.beehiveId);
    }
    // Chain observables using switchMap
    else{
      this.currentBeehive = this.beehiveService.getBeehiveByIotId(formData.formIotDevice);
    }
    
    // Chain observables to update the beehive and add a new user connection
    this.auth.user$
    .pipe(
      take(1), // Ensure we take only one value
      switchMap((user) => {
        if (!user || !user.sub) {
          throw new Error('User not found');
        }

        // Fetch user from service (returns an Observable<User>)
        return this.users.getBeehiveByIotId(user.sub!).pipe(
          map((fetchedUser) => {
            if (!fetchedUser || !fetchedUser['id']) {
              throw new Error('Fetched user does not have an ID');
            }
            return fetchedUser['id']; // Extract user ID
          })
        );
      }),
      switchMap((userId) =>
        this.currentBeehive.pipe(
          switchMap((beehive) => {
            if(formData.name != ''){
              beehive.beehiveName = formData.name;
              beehive.angle = formData.angle;
            }
            else{
              beehive.beehiveName = beehive.beehiveName
            }
            // Update the beehive using the BeehiveService
            return this.beehiveService.putBeehive(beehive.iotId, beehive).pipe(
              tap((response) =>
                console.log('Beehive updated successfully:', response)
              ),
              switchMap(() =>
                of({
                  beehiveId: beehive.id,
                  userId: userId, // Use the extracted user ID
                } as UserBeehive)
              )
            );
          }),
          switchMap((newUserBeehive) =>
            this.ub.postNewUserConnection(newUserBeehive).pipe(
              tap((response) => console.log('User successfully added:', response))
            )
          )
        )
      )
    )
    .subscribe({
      complete: () => {
        console.log('All operations completed successfully.');
        this.closeForm();
        this.ngOnInit();
      },
      error: (err) => console.error('An error occurred:', err),
    });      
  }
  // Start editing a beehive
  startEditing(b: number, editType: Boolean) {
    if(editType){
      this.EditingBeehiveId = b;
    }
    else{
      this.EditingBeehiveAngle = b
    }
  }
  // Delete a user beehive connection
  deleteConnection(id: number){
    this.ub.deleteUserBeehiveConnection(id).subscribe({
      complete: () => {
        console.log("comeplete")
      },
      error: (err) => console.log('error', err)
    });

    this.ngOnInit();
  }

  // Save changes to a beehive
  saveChanges(beehive: Beehive) {
    delete beehive.hornetDetections;
    delete beehive.userBeehives;

    this.beehiveService.putBeehive(beehive.iotId, beehive).subscribe({
      complete: () => {
        console.log("comeplete")
      },
      error: (err) => console.log('error', err)
    })

    this.EditingBeehiveId = 0;
    this.EditingBeehiveAngle = 0;
  }

  // Check if a date is older than 24 hours
  isOlderThan24Hours(lastCall: string): boolean {
    if (!lastCall) return false; // Handle null or undefined

    const lastCallDate = new Date(lastCall); // Convert string to Date
    const currentTime = new Date();

    if(lastCallDate.getDate() == currentTime.getDate()){
        return false;
    }
    else{
      const differenceInHours = (currentTime.getTime() - lastCallDate.getTime()) / (1000 * 60 * 60);
    
      return differenceInHours > 24;

    }
  }


}
