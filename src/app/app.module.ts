import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';
import { authConfig } from './auth.config';

@NgModule({
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
      redirectUri: authConfig.redirectUri,
    }),
  ],
  providers: [],
})
export class AppModule {}
