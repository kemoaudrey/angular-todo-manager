// language-switcher.component.ts
import { Component } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
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
