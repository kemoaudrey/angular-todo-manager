// src/app/persons/person-list/person-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';
import { PersonModalComponent } from '../person-modal/person-modal.component';

@Component({
  selector: 'app-person-list',
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Persons Management</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="openPersonModal()"
          class="bg-blue-500 hover:bg-blue-600">
          <mat-icon>add</mat-icon>
          Add New Person
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <mat-form-field class="w-full">
            <mat-label>Search by Name</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Enter name">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Search by Email</mat-label>
            <input matInput (keyup)="applyEmailFilter($event)" placeholder="Enter email">
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <button
            mat-button
            (click)="clearFilters()"
            class="h-fit mt-4 md:mt-0">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table mat-table [dataSource]="dataSource" class="w-full">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Name</th>
            <td mat-cell *matCellDef="let person" class="py-3">{{person.name}}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Email</th>
            <td mat-cell *matCellDef="let person" class="py-3">{{person.email}}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Phone</th>
            <td mat-cell *matCellDef="let person" class="py-3">{{person.phone}}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Actions</th>
            <td mat-cell *matCellDef="let person" class="py-3">
              <div class="flex gap-2">
                <button
                  mat-icon-button
                  color="primary"
                  (click)="openPersonModal(person)"
                  matTooltip="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deletePerson(person)"
                  matTooltip="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>

        </table>

        <mat-paginator
          [pageSizeOptions]="[5, 10, 20]"
          showFirstLastButtons
          class="border-t">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class PersonListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Person>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private personService: PersonService,
    private dialog: MatDialog,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  exportPersonsToExcel(): void {
  this.personService.getPersons().subscribe(persons => {
    this.exportService.exportPersonsToExcel(persons, `persons_${new Date().toISOString().split('T')[0]}`);
  });
}

exportPersonsToPDF(): void {
  this.personService.getPersons().subscribe(persons => {
    this.exportService.exportPersonsToPDF(persons, `persons_${new Date().toISOString().split('T')[0]}`);
  });
}

  loadPersons(): void {
    this.personService.getPersons().subscribe(persons => {
      this.dataSource.data = persons;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyEmailFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Person, filter: string) => {
      return data.email.toLowerCase().includes(filter.toLowerCase());
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilters(): void {
    this.dataSource.filter = '';
    this.dataSource.filterPredicate = (data: Person, filter: string) => {
      return data.name.toLowerCase().includes(filter.toLowerCase()) ||
             data.email.toLowerCase().includes(filter.toLowerCase()) ||
             data.phone.toLowerCase().includes(filter.toLowerCase());
    };
  }

  openPersonModal(person?: Person): void {
    const dialogRef = this.dialog.open(PersonModalComponent, {
      width: '600px',
      data: person || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPersons();
      }
    });
  }

  deletePerson(person: Person): void {
    if (confirm(`Are you sure you want to delete ${person.name}?`)) {
      this.personService.deletePerson(person.id!).subscribe(() => {
        this.loadPersons();
      });
    }
  }
}
