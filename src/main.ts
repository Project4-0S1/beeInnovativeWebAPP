import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';
import { authConfig } from './app/auth.config';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAuth0({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
      authorizationParams: {
        redirect_uri: authConfig.redirectUri,
      },
    }),
  ],
})
  .catch((err) => console.error(err));
