import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Angular2SmartTableModule } from 'angular2-smart-table';
import { TranslocoModule } from '@jsverse/transloco';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TodosRoutingModule } from './todos-routing-module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoModalComponent } from './todo-modal/todo-modal.component';
import { LanguageSwitcherComponent } from '../shared/language-switcher/language-switcher.component';
@NgModule({
  declarations: [],
  imports: [

    LanguageSwitcherComponent,
    TodoListComponent,
    TodoModalComponent,
    CommonModule,
    TodosRoutingModule,

    ReactiveFormsModule,
    FormsModule,
    Angular2SmartTableModule,
    TranslocoModule,

    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTooltipModule
  ]
})
export class TodosModule { }
