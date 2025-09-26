import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

import { loginSucesssGuardGuard } from './login-sucesss-guard-guard';

describe('loginSucesssGuardGuard', () => {
  let routerNavigateSpy: jasmine.Spy;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loginSucesssGuardGuard(...guardParameters));

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
    localStorage.clear();
  });

  it('should allow activation (return true) if loggedInUserData exists in localStorage', () => {
    localStorage.setItem('loggedInUserData', JSON.stringify({ user: 'test' }));

    const result = executeGuard(undefined!, undefined!);

    expect(result).toBeTrue();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to "login" and return false if loggedInUserData is missing', () => {
    localStorage.removeItem('loggedInUserData');

    const result = executeGuard(undefined!, undefined!);

    expect(routerNavigateSpy).toHaveBeenCalledWith('login');
    expect(result).toBeFalse();
  });
});
