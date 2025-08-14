import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
