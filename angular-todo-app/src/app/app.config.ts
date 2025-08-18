import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    importProvidersFrom(
      // BrowserAnimationsModule,
      HttpClientModule,
      TranslocoRootModule
    )
  ]
};
