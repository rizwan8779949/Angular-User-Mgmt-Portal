import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonConfirmationDialog } from './common-confirmation-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api/api-service';
import { SnackBarService } from '../../services/snack-bar-service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

describe('CommonConfirmationDialog', () => {
  let component: CommonConfirmationDialog;
  let fixture: ComponentFixture<CommonConfirmationDialog>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarServiceSpy: jasmine.SpyObj<SnackBarService>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<CommonConfirmationDialog>>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockDialogData = {
    dialogType: 'userDashboard',
    dialogData: { id: 123 }
  };

 beforeEach(async () => {
  apiServiceSpy = jasmine.createSpyObj('ApiService', ['commanDeleteMethod']);
  snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['success', 'error']);
  matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  await TestBed.configureTestingModule({
    imports: [CommonConfirmationDialog], // ✅ Add your standalone component here
    providers: [
      { provide: ApiService, useValue: apiServiceSpy },
      { provide: SnackBarService, useValue: snackBarServiceSpy },
      { provide: MatDialogRef, useValue: matDialogRefSpy },
      { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      { provide: Router, useValue: routerSpy }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(CommonConfirmationDialog);
  component = fixture.componentInstance;
  fixture.detectChanges();
});


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitApi()', () => {
    it('should call confirmDeleteUser when dialogType is userDashboard', () => {
      spyOn(component, 'confirmDeleteUser');
      component.data.dialogType = 'userDashboard';
      component.submitApi();
      expect(component.confirmDeleteUser).toHaveBeenCalled();
    });

    it('should call logoutMethod when dialogType is logout', () => {
      spyOn(component, 'logoutMethod');
      component.data.dialogType = 'logout';
      component.submitApi();
      expect(component.logoutMethod).toHaveBeenCalled();
    });
  });

  describe('confirmDeleteUser()', () => {
    it('should delete user and show success snackbar', () => {
      apiServiceSpy.commanDeleteMethod.and.returnValue(of({}));

      component.confirmDeleteUser();

      expect(component.isLoading).toBeFalse();
      expect(apiServiceSpy.commanDeleteMethod).toHaveBeenCalledWith('deleteUser/123');
      expect(snackBarServiceSpy.success).toHaveBeenCalledWith('User deleted successfully');
      expect(matDialogRefSpy.close).toHaveBeenCalledWith(true);
    });

    it('should handle error and show error snackbar', () => {
      const errorResponse = { error: { Message: 'Deletion failed' } };
      apiServiceSpy.commanDeleteMethod.and.returnValue(throwError(() => errorResponse));

      component.confirmDeleteUser();

      expect(component.isLoading).toBeFalse();
      expect(snackBarServiceSpy.error).toHaveBeenCalledWith('Deletion failed');
    });

    it('should show default error message if no error message is provided', () => {
      apiServiceSpy.commanDeleteMethod.and.returnValue(throwError(() => ({})));

      component.confirmDeleteUser();

      expect(snackBarServiceSpy.error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('logoutMethod()', () => {
    beforeEach(() => {
      spyOn(localStorage, 'clear');
    });

    it('should clear local storage, navigate to login, and close dialog', () => {
      component.logoutMethod();

      expect(localStorage.clear).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
  });

  describe('closeModal()', () => {
    it('should close the dialog', () => {
      component.closeModal();
      expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
  });
});
