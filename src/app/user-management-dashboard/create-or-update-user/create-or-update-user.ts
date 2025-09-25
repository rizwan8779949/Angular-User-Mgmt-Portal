import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api/api-service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-or-update-user',
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './create-or-update-user.html',
  styleUrl: './create-or-update-user.scss',
})
export class CreateOrUpdateUser {
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private snackBar: SnackBarService,
    private matDialogRef: MatDialogRef<CreateOrUpdateUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  formGroup: any;
  submitted = false;
  isLoading = false;
  allJobRole = [
    {
      name: 'tech',
      value: 'tech',
    },
    {
      name: 'id',
      value: 'id',
    },
    {
      name: 'gd',
      value: 'gd',
    },
    {
      name: 'qa',
      value: 'qa',
    },
  ];
  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      jobRole: ['', [Validators.required]],
    });
  }
  get formControls() {
    return this.formGroup.controls;
  }
  checkFormValidOrNot() {
    this.submitted = true;

    if (this.formGroup.invalid) {
      return;
    }
    if (this.data?.id) this.submitEditUserForm();
    else this.submitCreateUserForm();
  }
  closeModal() {
    this.matDialogRef.close();
  }
  submitCreateUserForm() {
    this.isLoading = true;
    this.api.commonPostMethod('createUser', this.formGroup.value).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.snackBar.success('User created successfully');
        this.matDialogRef.close(true);
      },
      (err: any) => {
        this.isLoading = false;
        this.snackBar.error(err?.error?.Message || 'Something went wrong');
      }
    );
  }
  submitEditUserForm() {
    this.isLoading = true;
    const payLoadObj = {
      email: this.formControls['email'].value,
      jobRole: this.formControls['jobRole'].value,
    };
    this.api.commonPostMethod('updateUser', payLoadObj).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.snackBar.success('User upated successfully');
        this.matDialogRef.close(true);
      },
      (err: any) => {
        this.isLoading = false;
        this.snackBar.error(err?.error?.Message || 'Something went wrong');
      }
    );
  }
  goto(url: string) {
    this.router.navigate([url]);
  }
}
