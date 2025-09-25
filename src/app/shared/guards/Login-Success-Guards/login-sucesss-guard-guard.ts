import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginSucesssGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('loggedInUserData')) return true;
  else {
    router.navigateByUrl('login');
    return false;
  }
};
