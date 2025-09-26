import { Component, Inject } from '@angular/core';
import { ApiService } from '../../services/api/api-service';
import { SnackBarService } from '../../services/snack-bar-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { logout } from '../../ngrx/login/auth.actions';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-common-confirmation-dialog',
  imports: [MatButtonModule],
  templateUrl: './common-confirmation-dialog.html',
  styleUrl: './common-confirmation-dialog.scss',
})
export class CommonConfirmationDialog {
  constructor(
    private api: ApiService,
    private snackBar: SnackBarService,
    private matDialogRef: MatDialogRef<CommonConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private store:Store
  ) {}
  isLoading = false;
  ngOnInit(): void {}

  submitApi() {
    switch (this.data?.dialogType) {
      case 'userDashboard':
        this.confirmDeleteUser();
        break;
      case 'logout':
        this.logoutMethod();
        break;

      default:
        break;
    }
  }

  confirmDeleteUser() {
    this.isLoading = true;
    this.api.commanDeleteMethod('deleteUser/' + this.data?.dialogData?.id).subscribe(
      (data: any) => {
        this.isLoading = false;
        this.snackBar.success(`User deleted successfully`);
        this.matDialogRef.close(true);
      },
      (err: any) => {
        this.isLoading = false;
        this.snackBar.error(err?.error?.Message || 'Something went wrong');
      }
    );
  }
  logoutMethod() {
    localStorage.clear();
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
    this.matDialogRef.close(); 
  }

  closeModal() {
    this.matDialogRef.close();
  }
}
