import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'Kaart', component: MapComponent, canActivate: [AuthGuard] },
  // Add other routes here
];
