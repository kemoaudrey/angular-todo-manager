import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoModule // Add this import
  ],
  template: `
    <mat-form-field class="w-32">
      <mat-label>{{ 'common.language' | transloco }}</mat-label>
      <mat-select [value]="currentLang" (selectionChange)="changeLang($event.value)">
        <mat-option value="en">English</mat-option>
        <mat-option value="fr">Français</mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  currentLang: string = 'en';
  private langChangeSubscription?: Subscription;

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    // Get initial language
    this.currentLang = this.translocoService.getActiveLang();

    // Subscribe to language changes to keep the component in sync
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(activeLang => {
      this.currentLang = activeLang;
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  changeLang(lang: string): void {
    if (lang && lang !== this.currentLang) {
      this.translocoService.setActiveLang(lang);
      this.currentLang = lang;
    }
  }
}
