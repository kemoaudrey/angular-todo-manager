import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';
import { PersonModalComponent } from '../person-modal/person-modal.component';
import { ExportService } from '../../services/export.service';

@Component({
 selector: 'app-person-list',
  standalone: true,
   imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
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
