import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  {
    path: 'todos',
    loadChildren: () => import('./todos/todos-module').then(m => m.TodosModule)
  },
  {
    path: 'persons',
    loadChildren: () => import('./persons/persons-module').then(m => m.PersonsModule)
  }
];
