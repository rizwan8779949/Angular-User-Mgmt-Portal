import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../shared/services/api/api-service';
import { Router } from '@angular/router';
import { SnackBarService } from '../shared/services/snack-bar-service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [ApiService, SnackBarService],
})
export class Login {
  formGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.formGroup = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  checkLoginDetails() {
    this.submitted = true;
    if (this.formGroup.invalid) return;
    this.isLoading = true;
    this.api.commonPostMethod('login',this.formGroup.value).subscribe(
      (res: any) => {
        this.submitted = false;
        this.isLoading = false;
        this.router.navigate(['/user-management-dashboard']);
        this.snackBarService.success('Loggedin successfully');
      },
      (err: any) => {
        localStorage.setItem('loggedInUserData',JSON.stringify(this.formGroup.value))
        this.snackBarService.error(err?.error?.message ?? 'Please try again..!');
        this.router.navigate(['/user-management-dashboard']);
        this.submitted = false;
        this.isLoading = false;
      }
    );
  }

  get formControls() {
    return this.formGroup.controls;
  }
}
