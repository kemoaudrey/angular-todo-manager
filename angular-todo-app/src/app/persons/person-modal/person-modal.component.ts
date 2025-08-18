import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-modal',
  standalone: true,
  imports: [
    // Angular Material Modules
CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss']
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
