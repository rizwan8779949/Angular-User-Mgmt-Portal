import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateOrUpdateUser } from './create-or-update-user';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { createOrUpdateReducer } from '../../shared/ngrx/createOrUpdateUser/user.reducer'; // adjust if needed
import { of } from 'rxjs';

describe('CreateOrUpdateUser', () => {
  let component: CreateOrUpdateUser;
  let fixture: ComponentFixture<CreateOrUpdateUser>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<CreateOrUpdateUser>>;
  let snackBar: jasmine.SpyObj<SnackBarService>;

  const baseSetup = (dialogData: any = {}) => {
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBar = jasmine.createSpyObj('SnackBarService', ['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        CreateOrUpdateUser,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({ user: createOrUpdateReducer }), // wrap reducer in an object
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: SnackBarService, useValue: snackBar },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('when creating a new user', () => {
    beforeEach(() => {
      baseSetup(); // no data passed
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize empty form', () => {
      expect(component.formGroup.value).toEqual({
        username: '',
        email: '',
        jobRole: '',
      });
    });

    it('should not dispatch when form is invalid', () => {
      spyOn(component['store'], 'dispatch');
      component.formGroup.setValue({
        username: '',
        email: 'invalid-email',
        jobRole: '',
      });
      component.checkFormValidOrNot();

      expect(component.submitted).toBeTrue();
      expect(component.formGroup.invalid).toBeTrue();
      expect(component['store'].dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch createUser action for valid form (new user)', () => {
      spyOn(component['store'], 'dispatch');
      component.formGroup.setValue({
        username: 'newuser',
        email: 'new@example.com',
        jobRole: 'qa',
      });

      component.checkFormValidOrNot();

      expect(component['store'].dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
        type: '[User] Create User',
        payload: {
          username: 'newuser',
          email: 'new@example.com',
          jobRole: 'qa',
        },
      }));
    });
  });

  describe('when editing an existing user', () => {
    beforeEach(() => {
      const mockData = {
        id: 10,
        username: 'existing',
        email: 'existing@example.com',
        jobRole: 'dev',
      };
      baseSetup(mockData);
    });

    it('should patch form with user data when id is present', () => {
      expect(component.formGroup.value).toEqual({
        username: 'existing',
        email: 'existing@example.com',
        jobRole: 'dev',
      });
    });

    it('should dispatch updateUser action for valid form (existing user)', () => {
      spyOn(component['store'], 'dispatch');

      component.formGroup.setValue({
        username: 'updated',
        email: 'updated@example.com',
        jobRole: 'tech',
      });

      component.checkFormValidOrNot();

      expect(component['store'].dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
        type: '[User] Update User',
        id: 10,
        payload: {
          username: 'updated',
          email: 'updated@example.com',
          jobRole: 'tech',
        },
      }));
    });
  });

  describe('general behavior', () => {
    beforeEach(() => baseSetup());

    it('should close modal', () => {
      component.closeModal();
      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });
});

