import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { SnackBarService } from '../shared/services/snack-bar-service';
import { login } from '../shared/ngrx/login/auth.actions';

// Mock Router service
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock SnackBarService
class MockSnackBarService {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
}

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;
  let router: Router;
  let snackBarService: SnackBarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        Login, // standalone component import
      ],
      providers: [
        provideMockStore(),
        { provide: Router, useClass: MockRouter },
        { provide: SnackBarService, useClass: MockSnackBarService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    snackBarService = TestBed.inject(SnackBarService);

    // **Override selectors BEFORE creating the component**
    store.overrideSelector('isLoading', false);
    store.overrideSelector('selectError', null);
    store.overrideSelector('selectLoginResponse', null);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    component.formGroup.setValue({ username: '', password: '' });
    expect(component.formGroup.invalid).toBeTrue();
  });

  it('should have valid form when fields are filled', () => {
    component.formGroup.setValue({ username: 'admin', password: 'password' });
    expect(component.formGroup.valid).toBeTrue();
  });

  it('should dispatch login action when form is valid', () => {
    spyOn(store, 'dispatch');

    component.formGroup.setValue({ username: 'admin', password: 'password' });
    component.checkLoginDetails();

    expect(store.dispatch).toHaveBeenCalledWith(
      login({ username: 'admin', password: 'password' })
    );
  });

  it('should not dispatch login when form is invalid', () => {
    spyOn(store, 'dispatch');

    component.formGroup.setValue({ username: '', password: '' });
    component.checkLoginDetails();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  // it('should show success and navigate on successful login', fakeAsync(() => {
  //   const userData = { id: 1, username: 'admin', token: 'xyz' };

  //   // Override selector with user data BEFORE triggering change detection
  //   store.overrideSelector('selectLoginResponse', userData);
  //   store.refreshState();

  //   fixture.detectChanges();
  //   tick(); // let async tasks complete

  //   expect(snackBarService.success).toHaveBeenCalledWith('Logged in successfully');
  //   expect(router.navigate).toHaveBeenCalledWith(['/user-management-dashboard']);
  // }));

  // it('should show error message on login failure', fakeAsync(() => {
  //   const errorMsg = 'Invalid credentials';

  //   // Override selector with error message BEFORE triggering change detection
  //   store.overrideSelector('selectError', errorMsg);
  //   store.refreshState();

  //   fixture.detectChanges();
  //   tick(); // let async tasks complete

  //   expect(snackBarService.error).toHaveBeenCalledWith(errorMsg);
  // }));
});
