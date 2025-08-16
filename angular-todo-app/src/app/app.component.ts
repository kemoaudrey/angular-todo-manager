import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher.component';
@Component({
   selector: 'app-root',
  standalone: true,  // Mark as standalone
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    LanguageSwitcherComponent  // Import the language switcher
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation Header -->
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-800" *transloco="'navigation.title'">
                  Todo Management System
                </h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  routerLink="/todos"
                  routerLinkActive="border-blue-500 text-blue-600"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  *transloco="'navigation.tasks'">
                  Tasks
                </a>
                <a
                  routerLink="/persons"
                  routerLinkActive="border-blue-500 text-blue-600"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  *transloco="'navigation.people'">
                  People
                </a>
              </div>
            </div>

            <!-- Language Switcher in Navigation -->
            <div class="flex items-center">
              <app-language-switcher></app-language-switcher>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="py-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .router-link-active {
      border-color: #3b82f6;
      color: #2563eb;
    }
  `]
})
export class AppComponent {
  title = 'angular-todo-app';
}
