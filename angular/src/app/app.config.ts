import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';

import { appRoutes } from './app.routes';
import { provideRouter, withRouterConfig } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { UmpireState } from './store/state/umpire.state';

export namespace AppConfig {
  // REST PHP
  export const PRODUCTION_PHP_REST_URL: string = 'php_rest/';
  export const LOCAL_PHP_REST_URL: string = 'http://localhost:8080/';

  export const PHP_SUFFIX: string = '.php';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(NgxsModule.forRoot([UmpireState])),
  ],
};
