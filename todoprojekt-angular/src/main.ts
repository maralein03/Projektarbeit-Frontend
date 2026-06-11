import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { KeycloakService } from './app/services/keycloak';
import { APP_INITIALIZER } from '@angular/core';

const keycloakFactory = (keycloak: KeycloakService) => () => keycloak.init();

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakFactory,
      deps: [KeycloakService],
      multi: true
    }
  ]
})
  .catch((err) => console.error(err));
