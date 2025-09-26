import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api/api-service';
import { SnackBarService } from '../shared/services/snack-bar-service';
import { of, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Create mock services
const mockApiService = {
  commonPostMethod: jasmine.createSpy()
};

const mockRouter = {
  navigate: jasmine.createSpy()
};

const mockSnackBarService = {
  success: jasmine.createSpy(),
  error: jasmine.createSpy()
};

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
beforeEach(async () => {
  await TestBed.configureTestingModule({
    // ✅ Use imports, not declarations
    imports: [
      Login, // ✅ Standalone component
      ReactiveFormsModule,
      CommonModule,
      MatButtonModule,
      MatInputModule,
      MatFormFieldModule,
    ],
    providers: [
      { provide: ApiService, useValue: mockApiService },
      { provide: Router, useValue: mockRouter },
      { provide: SnackBarService, useValue: mockSnackBarService },
    ],
  }).compileComponents();

  fixture = TestBed.createComponent(Login);
  component = fixture.componentInstance;
  fixture.detectChanges();
});


  afterEach(() => {
    // Reset spies between tests
    mockApiService.commonPostMethod.calls.reset();
    mockRouter.navigate.calls.reset();
    mockSnackBarService.success.calls.reset();
    mockSnackBarService.error.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with username and password controls', () => {
    expect(component.formGroup.contains('username')).toBeTrue();
    expect(component.formGroup.contains('password')).toBeTrue();
  });

  it('should mark form as submitted but not call API if form is invalid', () => {
    component.formGroup.patchValue({ username: '', password: '' });
    component.checkLoginDetails();

    expect(component.submitted).toBeTrue();
    expect(mockApiService.commonPostMethod).not.toHaveBeenCalled();
  });

  it('should call API and handle success response on valid form submission', fakeAsync(() => {
    const mockResponse = { data: { name: 'Test User', token: 'abc123' } };

    mockApiService.commonPostMethod.and.returnValue(of(mockResponse));
    spyOn(localStorage, 'setItem');

    component.formGroup.patchValue({
      username: 'testuser',
      password: 'testpass'
    });

    component.checkLoginDetails();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(mockApiService.commonPostMethod).toHaveBeenCalledWith('login', {
      username: 'testuser',
      password: 'testpass'
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'loggedInUserData',
      JSON.stringify(mockResponse.data)
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-management-dashboard']);
    expect(mockSnackBarService.success).toHaveBeenCalledWith('Logged in successfully');
  }));

  it('should call API and handle error response on failed login', fakeAsync(() => {
    const mockError = {
      error: {
        message: 'Invalid credentials'
      }
    };

    mockApiService.commonPostMethod.and.returnValue(throwError(() => mockError));

    component.formGroup.patchValue({
      username: 'wronguser',
      password: 'wrongpass'
    });

    component.checkLoginDetails();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(mockApiService.commonPostMethod).toHaveBeenCalled();
    expect(mockSnackBarService.error).toHaveBeenCalledWith('Invalid credentials');
  }));

  it('should show default error message if error response has no message', fakeAsync(() => {
    const mockError = {
      error: {}
    };

    mockApiService.commonPostMethod.and.returnValue(throwError(() => mockError));

    component.formGroup.patchValue({
      username: 'user',
      password: 'pass'
    });

    component.checkLoginDetails();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(mockSnackBarService.error).toHaveBeenCalledWith('An error occurred. Please try again.');
  }));
});
