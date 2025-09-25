import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginSucesssGuardGuard } from './login-sucesss-guard-guard';

describe('loginSucesssGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginSucesssGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
