import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonHeader } from '../../shared/components/common-header/common-header';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../shared/services/api/api-service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CreateOrUpdateUser } from '../create-or-update-user/create-or-update-user';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subject, takeUntil } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { userMgmtInitial } from '../../shared/ngrx/allUserMgmt/user-mgmt.actions';
import { userMgmtError, userMgmtLoading, userMgmtSelector } from '../../shared/ngrx/allUserMgmt/user-mgmt.selectors';
import { CommonConfirmationDialog } from '../../shared/components/common-confirmation-dialog/common-confirmation-dialog';

@Component({
  selector: 'app-all-users-list',
  imports: [
    CommonModule,
    CommonHeader,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './all-users-list.html',
  styleUrl: './all-users-list.scss',
})
export class AllUsersList implements OnInit, OnDestroy {
  dataSourceUserList = new MatTableDataSource<any>();
  displayedColumns = ['username', 'email', 'jobRole', 'action'];

  isLoading = false;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(userMgmtInitial());

    this.store
      .pipe(select(userMgmtSelector), takeUntil(this.destroy$))
      .subscribe((users) => {
        this.dataSourceUserList.data = users ?? [];
      });

    this.store
      .pipe(select(userMgmtLoading), takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isLoading = loading;
      });

    this.error$ = this.store.pipe(select(userMgmtError));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateUserDialog(editUserObject: any) {
    const dialogRef = this.dialog.open(CreateOrUpdateUser, {
      width: '400px',
      disableClose: true,
      data: editUserObject,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.store.dispatch(userMgmtInitial()); // reload
      }
    });
  }

  deleteUserConfirmDialog(deleteUserObject: any) {
    const dialogRef = this.dialog.open(CommonConfirmationDialog, {
      disableClose: true,
      data:
      {
        dialogType:'userDashboard',
        dialogData:deleteUserObject
      }
      ,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.store.dispatch(userMgmtInitial()); // reload
      }
    });
  }

  goto(url: string) {
    this.router.navigate([url]);
  }
}
