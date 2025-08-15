import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { Todo } from '../../models/todo.model';
import { Priority, Label } from '../../models/enums';
import { TodoService } from '../../services/todo.service';
import { TodoModalComponent } from '../todo-modal/todo-modal.component';
import { ExportService } from '../../services/export.service';
@Component({
  selector: 'app-todo-list',
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800" *transloco="'todo.title'">Todo Management</h2>
        <div class="flex gap-3 items-center">
        <app-language-switcher></app-language-switcher>

         <button
      mat-stroked-button
      color="accent"
      (click)="exportToExcel()"
      class="text-green-600 border-green-600">
      <mat-icon>download</mat-icon>
      <span *transloco="'common.exportExcel'">Export to Excel</span>
    </button>

    <button
      mat-stroked-button
      color="accent"
      (click)="exportToPDF()"
      class="text-red-600 border-red-600">
      <mat-icon>picture_as_pdf</mat-icon>
      <span *transloco="'common.exportPDF'">Export to PDF</span>
    </button>

         <button
      mat-raised-button
      color="primary"
      (click)="openTodoModal()"
      class="bg-blue-500 hover:bg-blue-600">
      <mat-icon>add</mat-icon>
      <span *transloco="'todo.addNew'">Add New Task</span>
    </button>
  </div>
</div>

      <!-- Filters Panel -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <mat-form-field class="w-full">
            <mat-label>Search</mat-label>
            <input matInput (keyup)="applyGlobalFilter($event)" placeholder="Search tasks">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Priority</mat-label>
            <mat-select [(value)]="selectedPriority" (selectionChange)="filterByPriority()">
              <mat-option value="">All Priorities</mat-option>
              <mat-option *ngFor="let priority of priorities" [value]="priority">
                {{priority}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Label</mat-label>
            <mat-select [(value)]="selectedLabel" (selectionChange)="filterByLabel()">
              <mat-option value="">All Labels</mat-option>
              <mat-option *ngFor="let label of labels" [value]="label">
                {{label}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button
            mat-button
            (click)="clearAllFilters()"
            class="h-fit mt-4 md:mt-0">
            Clear All Filters
          </button>
        </div>
      </div>

      <!-- Smart Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <ng2-smart-table
          [settings]="settings"
          [source]="source"
          (userRowSelect)="onRowSelect($event)"
          (deleteConfirm)="onDeleteConfirm($event)"
          class="w-full">
        </ng2-smart-table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
    }

    ::ng-deep .ng2-smart-table {
      font-family: inherit;
    }

    ::ng-deep .ng2-smart-table th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    ::ng-deep .ng2-smart-table td {
      padding: 12px 8px;
    }

    ::ng-deep .ng2-smart-table .ng2-smart-action {
      display: inline-block;
      margin: 0 2px;
    }

    ::ng-deep .ng2-smart-table tbody tr:hover {
      background-color: #f9fafb;
    }
  `]
})
export class TodoListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  selectedPriority: string = '';
  selectedLabel: string = '';
  priorities = Object.values(Priority);
  labels = Object.values(Label);

  exportToExcel(): void {
  this.todoService.getTodos().subscribe(todos => {
    // Apply current filters to export data
    let filteredTodos = todos;

    if (this.selectedPriority) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === this.selectedPriority);
    }

    if (this.selectedLabel) {
      filteredTodos = filteredTodos.filter(todo => todo.labels.includes(this.selectedLabel as any));
    }

    this.exportService.exportTodosToExcel(filteredTodos, `todos_${new Date().toISOString().split('T')[0]}`);
  });
}

exportToPDF(): void {
  this.todoService.getTodos().subscribe(todos => {
    // Apply current filters to export data
    let filteredTodos = todos;

    if (this.selectedPriority) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === this.selectedPriority);
    }

    if (this.selectedLabel) {
      filteredTodos = filteredTodos.filter(todo => todo.labels.includes(this.selectedLabel as any));
    }

    this.exportService.exportTodosToPDF(filteredTodos, `todos_${new Date().toISOString().split('T')[0]}`);
  });
}

  settings = {
    mode: 'external',
    actions: {
      add: false,
      position: 'right'
    },
    edit: {
      editButtonContent: '<i class="material-icons text-blue-500">edit</i>',
      saveButtonContent: '<i class="material-icons text-green-500">check</i>',
      cancelButtonContent: '<i class="material-icons text-red-500">close</i>',
    },
    delete: {
      deleteButtonContent: '<i class="material-icons text-red-500">delete</i>',
      confirmDelete: true
    },
    columns: {
      titre: {
        title: 'Title',
        type: 'string',
        width: '20%'
      },
      personName: {
        title: 'Assigned To',
        type: 'string',
        width: '15%',
        valuePrepareFunction: (value: any, row: Todo) => {
          return row.person.name;
        }
      },
      startDate: {
        title: 'Start Date',
        type: 'string',
        width: '12%',
        valuePrepareFunction: (value: Date) => {
          return new Date(value).toLocaleDateString();
        }
      },
      endDate: {
        title: 'End Date',
        type: 'string',
        width: '12%',
        valuePrepareFunction: (value: Date | null) => {
          return value ? new Date(value).toLocaleDateString() : 'Not completed';
        }
      },
      priority: {
        title: 'Priority',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (value: Priority) => {
          const colors = {
            [Priority.FACILE]: 'bg-green-100 text-green-800',
            [Priority.MOYEN]: 'bg-yellow-100 text-yellow-800',
            [Priority.DIFFICILE]: 'bg-red-100 text-red-800'
          };
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${colors[value]}">${value}</span>`;
        }
      },
      labels: {
        title: 'Labels',
        type: 'html',
        width: '18%',
        valuePrepareFunction: (value: Label[]) => {
          const colors = {
            [Label.HTML]: 'bg-orange-100 text-orange-800',
            [Label.CSS]: 'bg-blue-100 text-blue-800',
            [Label.NODE_JS]: 'bg-green-100 text-green-800',
            [Label.JQUERY]: 'bg-purple-100 text-purple-800'
          };
          return value.map(label =>
            `<span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${colors[label]} mr-1 mb-1">${label}</span>`
          ).join('');
        }
      },
      completed: {
        title: 'Status',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (value: boolean) => {
          return value
            ? '<span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>'
            : '<span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>';
        }
      }
    },
    pager: {
      display: true,
      perPage: 10
    }
  };

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.source.load(todos);
    });
  }

  onRowSelect(event: any): void {
    this.openTodoModal(event.data);
  }

  onDeleteConfirm(event: any): void {
    if (confirm(`Are you sure you want to delete "${event.data.titre}"?`)) {
      this.todoService.deleteTodo(event.data.id).subscribe(() => {
        event.confirm.resolve();
        this.loadTodos();
      });
    } else {
      event.confirm.reject();
    }
  }

  openTodoModal(todo?: Todo): void {
    const dialogRef = this.dialog.open(TodoModalComponent, {
      width: '800px',
      data: todo || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTodos();
      }
    });
  }

  applyGlobalFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.setFilter([
      {
        field: 'titre',
        search: filterValue
      },
      {
        field: 'description',
        search: filterValue
      }
    ], false);
  }

  filterByPriority(): void {
    if (this.selectedPriority) {
      this.source.setFilter({
        field: 'priority',
        search: this.selectedPriority
      });
    } else {
      this.source.setFilter({
        field: 'priority',
        search: ''
      });
    }
  }

  filterByLabel(): void {
    if (this.selectedLabel) {
      this.source.setFilter({
        field: 'labels',
        search: this.selectedLabel
      });
    } else {
      this.source.setFilter({
        field: 'labels',
        search: ''
      });
    }
  }

  clearAllFilters(): void {
    this.selectedPriority = '';
    this.selectedLabel = '';
    this.source.reset();
  }
}
