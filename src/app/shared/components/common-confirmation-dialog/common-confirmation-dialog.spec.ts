import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick, waitForAsync } from '@angular/core/testing';
import { CommonConfirmationDialog } from './common-confirmation-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api/api-service';
import { SnackBarService } from '../../services/snack-bar-service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { logout } from '../../ngrx/login/auth.actions';

// --- Mock Implementations ---
class MockApiService {
  commanDeleteMethod = jasmine.createSpy('commanDeleteMethod').and.returnValue(of({}));
}

class MockSnackBarService {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
}

class MockDialogRef {
  close = jasmine.createSpy('close');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('CommonConfirmationDialog', () => {
  let component: CommonConfirmationDialog;
  let fixture: ComponentFixture<CommonConfirmationDialog>;
  let apiService: ApiService;
  let snackBar: SnackBarService;
  let dialogRef: MatDialogRef<CommonConfirmationDialog>;
  let router: Router;
  let store: jasmine.SpyObj<Store>;

  const dialogData = {
    dialogType: 'userDashboard',
    dialogData: { id: 123 },
  };

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [
        CommonConfirmationDialog, // Standalone component import
        MatButtonModule,
      ],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: SnackBarService, useClass: MockSnackBarService },
        { provide: MatDialogRef, useClass: MockDialogRef },
        { provide: Router, useClass: MockRouter },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonConfirmationDialog);
    component = fixture.componentInstance;

    apiService = TestBed.inject(ApiService);
    snackBar = TestBed.inject(SnackBarService);
    dialogRef = TestBed.inject(MatDialogRef);
    router = TestBed.inject(Router);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call confirmDeleteUser when dialogType is userDashboard', () => {
    const spy = spyOn(component, 'confirmDeleteUser');
    component.data.dialogType = 'userDashboard';

    component.submitApi();

    expect(spy).toHaveBeenCalled();
  });

  it('should call logoutMethod when dialogType is logout', () => {
    const spy = spyOn(component, 'logoutMethod');
    component.data.dialogType = 'logout';

    component.submitApi();

    expect(spy).toHaveBeenCalled();
  });

  it('should call api and handle success in confirmDeleteUser', waitForAsync(() => {
    // Spy returns success observable
    (apiService.commanDeleteMethod as jasmine.Spy).and.returnValue(of({}));

    component.confirmDeleteUser();

    expect(component.isLoading).toBeFalse();

    // Wait for all async tasks (like subscription) to complete
    fixture.whenStable().then(() => {
      expect(component.isLoading).toBeFalse();
      expect(snackBar.success).toHaveBeenCalledWith('User deleted successfully');
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });
  }));

  it('should handle error in confirmDeleteUser', fakeAsync(() => {
    const errorResponse = { error: { Message: 'Failed to delete user' } };
    (apiService.commanDeleteMethod as jasmine.Spy).and.returnValue(throwError(() => errorResponse));

    component.confirmDeleteUser();

    expect(component.isLoading).toBeFalse();

    tick(); // advance async queue for observable subscription

    expect(snackBar.error).toHaveBeenCalledWith('Failed to delete user');
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle generic error message in confirmDeleteUser', fakeAsync(() => {
    const errorResponse = { error: {} };
    (apiService.commanDeleteMethod as jasmine.Spy).and.returnValue(throwError(() => errorResponse));

    component.confirmDeleteUser();

    flushMicrotasks(); // ensure promise queue is flushed

    expect(snackBar.error).toHaveBeenCalledWith('Something went wrong');
  }));

  it('should clear storage, dispatch logout, navigate and close dialog in logoutMethod', () => {
    spyOn(localStorage, 'clear');

    component.logoutMethod();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(logout());
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog when closeModal is called', () => {
    component.closeModal();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
