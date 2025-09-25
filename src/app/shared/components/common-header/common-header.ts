import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CommonConfirmationDialog } from '../common-confirmation-dialog/common-confirmation-dialog';

@Component({
  selector: 'app-common-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './common-header.html',
  styleUrl: './common-header.scss',
})
export class CommonHeader {
  constructor(private dialog: MatDialog) {}
  deleteUserConfirmDialog() {
    const dialogRef = this.dialog.open(CommonConfirmationDialog, {
      disableClose: true,
      data: {
        dialogType: 'logout',
      },
    });
  }
}
