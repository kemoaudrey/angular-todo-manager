// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco, TranslocoLoader, TRANSLOCO_MISSING_HANDLER } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppComponent } from './app/app.component';
import { Observable } from 'rxjs';
import 'zone.js';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
// Loader custom
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideTransloco({
      config: {
        availableLangs: ['en', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoHttpLoader,
    }),

    {
      provide: TRANSLOCO_MISSING_HANDLER,
      useValue: {
        handle: (key: string) => `Missing: ${key}`,
      },
    },
  ],
});
