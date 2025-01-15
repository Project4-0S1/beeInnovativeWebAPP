import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: 'kaart', component: MapComponent },
    { path: 'admin', component: AdminComponent },
];
