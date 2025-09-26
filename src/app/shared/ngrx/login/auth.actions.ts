import { createAction, props } from '@ngrx/store';
import { LoginRespose } from './auth.reducer';

export const login = createAction(
  'Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  'Login Success',
  props<{ loginResonse:LoginRespose
 }>()
);

export const loginFailure = createAction(
  'Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('Logout');
