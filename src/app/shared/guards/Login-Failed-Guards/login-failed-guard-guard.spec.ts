import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginFailedGuardGuard } from './login-failed-guard-guard';

describe('loginFailedGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginFailedGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
