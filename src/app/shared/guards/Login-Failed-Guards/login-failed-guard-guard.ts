import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginFailedGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!localStorage.getItem('loggedInUserData')) return true;
  else {
    router.navigateByUrl('user-management-dashboard');
    return false;
  }
};
