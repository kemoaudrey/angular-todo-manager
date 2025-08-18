import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { Settings } from 'angular2-smart-table';
import { Todo } from '../../models/todo.model';
import { Priority, Label } from '../../models/enums';
import { TodoService } from '../../services/todo.service';
import { TodoModalComponent } from '../todo-modal/todo-modal.component';
import { ExportService } from '../../services/export.service';
import { LocalDataSource } from 'angular2-smart-table';
import { LanguageSwitcherComponent } from '../../shared/language-switcher/language-switcher.component';
import { Angular2SmartTableModule } from 'angular2-smart-table';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    LanguageSwitcherComponent,
    Angular2SmartTableModule,

    // Material modules
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  selectedPriority: string = '';
  selectedLabel: string = '';
  priorities = Object.values(Priority);
  labels = Object.values(Label);

  exportToExcel(): void {
    this.todoService.getTodos().subscribe(todos => {
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

settings: Settings = {
  mode: 'external',
  actions: {
    add: false, // You have your own add button
    edit: true,
    delete: true,
    position: 'right',
    columnTitle: 'Actions' // Optional column title for actions
  },
  edit: {
    editButtonContent: '<i class="material-icons">edit</i>',
    saveButtonContent: '<i class="material-icons">check</i>',
    cancelButtonContent: '<i class="material-icons">clear</i>',
    confirmSave: true
  },
    delete: {
      deleteButtonContent: '<i class="material-icons text-red-500">delete</i>',
      confirmDelete: true
    },
    columns: {
    titre: {
      title: 'Title',
      type: 'text',
      width: '20%',
       filter: {
        type: 'text' // Changed from boolean to filter configuration
      }
    },
      personName: {
  title: 'Assigned To',
  type: 'text',
  width: '15%',
  valuePrepareFunction: (cell: any, row: any) => {
    return row.person?.name || ''; // ✅ row est ton Todo
  },
  filter: { type: 'text' }
},
      startDate: {
        title: 'Start Date',
        type: 'text',
        width: '12%',
        valuePrepareFunction: (value: Date) => {
          return new Date(value).toLocaleDateString();
        }
      },
      endDate: {
        title: 'End Date',
        type: 'text',
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
    { field: 'titre', search: filterValue },
    { field: 'description', search: filterValue }
  ], false); // Added third parameter
}

filterByPriority(): void {
  this.source.setFilter([
    { field: 'priority', search: this.selectedPriority }
  ], false);
}

filterByLabel(): void {
  this.source.setFilter([
    { field: 'labels', search: this.selectedLabel }
  ], false);
}

  clearAllFilters(): void {
    this.selectedPriority = '';
    this.selectedLabel = '';
    this.source.reset();
  }
}
