import { createAction, props } from '@ngrx/store';
import { User } from '../createOrUpdateUser/user.reducer';

export const userMgmtInitial = createAction('User Mgmt');


export const userMgmtRespSuccess = createAction('User Mgmt Success', props<{ user: User[] }>());

export const userMgmtRespFailure = createAction('User Mgmt Failure', props<{ error: string }>());
