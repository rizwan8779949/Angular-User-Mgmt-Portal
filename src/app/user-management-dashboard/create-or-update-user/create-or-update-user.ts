import { Component, Inject, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { isLoading, userRespSelector } from '../../shared/ngrx/createOrUpdateUser/user.selectors';
import { createUser, resetUserState, updateUser } from '../../shared/ngrx/createOrUpdateUser/user.actions';

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
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private matDialogRef = inject(MatDialogRef<CreateOrUpdateUser>);
  private snackBar = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);

  formGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jobRole: ['', Validators.required],
  });

  data = inject(MAT_DIALOG_DATA, { optional: true });

  submitted = false;
  isLoading$ = this.store.select(isLoading);

  allJobRole = [
    { name: 'tech', value: 'tech' },
    { name: 'id', value: 'id' },
    { name: 'gd', value: 'gd' },
    { name: 'qa', value: 'qa' },
  ];

  ngOnInit(): void {
    this.store.dispatch(resetUserState());

    if (this.data?.id) {
      this.formGroup.patchValue({
        username: this.data?.username ?? '',
        email: this.data?.email ?? '',
        jobRole: this.data?.jobRole ?? '',
      });
    }

    this.store
      .select(userRespSelector)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          const msg = this.data?.id ? 'User updated successfully' : 'User created successfully';
          this.snackBar.success(msg);
          this.matDialogRef.close(true);
        }
      });
  }

  checkFormValidOrNot(): void {
    this.submitted = true;
    if (this.formGroup.invalid) return;

    const raw = this.formGroup.getRawValue();

    const formValue = {
      username: raw.username ?? '',
      email: raw.email ?? '',
      jobRole: raw.jobRole ?? '',
    };

    this.store.dispatch(
      this.data?.id
        ? updateUser({ id: this.data.id, payload: formValue })
        : createUser({ payload: formValue })
    );
  }

  closeModal(): void {
    this.matDialogRef.close();
  }
}
