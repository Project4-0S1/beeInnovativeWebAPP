import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { APIComponent } from './api/api.component';

export const routes: Routes = [
    { path: 'Kaart', component: MapComponent },
    { path: 'api', component: APIComponent },
  // Add other routes here
];
