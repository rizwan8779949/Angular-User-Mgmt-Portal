import { createAction, props } from '@ngrx/store';
import { User } from './user.reducer';

export const createUser = createAction(
  '[User] Create User',
  props<{ payload: Omit<User, 'id'> }>()
);

export const updateUser = createAction(
  '[User] Update User',
  props<{ id: string; payload: Partial<User> }>()
);

export const userRespSuccess = createAction(
  '[User] Create/Update Success',
  props<{ user: User }>()
);

export const userRespFailure = createAction(
  '[User] Create/Update Failure',
  props<{ error: string }>()
);

export const resetUserState = createAction('[User] Reset State');
