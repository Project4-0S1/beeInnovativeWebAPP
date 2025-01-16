import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { MapComponent } from './map/map.component';
import { APIComponent } from './api/api.component';

export const routes: Routes = [
    { path: 'Kaart', component: MapComponent, canActivate: [AuthGuard] },
    { path: 'api', component: APIComponent },
  // Add other routes here
];
