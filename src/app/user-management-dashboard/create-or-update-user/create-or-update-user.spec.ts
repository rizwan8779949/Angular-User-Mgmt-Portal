import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateOrUpdateUser } from './create-or-update-user';
import { ApiService } from '../../shared/services/api/api-service';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateOrUpdateUser', () => {
  let component: CreateOrUpdateUser;
  let fixture: ComponentFixture<CreateOrUpdateUser>;
  let apiService: jasmine.SpyObj<ApiService>;
  let snackBarService: jasmine.SpyObj<SnackBarService>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<CreateOrUpdateUser>>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['commonPostMethod', 'commonPatchMethod']);
    snackBarService = jasmine.createSpyObj('SnackBarService', ['success', 'error']);
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CreateOrUpdateUser,
        ReactiveFormsModule,
        BrowserAnimationsModule 
      ],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: apiService },
        { provide: SnackBarService, useValue: snackBarService },
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: Router, useValue: router },
        { provide: MAT_DIALOG_DATA, useValue: {} }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize an empty form for creating a new user', () => {
    expect(component.formGroup.value).toEqual({
      username: '',
      email: '',
      jobRole: '',
    });
  });

  it('should patch the form with data for updating a user', () => {
    const mockData = { id: 1, username: 'testuser', email: 'test@example.com', jobRole: 'tech' };
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockData });
    fixture = TestBed.createComponent(CreateOrUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.formGroup.value).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      jobRole: 'tech',
    });
  });

  it('should not submit an invalid form', () => {
    component.formGroup.setValue({ username: '', email: 'invalid-email', jobRole: '' });
    component.checkFormValidOrNot();

    expect(component.submitted).toBeTrue();
    expect(component.formGroup.invalid).toBeTrue();
    expect(apiService.commonPostMethod).not.toHaveBeenCalled();
    expect(apiService.commonPatchMethod).not.toHaveBeenCalled();
  });

  it('should call submitCreateUserForm for a new user on valid form submission', () => {
    spyOn(component, 'submitCreateUserForm');
    component.formGroup.setValue({ username: 'newuser', email: 'new@example.com', jobRole: 'id' });
    component.checkFormValidOrNot();

    expect(component.submitCreateUserForm).toHaveBeenCalled();
  });

  it('should create a new user and close the dialog on success', fakeAsync(() => {
    apiService.commonPostMethod.and.returnValue(of({}));
    component.formGroup.setValue({ username: 'newuser', email: 'new@example.com', jobRole: 'id' });
    component.submitCreateUserForm();
    tick();

    expect(apiService.commonPostMethod).toHaveBeenCalledWith('createUser', {
      username: 'newuser',
      email: 'new@example.com',
      jobRole: 'id',
    });
    expect(snackBarService.success).toHaveBeenCalledWith('User created successfully');
    expect(matDialogRef.close).toHaveBeenCalledWith(true);
    expect(component.isLoading).toBeFalse();
  }));

  it('should display an error snackbar when user creation fails', fakeAsync(() => {
    const errorResponse = { error: { Message: 'Creation failed' } };
    apiService.commonPostMethod.and.returnValue(throwError(() => errorResponse));
    component.formGroup.setValue({ username: 'newuser', email: 'new@example.com', jobRole: 'id' });
    component.submitCreateUserForm();
    tick();

    expect(snackBarService.error).toHaveBeenCalledWith('Creation failed');
    expect(component.isLoading).toBeFalse();
  }));

  it('should call submitEditUserForm for an existing user on valid form submission', () => {
    spyOn(component, 'submitEditUserForm');
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { id: 1 } });
    fixture = TestBed.createComponent(CreateOrUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formGroup.setValue({ username: 'edituser', email: 'edit@example.com', jobRole: 'qa' });
    component.checkFormValidOrNot();

    expect(component.submitEditUserForm).toHaveBeenCalled();
  });

  it('should update a user and close the dialog on success', fakeAsync(() => {
    const mockData = { id: 1, username: 'testuser', email: 'test@example.com', jobRole: 'tech' };
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockData });
    fixture = TestBed.createComponent(CreateOrUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();

    apiService.commonPatchMethod.and.returnValue(of({}));
    component.formGroup.setValue({ username: 'updateduser', email: 'updated@example.com', jobRole: 'qa' });
    component.submitEditUserForm();
    tick();

    expect(apiService.commonPatchMethod).toHaveBeenCalledWith('updateUser/1', {
      email: 'updated@example.com',
      jobRole: 'qa',
    });
    expect(snackBarService.success).toHaveBeenCalledWith('User updated successfully');
    expect(matDialogRef.close).toHaveBeenCalledWith(true);
    expect(component.isLoading).toBeFalse();
  }));

  it('should display an error snackbar when user update fails', fakeAsync(() => {
    const mockData = { id: 1, username: 'testuser', email: 'test@example.com', jobRole: 'tech' };
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockData });
    fixture = TestBed.createComponent(CreateOrUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errorResponse = { error: { Message: 'Update failed' } };
    apiService.commonPatchMethod.and.returnValue(throwError(() => errorResponse));
    component.formGroup.setValue({ username: 'updateduser', email: 'updated@example.com', jobRole: 'qa' });
    component.submitEditUserForm();
    tick();

    expect(snackBarService.error).toHaveBeenCalledWith('Update failed');
    expect(component.isLoading).toBeFalse();
  }));

  it('should close the modal when closeModal is called', () => {
    component.closeModal();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('should navigate to the specified URL when goto is called', () => {
    const url = '/new-route';
    component.goto(url);
    expect(router.navigate).toHaveBeenCalledWith([url]);
  });
});
