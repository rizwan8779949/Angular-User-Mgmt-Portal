import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../shared/services/api/api-service';
import { SnackBarService } from '../shared/services/snack-bar-service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule, 
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  checkLoginDetails() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    this.isLoading = true;
    const loginData = this.formGroup.value;

    this.api.commonPostMethod('login', loginData).subscribe({
      next: (res:any) => {
        this.isLoading = false;
        localStorage.setItem('loggedInUserData', JSON.stringify(res?.data));
        this.router.navigate(['/user-management-dashboard']);
        this.snackBarService.success('Logged in successfully');
      },
      error: (err: any) => {
        this.isLoading = false;
        const errorMessage = err?.error?.message ?? 'An error occurred. Please try again.';
        this.snackBarService.error(errorMessage);
      },
    });
  }
}
