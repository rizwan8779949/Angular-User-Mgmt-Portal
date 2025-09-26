import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

import { loginFailedGuardGuard } from './login-failed-guard-guard';

describe('loginFailedGuardGuard', () => {
  let routerNavigateSpy: jasmine.Spy;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loginFailedGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
          },
        },
      ],
    });

    routerNavigateSpy = TestBed.inject(Router).navigateByUrl as jasmine.Spy;
    localStorage.clear(); // clear before each test
  });

  it('should allow activation (return true) if loggedInUserData is not in localStorage', () => {
    // Ensure key is missing
    localStorage.removeItem('loggedInUserData');

    const result = executeGuard(undefined!, undefined!);

    expect(result).toBeTrue();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to "user-management-dashboard" and return false if loggedInUserData exists', () => {
    // Add item to localStorage to simulate logged-in user
    localStorage.setItem('loggedInUserData', JSON.stringify({ user: 'test' }));

    const result = executeGuard(undefined!, undefined!);

    expect(routerNavigateSpy).toHaveBeenCalledWith('user-management-dashboard');
    expect(result).toBeFalse();
  });
});
