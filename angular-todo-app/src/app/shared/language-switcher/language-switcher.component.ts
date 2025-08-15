import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-language-switcher',
  template: `
    <mat-form-field class="w-32">
      <mat-label>Language</mat-label>
      <mat-select [value]="currentLang" (selectionChange)="changeLang($event.value)">
        <mat-option value="en">English</mat-option>
        <mat-option value="fr">Français</mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class LanguageSwitcherComponent {
  currentLang: string;

  constructor(private translocoService: TranslocoService) {
    this.currentLang = this.translocoService.getActiveLang();
  }

  changeLang(lang: string): void {
    this.translocoService.setActiveLang(lang);
    this.currentLang = lang;
  }
}
