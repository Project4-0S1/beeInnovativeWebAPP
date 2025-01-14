import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  // Add other routes here
];
