import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthHttpInterceptor, provideAuth0 } from '@auth0/auth0-angular';

import { environment } from '../environments/environment'

const domain = environment.AUTH0_DOMAIN
const clientId = environment.AUTH0_CLIENT_ID;

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAuth0({
      domain: domain,
      clientId: clientId,
      authorizationParams: {
        audience: environment.AUTH0_AUDIENCE,
        redirect_uri: environment.redirectUri
      },
      httpInterceptor: {
        allowedList: [
          `${environment.api_url}beehives`,
          `${environment.api_url}beehives/*`,
          `${environment.api_url}estimatednestlocations`,
          `${environment.api_url}estimatednestlocations/*`,
          `${environment.api_url}HornetDetections`,
          `${environment.api_url}HornetDetections/*`,
          `${environment.api_url}nestlocations`,
          `${environment.api_url}nestlocations/*`,
          `${environment.api_url}UserBeehives`,
          `${environment.api_url}UserBeehives/*`,
          `${environment.api_url}Status`,
          `${environment.api_url}Status/*`,
          `${environment.api_url}users`,
          `${environment.api_url}users/*`,
        ]
      }
    }),
  ]
};
