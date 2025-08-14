import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-modal',
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-2xl font-bold mb-4">
        {{ isEditMode ? 'Edit Person' : 'Add New Person' }}
      </h2>

      <form [formGroup]="personForm" (ngSubmit)="onSubmit()">
        <div class="space-y-4">

          <!-- Name Field -->
          <mat-form-field class="w-full">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter full name">
            <mat-error *ngIf="personForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
            <mat-error *ngIf="personForm.get('name')?.hasError('minlength')">
              Name must be at least 3 characters long
            </mat-error>
            <mat-error *ngIf="personForm.get('name')?.hasError('nameNotUnique')">
              This name is already taken
            </mat-error>
          </mat-form-field>

          <!-- Email Field -->
          <mat-form-field class="w-full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Enter email address">
            <mat-error *ngIf="personForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="personForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>

          <!-- Phone Field -->
          <mat-form-field class="w-full">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" placeholder="Enter phone number">
            <mat-error *ngIf="personForm.get('phone')?.hasError('required')">
              Phone is required
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
            [disabled]="personForm.invalid || isSubmitting"
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
    .space-y-4 > * + * {
      margin-top: 1rem;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class PersonModalComponent implements OnInit {
  personForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private dialogRef: MatDialogRef<PersonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Person | null
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.personForm = this.fb.group({
      name: [
        this.data?.name || '',
        [Validators.required, this.minLengthTrimmed(3)],
        [this.nameUniqueValidator.bind(this)]
      ],
      email: [
        this.data?.email || '',
        [Validators.required, Validators.email]
      ],
      phone: [
        this.data?.phone || '',
        [Validators.required]
      ]
    });
  }

  // Custom validator for minimum length after trim
  minLengthTrimmed(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const trimmedValue = control.value.trim();
      return trimmedValue.length >= minLength ? null : { minlength: true };
    };
  }

  // Async validator for unique name
  nameUniqueValidator(control: AbstractControl) {
    if (!control.value) return Promise.resolve(null);

    const trimmedName = control.value.trim();
    const excludeId = this.isEditMode ? this.data?.id : undefined;

    return new Promise(resolve => {
      this.personService.isNameUnique(trimmedName, excludeId).subscribe(isUnique => {
        resolve(isUnique ? null : { nameNotUnique: true });
      });
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      this.isSubmitting = true;

      const formData = this.personForm.value;
      // Trim the name before saving
      formData.name = formData.name.trim();

      const person: Person = this.isEditMode
        ? { ...formData, id: this.data!.id }
        : formData;

      const operation = this.isEditMode
        ? this.personService.updatePerson(person)
        : this.personService.createPerson(person);

      operation.subscribe({
        next: (result) => {
          this.isSubmitting = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving person:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
