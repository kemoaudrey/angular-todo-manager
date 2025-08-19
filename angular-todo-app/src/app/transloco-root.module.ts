import { HttpClient } from '@angular/common/http';
import {
  provideTransloco,
  Translation,
  TranslocoLoader,
  TRANSLOCO_MISSING_HANDLER,
  TranslocoModule,
} from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { Injectable, NgModule } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
       provideTransloco({
      config: {
        availableLangs: ['en', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        fallbackLang: 'en',
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

  ]
})
export class TranslocoRootModule {}
