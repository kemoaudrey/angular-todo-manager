import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { Person } from '../../models/person.model';
import { Priority, Label } from '../../models/enums';
import { TodoService } from '../../services/todo.service';
import { PersonService } from '../../services/person.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Angular Material Modules
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './todo-modal.component.html',
  styleUrls: ['./todo-modal.component.scss']
})
export class TodoModalComponent implements OnInit {
  todoForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  isCompleted = false;

  priorities = Object.values(Priority);
  labelOptions = Object.values(Label);

  persons: Person[] = [];
  filteredPersons!: Observable<Person[]>;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private personService: PersonService,
    private dialogRef: MatDialogRef<TodoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Todo | null
  ) {
    this.isEditMode = !!data;
    this.isCompleted = !!data?.completed;
  }

  ngOnInit(): void {
    this.loadPersons();
    this.initializeForm();
    this.setupPersonAutocomplete();
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe(persons => {
      this.persons = persons;
    });
  }

  initializeForm(): void {
    this.todoForm = this.fb.group({
      titre: [
        this.data?.titre || '',
        [Validators.required, this.minLengthTrimmed(3)]
      ],
      person: [
        this.data?.person || null,
        [Validators.required]
      ],
      startDate: [
        this.data?.startDate ? new Date(this.data.startDate) : null,
        [Validators.required]
      ],
      endDate: [
        this.data?.endDate ? new Date(this.data.endDate) : null
      ],
      priority: [
        this.data?.priority || '',
        [Validators.required]
      ],
      labels: [
        this.data?.labels || [],
        [Validators.required]
      ],
      description: [
        this.data?.description || '',
        [Validators.required]
      ],
      completed: [this.data?.completed || false]
    });
  }

  setupPersonAutocomplete(): void {
    this.filteredPersons = this.todoForm.get('person')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPersons(name as string) : this.persons.slice();
      })
    );
  }

  private _filterPersons(name: string): Person[] {
    const filterValue = name.toLowerCase();
    return this.persons.filter(person =>
      person.name.toLowerCase().includes(filterValue) ||
      person.email.toLowerCase().includes(filterValue)
    );
  }

  displayPersonFn(person: Person): string {
    return person && person.name ? person.name : '';
  }

  // Custom validator for minimum length after trim
  minLengthTrimmed(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const trimmedValue = control.value.trim();
      return trimmedValue.length >= minLength ? null : { minlength: true };
    };
  }

  onCompletedChange(event: any): void {
    if (event.checked) {
      this.todoForm.patchValue({
        endDate: new Date()
      });
      this.todoForm.get('endDate')?.disable();
      this.isCompleted = true;
    } else {
      this.todoForm.patchValue({
        endDate: null
      });
      this.todoForm.get('endDate')?.enable();
      this.isCompleted = false;
    }
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.isSubmitting = true;

      const formData = { ...this.todoForm.value };

      // Trim the title before saving
      formData.titre = formData.titre.trim();

      // Handle completed status and end date
      if (formData.completed && !formData.endDate) {
        formData.endDate = new Date();
      }

      const todo: Todo = this.isEditMode
        ? { ...formData, id: this.data!.id }
        : formData;

      const operation = this.isEditMode
        ? this.todoService.updateTodo(todo)
        : this.todoService.createTodo(todo);

      operation.subscribe({
        next: (result) => {
          this.isSubmitting = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving todo:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
