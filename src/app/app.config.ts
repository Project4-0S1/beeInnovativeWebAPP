import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment'

const domain = environment.AUTH0_DOMAIN
const clientId = environment.AUTH0_CLIENT_ID;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAuth0({
      domain: domain,
      clientId: clientId,
      authorizationParams: {
        redirect_uri: environment.redirectUri
      }
    }),
  ]
};
