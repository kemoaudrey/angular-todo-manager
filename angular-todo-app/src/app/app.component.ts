import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    TranslocoModule,
    LanguageSwitcherComponent,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'angular-todo-app';
}
