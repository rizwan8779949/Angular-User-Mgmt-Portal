import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackBar:MatSnackBar){}
  success(message: string) {
    if (message) {
      this.snackBar.open(message, 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
        panelClass: ['success-toaster'],
      });
    }
  }

  error(message: string) {
    if (message) {
      this.snackBar.open(message, 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
        panelClass: ['error-toaster'],
      });
    }
  }
}
