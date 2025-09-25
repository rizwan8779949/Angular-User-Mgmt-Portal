import { createAction, props } from '@ngrx/store';
import { User } from './user.reducer';


export const userRespSuccess = createAction(
  'User Create/Update Success',
  props<{ user:User
 }>()
);

export const userRespFailure = createAction(
  'User Create/Update Failure',
  props<{ error: string }>()
);
