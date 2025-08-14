import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { Person } from '../../models/person.model';
import { Priority, Label } from '../../models/enums';
import { TodoService } from '../../services/todo.service';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-todo-modal',
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-2xl font-bold mb-4">
        {{ isEditMode ? 'Edit Task' : 'Add New Task' }}
      </h2>

      <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- Title Field -->
          <mat-form-field class="col-span-2">
            <mat-label>Task Title</mat-label>
            <input matInput formControlName="titre" placeholder="Enter task title">
            <mat-error *ngIf="todoForm.get('titre')?.hasError('required')">
              Title is required
            </mat-error>
            <mat-error *ngIf="todoForm.get('titre')?.hasError('minlength')">
              Title must be at least 3 characters long
            </mat-error>
          </mat-form-field>

          <!-- Person Autocomplete -->
          <mat-form-field class="col-span-2">
            <mat-label>Assign to Person</mat-label>
            <input
              type="text"
              matInput
              formControlName="person"
              [matAutocomplete]="auto"
              placeholder="Choose or type person name">
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayPersonFn">
              <mat-option
                *ngFor="let person of filteredPersons | async"
                [value]="person">
                <div class="flex flex-col">
                  <span class="font-medium">{{ person.name }}</span>
                  <span class="text-sm text-gray-500">{{ person.email }}</span>
                </div>
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="todoForm.get('person')?.hasError('required')">
              Please assign this task to someone
            </mat-error>
          </mat-form-field>

          <!-- Start Date -->
          <mat-form-field>
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate">
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
            <mat-error *ngIf="todoForm.get('startDate')?.hasError('required')">
              Start date is required
            </mat-error>
          </mat-form-field>

          <!-- End Date -->
          <mat-form-field>
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate" [readonly]="isCompleted">
            <mat-hint>{{ isCompleted ? 'Auto-filled when completed' : 'MM/DD/YYYY' }}</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="endPicker" [disabled]="isCompleted"></mat-datepicker-toggle>
            <mat-datepicker #endPicker [disabled]="isCompleted"></mat-datepicker>
          </mat-form-field>

          <!-- Priority -->
          <mat-form-field>
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option *ngFor="let priority of priorities" [value]="priority">
                {{ priority }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="todoForm.get('priority')?.hasError('required')">
              Please select a priority
            </mat-error>
          </mat-form-field>

          <!-- Labels -->
          <mat-form-field>
            <mat-label>Labels</mat-label>
            <mat-select formControlName="labels" multiple>
              <mat-option *ngFor="let label of labelOptions" [value]="label">
                {{ label }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="todoForm.get('labels')?.hasError('required')">
              Please select at least one label
            </mat-error>
          </mat-form-field>

          <!-- Completed Checkbox -->
          <div class="col-span-2 flex items-center" *ngIf="isEditMode">
            <mat-checkbox formControlName="completed" (change)="onCompletedChange($event)">
              Mark as completed
            </mat-checkbox>
          </div>

          <!-- Description -->
          <mat-form-field class="col-span-2">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              formControlName="description"
              placeholder="Enter task description"
              rows="4">
            </textarea>
            <mat-error *ngIf="todoForm.get('description')?.hasError('required')">
              Description is required
            </mat-error>
          </mat-form-field>

        </div>

        <div mat-dialog-actions class="flex justify-end gap-3 mt-6 p-0">
          <button
            type="button"
            mat-button
            (click)="onCancel()"
            class="text-gray-600">
            Cancel
          </button>
          <button
            type="submit"
            mat-raised-button
            color="primary"
            [disabled]="todoForm.invalid || isSubmitting"
            class="bg-blue-500 hover:bg-blue-600">
            <span *ngIf="isSubmitting" class="inline-flex items-center">
              <mat-icon class="animate-spin mr-2">refresh</mat-icon>
              Saving...
            </span>
            <span *ngIf="!isSubmitting">
              {{ isEditMode ? 'Update' : 'Save' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
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
