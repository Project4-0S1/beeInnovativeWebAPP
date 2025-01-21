import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { MapComponent } from './map/map.component';
import { BeehiveCrudComponent } from './beehive-crud/beehive-crud.component';

export const routes: Routes = [
    { path: 'kaart', component: MapComponent, canActivate: [AuthGuard] },
    { path: 'crud', component: BeehiveCrudComponent, canActivate: [AuthGuard]}
];
