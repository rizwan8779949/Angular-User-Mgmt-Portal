import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../shared/services/api/api-service';
import { SnackBarService } from '../../shared/services/snack-bar-service';

@Component({
  selector: 'app-create-or-update-user',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './create-or-update-user.html',
  styleUrls: ['./create-or-update-user.scss'],
})
export class CreateOrUpdateUser implements OnInit {
  formGroup = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    jobRole: ['', Validators.required],
  });

  private api = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(SnackBarService);
  private matDialogRef: MatDialogRef<CreateOrUpdateUser> = inject(MatDialogRef);

  data = inject(MAT_DIALOG_DATA, { optional: true });

  submitted = false;
  isLoading = false;

  allJobRole = [
    { name: 'tech', value: 'tech' },
    { name: 'id', value: 'id' },
    { name: 'gd', value: 'gd' },
    { name: 'qa', value: 'qa' },
  ];

  ngOnInit(): void {
    if (this.data?.id) {
      this.formGroup.patchValue({
        username: this.data?.username,
        email: this.data?.email,
        jobRole: this.data?.jobRole,
      });
    }
  }

  checkFormValidOrNot(): void {
    this.submitted = true;

    if (this.formGroup.invalid) {
      return;
    }

    if (this.data?.id) {
      this.submitEditUserForm();
    } else {
      this.submitCreateUserForm();
    }
  }

  closeModal(): void {
    this.matDialogRef.close();
  }

  submitCreateUserForm(): void {
    this.isLoading = true;
    this.api.commonPostMethod('createUser', this.formGroup.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.success('User created successfully');
        this.matDialogRef.close(true);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.error(err?.error?.Message || 'Something went wrong');
      },
    });
  }

  submitEditUserForm(): void {
    this.isLoading = true;
    const payloadObj = {
      email: this.formGroup.controls.email.value,
      jobRole: this.formGroup.controls.jobRole.value,
    };
    this.api.commonPatchMethod(`updateUser/${this.data?.id}`, payloadObj).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.success('User updated successfully');
        this.matDialogRef.close(true);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.error(err?.error?.Message || 'Something went wrong');
      },
    });
  }

  goto(url: string): void {
    this.router.navigate([url]);
  }
}
