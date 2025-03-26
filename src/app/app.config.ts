import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Importez cette ligne

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { CalendarModule } from 'angular-calendar';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient() ,// Ajoutez cette ligne pour fournir HttpClient globalement

    importProvidersFrom(
      CalendarModule 
    ),
    provideClientHydration()]
};
