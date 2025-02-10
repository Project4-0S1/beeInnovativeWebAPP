import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { MapComponent } from './map/map.component';
import { BeehiveCrudComponent } from './beehive-crud/beehive-crud.component';
import { DetectionsComponent } from './detections/detections.component';

export const routes: Routes = [
    { path: '', component: MapComponent, canActivate: [AuthGuard] },
    { path: 'crud', component: BeehiveCrudComponent, canActivate: [AuthGuard] },
    { path: 'detections/:beehiveId', component: DetectionsComponent, canActivate: [AuthGuard] }
];
