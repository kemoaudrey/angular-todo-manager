import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PersonsRoutingModule } from './persons-routing-module';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonModalComponent } from './person-modal/person-modal.component';

@NgModule({
  declarations: [
    PersonListComponent,
    PersonModalComponent
  ],
  imports: [
    CommonModule,
    PersonsRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class PersonsModule { }
