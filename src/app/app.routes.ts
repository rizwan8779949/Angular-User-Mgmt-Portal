import { Routes } from '@angular/router';
import { loginFailedGuardGuard } from './shared/guards/Login-Failed-Guards/login-failed-guard-guard';
import { loginSucesssGuardGuard } from './shared/guards/Login-Success-Guards/login-sucesss-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((c) => c.Login),
    canActivate: [loginFailedGuardGuard],
  },
  {
    path: 'user-management-dashboard',
    loadComponent: () =>
      import('./user-management-dashboard/all-users-list/all-users-list').then(
        (c) => c.AllUsersList
      ),

    canActivate: [loginSucesssGuardGuard],
  },
];
