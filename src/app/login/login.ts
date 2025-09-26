import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackBarService } from '../shared/services/snack-bar-service';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { isLoading, selectError, selectLoginResponse } from '../shared/ngrx/login/auth.selectors';
import { login } from '../shared/ngrx/login/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private snackBarService = inject(SnackBarService);

  formGroup: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submitted = signal(false);
  loading$ = this.store.select(isLoading);
  error$ = this.store.select(selectError);
  user$ = this.store.select(selectLoginResponse);

  constructor() {
    effect(() => {
      const user = this.user$;
      user.subscribe((res) => {
        if (res) {
          localStorage.setItem('loggedInUserData', JSON.stringify(res));
          this.snackBarService.success('Logged in successfully');
          this.router.navigate(['/user-management-dashboard']);
        }
      });
    });

    effect(() => {
      const err = this.error$;
      err.subscribe((error) => {
        if (error) {
          this.snackBarService.error(error);
        }
      });
    });
  }

  checkLoginDetails() {
    this.submitted.set(true);

    if (this.formGroup.invalid) return;

    const loginData = this.formGroup.value;

    this.store.dispatch(login(loginData));
  }
}
